import type { A2AStreamResult, A2ATask, JsonRpcResponse } from './a2a'
import type { AssistantStreamEvent } from './events'
import type { ParseSSEOptions } from './sse'
import type { Mention } from './types'
import { A2A_ERROR, A2ARpcError, A2AStreamAdapter, buildSendParams } from './a2a'
import { parseSSE, parseSSEJson } from './sse'

/** The `init` subset the transport passes to `fetch`. */
export interface FetchInit {
  method?: string
  headers?: Record<string, string>
  body?: string
  signal?: AbortSignal
}

/** The `Response` subset the transport reads; the browser's, Node's and `expo/fetch`'s all fit. */
export interface FetchResponse {
  ok: boolean
  status: number
  headers: { get: (name: string) => string | null }
  body: ReadableStream<Uint8Array> | null
  text: () => Promise<string>
}

export type FetchLike = (url: string, init?: FetchInit) => Promise<FetchResponse>

/** A non-2xx HTTP response from the assistant (401/403 are auth failures, not JSON-RPC errors). */
export class AssistantHttpError extends Error {
  readonly status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = 'AssistantHttpError'
    this.status = status
  }
}

/** The stream ended without a terminal state and the turn could not be recovered. */
export class TurnInterruptedError extends Error {
  readonly taskId?: string
  constructor(message: string, taskId?: string) {
    super(message)
    this.name = 'TurnInterruptedError'
    this.taskId = taskId
  }
}

/** Reads a failed response into an {@link AssistantHttpError}, keeping the status in the message. */
export async function httpError(res: FetchResponse): Promise<AssistantHttpError> {
  const body = await res.text().catch(() => '')
  let detail = body.trim()
  try {
    const json = JSON.parse(body) as { error?: unknown, message?: unknown }
    if (typeof json.error === 'string' && json.error)
      detail = json.error
    else if (typeof json.message === 'string' && json.message)
      detail = json.message
    else if (typeof json.error === 'object' && json.error && typeof (json.error as { message?: unknown }).message === 'string')
      detail = (json.error as { message: string }).message
  }
  catch {
    // not JSON: keep the text
  }
  return new AssistantHttpError(res.status, `${detail || 'Request failed'} (HTTP ${res.status})`)
}

export interface AssistantTransportOptions {
  /** Service origin, e.g. `https://patch.datum.net` (no trailing `/a2a`). */
  baseUrl: string
  /** A `fetch` that can stream response bodies (`expo/fetch` in React Native). */
  fetch: FetchLike
  /** The caller's current access token (a Datum/Zitadel access token). */
  getToken: () => Promise<string>
  /**
   * Called once when the service answers 401 with `rejected`; resolve a fresh
   * token to retry the request with it. Omit to fail on the first 401.
   */
  refreshToken?: (rejected: string) => Promise<string>
  /** Message/request id generator. Defaults to `crypto.randomUUID()` where available. */
  newId?: () => string
  /** Passed to the SSE parser (e.g. a decoder factory). */
  sse?: Omit<ParseSSEOptions, 'signal'>
  /** Timer used by recovery polling; injectable for tests. */
  sleep?: (ms: number, signal?: AbortSignal) => Promise<void>
  /** How long to poll `GetTask` for a turn whose stream dropped. Default 5 minutes. */
  recoverTimeoutMs?: number
}

export interface SendStreamingInput {
  text: string
  /** The conversation id. A new UUID starts a conversation: there is no create call. */
  contextId: string
  projectName: string
  mentions?: Mention[]
  messageId?: string
  signal?: AbortSignal
  /** Called once the service has assigned the turn's task id (for Stop and recovery). */
  onTask?: (info: { taskId: string, contextId?: string }) => void
  /** Called when the stream dropped and the transport is polling for the stored answer. */
  onRecovering?: (taskId: string) => void
}

export interface RenameInput {
  contextId: string
  projectName: string
  name: string
}

/** Most characters a conversation name may have (the service rejects longer ones). */
export const MAX_CONVERSATION_NAME_LENGTH = 80

export function randomId(): string {
  const c = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto
  if (c?.randomUUID)
    return c.randomUUID()
  // RFC 4122 v4 shape from Math.random — only for runtimes without crypto.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (ch) => {
    const r = Math.floor(Math.random() * 16)
    return (ch === 'x' ? r : (r % 4) + 8).toString(16)
  })
}

function defaultSleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortError())
      return
    }
    let timer: ReturnType<typeof setTimeout> | undefined
    const onAbort = () => {
      clearTimeout(timer)
      reject(abortError())
    }
    timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort)
      resolve()
    }, ms)
    signal?.addEventListener('abort', onAbort, { once: true })
  })
}

function abortError(): Error {
  const err = new Error('The operation was aborted.')
  err.name = 'AbortError'
  return err
}

/** Whether an error is an abort (the user stopped the turn or left the chat). */
export function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError'
}

/**
 * The chat transport for Patch's A2A endpoint (`{baseUrl}/a2a`), with the
 * `fetch`, base URL and token source injected so it runs unchanged in the
 * browser, Node and React Native.
 */
export function createAssistantTransport(options: AssistantTransportOptions): {
  sendStreaming: (input: SendStreamingInput) => AsyncGenerator<AssistantStreamEvent>
  cancel: (taskId: string) => Promise<boolean>
  getTask: (taskId: string, signal?: AbortSignal) => Promise<A2ATask>
  rename: (input: RenameInput) => Promise<{ name: string }>
  rpc: <T>(method: string, params: unknown, signal?: AbortSignal) => Promise<T>
} {
  const baseUrl = options.baseUrl.replace(/\/+$/, '')
  const newId = options.newId ?? randomId
  const sleep = options.sleep ?? defaultSleep
  const recoverTimeoutMs = options.recoverTimeoutMs ?? 5 * 60_000

  /** POST with the bearer token; on a 401, refresh once and retry. */
  async function post(path: string, body: unknown, accept: string, signal?: AbortSignal): Promise<FetchResponse> {
    const payload = JSON.stringify(body)
    const send = (token: string) => options.fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Accept': accept,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: payload,
      signal,
    })
    let token = await options.getToken()
    let res = await send(token)
    if (res.status === 401 && options.refreshToken) {
      await res.text().catch(() => '')
      token = await options.refreshToken(token)
      res = await send(token)
    }
    return res
  }

  async function rpc<T>(method: string, params: unknown, signal?: AbortSignal): Promise<T> {
    const res = await post('/a2a', { jsonrpc: '2.0', id: newId(), method, params }, 'application/json', signal)
    if (!res.ok)
      throw await httpError(res)
    const json = JSON.parse(await res.text()) as JsonRpcResponse<T>
    if (json.error)
      throw new A2ARpcError(json.error)
    return json.result as T
  }

  function getTask(taskId: string, signal?: AbortSignal): Promise<A2ATask> {
    return rpc<A2ATask>('GetTask', { id: taskId, historyLength: 0 }, signal)
  }

  /** Asks the service to stop a turn. False when it had already finished (or never existed). */
  async function cancel(taskId: string): Promise<boolean> {
    try {
      await rpc<A2ATask>('CancelTask', { id: taskId })
      return true
    }
    catch (error) {
      if (error instanceof A2ARpcError && (error.code === A2A_ERROR.TaskNotCancelable || error.code === A2A_ERROR.TaskNotFound))
        return false
      throw error
    }
  }

  /**
   * Polls `GetTask` until the turn reaches a terminal state (first look after
   * 1s, doubling to 8s, bounded by `recoverTimeoutMs`), yielding the stored
   * answer (as a `text_replace`) and the terminal `done`.
   */
  async function* recover(adapter: A2AStreamAdapter, taskId: string, signal?: AbortSignal): AsyncGenerator<AssistantStreamEvent> {
    const deadline = Date.now() + recoverTimeoutMs
    let delay = 1000
    while (Date.now() < deadline) {
      await sleep(delay, signal)
      delay = Math.min(delay * 2, 8000)
      let task: A2ATask
      try {
        task = await getTask(taskId, signal)
      }
      catch (error) {
        if (isAbortError(error) || signal?.aborted)
          throw error
        // A refused GetTask (auth, unknown task) won't get better by polling.
        if (error instanceof AssistantHttpError || error instanceof A2ARpcError)
          throw error
        continue // network blip: keep polling
      }
      const events = adapter.onTask(task)
      if (adapter.state.terminal) {
        yield* events
        return
      }
    }
    throw new TurnInterruptedError('The connection dropped and the answer did not arrive in time.', taskId)
  }

  async function* sendStreaming(input: SendStreamingInput): AsyncGenerator<AssistantStreamEvent> {
    const { signal } = input
    const params = buildSendParams({
      text: input.text,
      contextId: input.contextId,
      projectName: input.projectName,
      messageId: input.messageId ?? newId(),
      mentions: input.mentions,
    })
    const res = await post('/a2a', { jsonrpc: '2.0', id: newId(), method: 'SendStreamingMessage', params }, 'text/event-stream', signal)
    if (!res.ok)
      throw await httpError(res)

    const contentType = res.headers.get('content-type') ?? ''
    if (!contentType.includes('text/event-stream') || !res.body) {
      // Validation failures come back as a plain JSON-RPC error (HTTP 200).
      const text = await res.text()
      let json: JsonRpcResponse<A2AStreamResult> | undefined
      try {
        json = JSON.parse(text) as JsonRpcResponse<A2AStreamResult>
      }
      catch {
        throw new AssistantHttpError(res.status, `Unexpected response from the assistant (${contentType || 'no content type'})`)
      }
      if (json.error)
        throw new A2ARpcError(json.error)
      throw new AssistantHttpError(res.status, 'The assistant did not stream a reply.')
    }

    const adapter = new A2AStreamAdapter()
    let announced = false
    const announce = () => {
      if (!announced && adapter.state.taskId) {
        announced = true
        input.onTask?.({ taskId: adapter.state.taskId, contextId: adapter.state.contextId })
      }
    }

    let dropped: unknown
    try {
      for await (const message of parseSSE(res.body, { ...options.sse, signal })) {
        const frame = parseSSEJson(message)
        if (!frame || typeof frame !== 'object')
          continue
        const events = adapter.push(frame as JsonRpcResponse<A2AStreamResult>)
        announce()
        yield* events
        if (adapter.state.terminal)
          return
      }
    }
    catch (error) {
      if (error instanceof A2ARpcError || isAbortError(error) || signal?.aborted)
        throw error
      dropped = error
    }
    if (signal?.aborted)
      throw abortError()

    // The stream stopped without a terminal state: the connection dropped,
    // not the turn. The work continues server-side, so poll for the answer.
    const taskId = adapter.state.taskId
    if (!taskId) {
      throw new TurnInterruptedError(
        dropped instanceof Error ? dropped.message : 'The connection to the assistant dropped.',
      )
    }
    input.onRecovering?.(taskId)
    yield* recover(adapter, taskId, signal)
  }

  async function rename({ contextId, projectName, name }: RenameInput): Promise<{ name: string }> {
    const trimmed = name.trim()
    if (!trimmed)
      throw new Error('A name is required.')
    if ([...trimmed].length > MAX_CONVERSATION_NAME_LENGTH)
      throw new Error(`Names can be at most ${MAX_CONVERSATION_NAME_LENGTH} characters.`)
    const res = await post('/v1alpha1/conversations/rename', { contextId, projectName, name: trimmed }, 'application/json')
    if (!res.ok)
      throw await httpError(res)
    const json = JSON.parse(await res.text()) as { name?: string }
    return { name: json.name ?? trimmed }
  }

  return { sendStreaming, cancel, getTask, rename, rpc }
}

export type AssistantTransport = ReturnType<typeof createAssistantTransport>
