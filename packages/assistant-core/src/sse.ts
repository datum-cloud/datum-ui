import type { AssistantStreamEvent } from './events'
import { isAssistantStreamEvent } from './events'

/**
 * Manual `text/event-stream` parsing over a fetch response body.
 *
 * The assistant streams in response to a POST, so `EventSource` (GET-only)
 * can't be used. The caller hands in the body stream from whichever `fetch`
 * can stream on its platform (the browser's, Node's, `expo/fetch` in React
 * Native) and this splits it into SSE events per the spec.
 */

/** One server-sent event. `data` is the `data:` lines joined with `\n`. */
export interface SSEMessage {
  event?: string
  id?: string
  data: string
}

/**
 * Parses one raw event block (the text between two blank lines). Returns
 * undefined for a block with no `data:` field, such as a `: ping` comment
 * heartbeat.
 */
export function parseSSEBlock(block: string): SSEMessage | undefined {
  const data: string[] = []
  let event: string | undefined
  let id: string | undefined
  for (const line of block.split('\n')) {
    if (line === '' || line.startsWith(':'))
      continue
    const colon = line.indexOf(':')
    const field = colon === -1 ? line : line.slice(0, colon)
    // A single leading space after the colon is not part of the value.
    const value = colon === -1 ? '' : line.slice(colon + 1).replace(/^ /, '')
    if (field === 'data')
      data.push(value)
    else if (field === 'event')
      event = value
    else if (field === 'id')
      id = value
  }
  if (data.length === 0)
    return undefined
  return { data: data.join('\n'), ...(event !== undefined ? { event } : {}), ...(id !== undefined ? { id } : {}) }
}

export interface ParseSSEOptions {
  /** Stops reading (and releases the reader) once aborted. */
  signal?: AbortSignal
  /** Text decoder factory; defaults to the global `TextDecoder` (present in browsers, Node and Hermes). */
  createDecoder?: () => { decode: (input?: Uint8Array, options?: { stream?: boolean }) => string }
}

/**
 * Reads `body` as a UTF-8 event stream and yields each event as it arrives.
 * CRLF and CR line endings are normalized; comment lines (`: ping`) and
 * data-less blocks are skipped; a trailing event without a final blank line
 * is still delivered when the stream ends.
 */
export async function* parseSSE(
  body: ReadableStream<Uint8Array>,
  options: ParseSSEOptions = {},
): AsyncGenerator<SSEMessage> {
  const reader = body.getReader()
  const decoder = options.createDecoder?.() ?? new TextDecoder('utf-8')
  const { signal } = options
  let buffer = ''
  let pendingCR = false
  const onAbort = () => {
    reader.cancel().catch(() => {})
  }
  signal?.addEventListener('abort', onAbort)

  try {
    for (;;) {
      if (signal?.aborted)
        return
      const { value, done } = await reader.read()
      if (done)
        break
      let text = decoder.decode(value, { stream: true })
      // A CR at the end of a chunk may be the first half of a CRLF split
      // across chunks: hold it back so it isn't read as a line break twice.
      if (pendingCR) {
        text = `\r${text}`
        pendingCR = false
      }
      if (text.endsWith('\r')) {
        pendingCR = true
        text = text.slice(0, -1)
      }
      buffer += text.replace(/\r\n?/g, '\n')
      let boundary = buffer.indexOf('\n\n')
      while (boundary !== -1) {
        const block = buffer.slice(0, boundary)
        buffer = buffer.slice(boundary + 2)
        const message = parseSSEBlock(block)
        if (message)
          yield message
        boundary = buffer.indexOf('\n\n')
      }
    }
    buffer += decoder.decode().replace(/\r\n?/g, '\n') + (pendingCR ? '\n' : '')
    if (buffer.trim() !== '') {
      const message = parseSSEBlock(buffer)
      if (message)
        yield message
    }
  }
  finally {
    signal?.removeEventListener('abort', onAbort)
    try {
      reader.releaseLock()
    }
    catch {
      // Already released (the stream was canceled).
    }
  }
}

/** Parses an event's `data` as JSON, or undefined when it isn't JSON (or is `[DONE]`). */
export function parseSSEJson(message: SSEMessage): unknown {
  if (message.data === '' || message.data === '[DONE]')
    return undefined
  try {
    return JSON.parse(message.data) as unknown
  }
  catch {
    return undefined
  }
}

/**
 * The service's flat `/chat/.../sendmessage` stream (and the portal's proxy of
 * it) as normalized events. Malformed or unknown-shaped events are skipped
 * rather than thrown, so one bad frame doesn't kill the turn.
 */
export async function* parseAssistantEventStream(
  body: ReadableStream<Uint8Array>,
  options: ParseSSEOptions = {},
): AsyncGenerator<AssistantStreamEvent> {
  for await (const message of parseSSE(body, options)) {
    const payload = parseSSEJson(message)
    if (isAssistantStreamEvent(payload))
      yield payload
  }
}
