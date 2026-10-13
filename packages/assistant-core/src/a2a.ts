import type { AssistantStreamEvent, TurnState } from './events'

/**
 * A2A v1.0 (JSON-RPC binding) as the Patch service speaks it — only the parts
 * a chat client reads. The wire is strict: PascalCase methods, `ROLE_*` and
 * `TASK_STATE_*` enums, content parts `{ text }` / `{ data }` with no `kind`,
 * and stream frames that are JSON-RPC responses whose `result` is a oneOf of
 * `task` / `statusUpdate` / `artifactUpdate` / `message`. There is no `final`
 * flag: a turn ends on a terminal task state.
 */

export type A2ATaskState
  = | 'TASK_STATE_SUBMITTED'
    | 'TASK_STATE_WORKING'
    | 'TASK_STATE_INPUT_REQUIRED'
    | 'TASK_STATE_AUTH_REQUIRED'
    | 'TASK_STATE_COMPLETED'
    | 'TASK_STATE_FAILED'
    | 'TASK_STATE_CANCELED'
    | 'TASK_STATE_REJECTED'

export interface A2APart {
  text?: string
  data?: unknown
  metadata?: Record<string, unknown>
}

export interface A2AMessage {
  messageId?: string
  contextId?: string
  taskId?: string
  role?: 'ROLE_USER' | 'ROLE_AGENT'
  parts?: A2APart[]
  metadata?: Record<string, unknown>
}

export interface A2ATaskStatus {
  state: A2ATaskState
  message?: A2AMessage
  timestamp?: string
}

export interface A2AArtifact {
  artifactId: string
  name?: string
  parts?: A2APart[]
}

export interface A2ATask {
  id: string
  contextId?: string
  status?: A2ATaskStatus
  artifacts?: A2AArtifact[]
  history?: A2AMessage[]
  metadata?: Record<string, unknown>
}

export interface A2AStatusUpdate {
  taskId?: string
  contextId?: string
  status: A2ATaskStatus
}

export interface A2AArtifactUpdate {
  taskId?: string
  contextId?: string
  artifact: A2AArtifact
  /** Append to the artifact with this id; absent on the first chunk. */
  append?: boolean
  lastChunk?: boolean
}

export interface A2AStreamResult {
  task?: A2ATask
  statusUpdate?: A2AStatusUpdate
  artifactUpdate?: A2AArtifactUpdate
  message?: A2AMessage
}

export interface JsonRpcError {
  code: number
  message: string
  data?: unknown
}

export interface JsonRpcResponse<T> {
  jsonrpc: '2.0'
  id?: string | number | null
  result?: T
  error?: JsonRpcError
}

/** The fixed id of the artifact the service streams the answer into. */
export const RESPONSE_ARTIFACT_ID = 'response'

/** JSON-RPC error codes the A2A binding defines that a client acts on. */
export const A2A_ERROR = {
  TaskNotFound: -32001,
  TaskNotCancelable: -32002,
  InvalidParams: -32602,
  MethodNotFound: -32601,
} as const

/** A JSON-RPC error object returned by the service (HTTP 200 with `error`). */
export class A2ARpcError extends Error {
  readonly code: number
  readonly data?: unknown
  constructor(error: JsonRpcError) {
    super(error.message)
    this.name = 'A2ARpcError'
    this.code = error.code
    this.data = error.data
  }
}

const TERMINAL: Partial<Record<A2ATaskState, TurnState>> = {
  TASK_STATE_COMPLETED: 'completed',
  TASK_STATE_FAILED: 'failed',
  TASK_STATE_CANCELED: 'canceled',
  TASK_STATE_REJECTED: 'failed',
}

/** The turn state a task state ends in, or undefined while it is still running. */
export function terminalState(state: A2ATaskState | undefined): TurnState | undefined {
  return state ? TERMINAL[state] : undefined
}

/** Tool-activity payload the service puts in a working status update's data part. */
export interface ToolActivityData {
  kind: 'tool_call'
  phase: 'started' | 'finished'
  id?: string
  name: string
  summary?: string
  ok: boolean
  elapsedMs: number
}

export function isToolActivityData(value: unknown): value is ToolActivityData {
  if (typeof value !== 'object' || value === null)
    return false
  const v = value as Partial<ToolActivityData>
  return v.kind === 'tool_call' && (v.phase === 'started' || v.phase === 'finished') && typeof v.name === 'string' && v.name !== ''
}

/** All of a part list's text, concatenated. */
export function partsText(parts: A2APart[] | undefined): string {
  return (parts ?? []).map(p => (typeof p.text === 'string' ? p.text : '')).join('')
}

/** The answer a stored task holds: its `response` artifact's text (or every artifact's, failing that). */
export function taskResponseText(task: A2ATask): string {
  const artifacts = task.artifacts ?? []
  const response = artifacts.find(a => a.artifactId === RESPONSE_ARTIFACT_ID)
  if (response)
    return partsText(response.parts)
  return artifacts.map(a => partsText(a.parts)).join('')
}

/** Where a turn is, as seen from the frames so far. */
export interface A2AStreamState {
  taskId?: string
  contextId?: string
  /** Set once a terminal state has been seen; the turn is over. */
  terminal?: TurnState
  /** The answer text accumulated from artifact chunks. */
  text: string
}

/**
 * Maps A2A stream frames (or stored tasks) to normalized events. Stateful:
 * it tracks the task id, the accumulated answer (so a non-append chunk after
 * text has already streamed becomes a `text_replace`), and whether the turn
 * has ended (later frames are ignored).
 */
export class A2AStreamAdapter {
  readonly state: A2AStreamState = { text: '' }
  private readonly artifactsSeen = new Set<string>()

  /** Normalized events for one JSON-RPC frame. A JSON-RPC `error` throws {@link A2ARpcError}. */
  push(frame: JsonRpcResponse<A2AStreamResult>): AssistantStreamEvent[] {
    if (frame.error)
      throw new A2ARpcError(frame.error)
    const result = frame.result
    if (!result || this.state.terminal)
      return []
    if (result.task)
      return this.onTask(result.task)
    if (result.statusUpdate)
      return this.onStatus(result.statusUpdate)
    if (result.artifactUpdate)
      return this.onArtifact(result.artifactUpdate)
    if (result.message)
      return this.onMessage(result.message)
    return []
  }

  /**
   * Events for a stored task (a `GetTask` result, or the stream's first
   * frame). A terminal task replaces whatever text streamed with its stored
   * answer and ends the turn.
   */
  onTask(task: A2ATask): AssistantStreamEvent[] {
    this.track(task.id, task.contextId)
    const terminal = terminalState(task.status?.state)
    if (!terminal)
      return []
    const stored = taskResponseText(task)
    const events: AssistantStreamEvent[] = []
    if (stored && stored !== this.state.text) {
      events.push({ type: 'text_replace', text: stored })
      this.state.text = stored
    }
    events.push(this.done(terminal, task.status?.message))
    return events
  }

  private onStatus(update: A2AStatusUpdate): AssistantStreamEvent[] {
    this.track(update.taskId, update.contextId)
    const { state, message } = update.status
    const terminal = terminalState(state)
    if (terminal)
      return [this.done(terminal, message)]

    const events: AssistantStreamEvent[] = []
    for (const part of message?.parts ?? []) {
      if (!isToolActivityData(part.data))
        continue
      const d = part.data
      if (d.phase === 'started') {
        events.push({ type: 'tool_start', name: d.name, ...(d.id ? { id: d.id } : {}), ...(d.summary ? { summary: d.summary } : {}) })
      }
      else {
        events.push({ type: 'tool_finish', name: d.name, ok: Boolean(d.ok), elapsedMs: Number(d.elapsedMs) || 0, ...(d.id ? { id: d.id } : {}) })
      }
    }
    return events
  }

  private onArtifact(update: A2AArtifactUpdate): AssistantStreamEvent[] {
    this.track(update.taskId, update.contextId)
    const { artifact } = update
    // Only the answer artifact is chat text; anything else is not ours to show.
    if (artifact.artifactId !== RESPONSE_ARTIFACT_ID)
      return []
    const text = partsText(artifact.parts)
    const seen = this.artifactsSeen.has(artifact.artifactId)
    this.artifactsSeen.add(artifact.artifactId)
    if (update.append || !seen) {
      if (!text)
        return []
      this.state.text += text
      return [{ type: 'text_delta', text }]
    }
    // A fresh (non-append) chunk for an artifact we already have replaces it.
    this.state.text = text
    return [{ type: 'text_replace', text }]
  }

  private onMessage(message: A2AMessage): AssistantStreamEvent[] {
    // A direct message reply (no task): the whole answer, then the end.
    this.track(message.taskId, message.contextId)
    const text = partsText(message.parts)
    const events: AssistantStreamEvent[] = []
    if (text) {
      this.state.text += text
      events.push({ type: 'text_delta', text })
    }
    this.state.terminal = 'completed'
    events.push({ type: 'done', state: 'completed', ...(this.state.text ? { text: this.state.text } : {}) })
    return events
  }

  private done(state: TurnState, message: A2AMessage | undefined): AssistantStreamEvent {
    this.state.terminal = state
    const messageText = partsText(message?.parts)
    if (state === 'failed')
      return { type: 'done', state, error: messageText || 'The request failed.' }
    if (state === 'completed') {
      const text = messageText || this.state.text
      return text ? { type: 'done', state, text } : { type: 'done', state }
    }
    return { type: 'done', state }
  }

  private track(taskId: string | undefined, contextId: string | undefined): void {
    if (taskId && !this.state.taskId)
      this.state.taskId = taskId
    if (contextId && !this.state.contextId)
      this.state.contextId = contextId
  }
}

/** Builds the `SendStreamingMessage` params for one user turn. */
export function buildSendParams(input: {
  text: string
  contextId: string
  projectName: string
  messageId: string
  mentions?: { kind: string, name: string, apiGroup?: string }[]
}): { message: A2AMessage & { messageId: string, contextId: string, role: 'ROLE_USER', parts: { text: string }[], metadata: Record<string, unknown> } } {
  const metadata: Record<string, unknown> = { projectName: input.projectName }
  if (input.mentions && input.mentions.length > 0)
    metadata.mentions = input.mentions.map(m => ({ kind: m.kind, name: m.name, ...(m.apiGroup ? { apiGroup: m.apiGroup } : {}) }))
  return {
    message: {
      role: 'ROLE_USER',
      messageId: input.messageId,
      contextId: input.contextId,
      parts: [{ text: input.text }],
      metadata,
    },
  }
}
