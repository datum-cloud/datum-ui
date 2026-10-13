import type { DynamicToolUIPart, TextUIPart, UIMessage } from 'ai'
import type { AssistantStreamEvent } from './events'

type Part = UIMessage['parts'][number]

export interface ApplyEventOptions {
  /** The assistant message to update. Defaults to the last assistant message. */
  messageId?: string
  /** Id for a `tool_start` that carries none. Defaults to a random id. */
  newId?: () => string
}

let fallbackSeq = 0
function defaultId(): string {
  fallbackSeq += 1
  return `tool-${Date.now().toString(36)}-${fallbackSeq}`
}

function appendText(parts: Part[], text: string): Part[] {
  const last = parts[parts.length - 1]
  if (last?.type === 'text')
    return [...parts.slice(0, -1), { ...last, text: last.text + text, state: 'streaming' }]
  const part: TextUIPart = { type: 'text', text, state: 'streaming' }
  return [...parts, part]
}

/** Drop every text part and put `text` in their place (where the first one was). */
function replaceText(parts: Part[], text: string): Part[] {
  const firstTextIndex = parts.findIndex(p => p.type === 'text')
  const rest = parts.filter(p => p.type !== 'text')
  const part: TextUIPart = { type: 'text', text, state: 'streaming' }
  if (firstTextIndex === -1)
    return [...rest, part]
  // Count the non-text parts that sat before the first text part.
  const before = parts.slice(0, firstTextIndex).filter(p => p.type !== 'text').length
  return [...rest.slice(0, before), part, ...rest.slice(before)]
}

function startTool(parts: Part[], event: Extract<AssistantStreamEvent, { type: 'tool_start' }>, newId: () => string): Part[] {
  const part: DynamicToolUIPart = {
    type: 'dynamic-tool',
    toolName: event.name,
    toolCallId: event.id || newId(),
    state: 'input-available',
    input: event.summary ? { summary: event.summary } : {},
  }
  return [...parts, part]
}

/**
 * The tool call a `tool_finish` closes: by id when it has one, otherwise the
 * most recently started call of that name that is still running (the service
 * omits the id when the provider assigned none).
 */
function finishTarget(parts: Part[], event: Extract<AssistantStreamEvent, { type: 'tool_finish' }>): string | undefined {
  if (event.id)
    return event.id
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i]!
    if (p.type === 'dynamic-tool' && p.state === 'input-available' && p.toolName === event.name)
      return p.toolCallId
  }
  return undefined
}

function finishTool(parts: Part[], event: Extract<AssistantStreamEvent, { type: 'tool_finish' }>): Part[] {
  const toolCallId = finishTarget(parts, event)
  return parts.map((p) => {
    if (p.type !== 'dynamic-tool' || p.toolCallId !== toolCallId)
      return p
    // Widen the (state-narrowed) input back to `unknown` and carry it forward
    // explicitly: the union's other branches make `input` optional, so a plain
    // spread can't satisfy DynamicToolUIPart's per-state required fields.
    const input: unknown = p.input
    if (event.ok) {
      const done: DynamicToolUIPart = {
        type: 'dynamic-tool',
        toolName: p.toolName,
        toolCallId: p.toolCallId,
        input,
        state: 'output-available',
        output: { ok: true, elapsedMs: event.elapsedMs },
      }
      return done
    }
    const failed: DynamicToolUIPart = {
      type: 'dynamic-tool',
      toolName: p.toolName,
      toolCallId: p.toolCallId,
      input,
      state: 'output-error',
      errorText: `${event.name} failed`,
    }
    return failed
  })
}

function finishTurn(parts: Part[], event: Extract<AssistantStreamEvent, { type: 'done' }>): Part[] {
  let next = parts.map(p => (p.type === 'text' ? ({ ...p, state: 'done' } as TextUIPart) : p))
  // The server's final text should match what the deltas accumulated; only
  // backfill when there is none (a turn that streamed no text deltas).
  if (event.text && !next.some(p => p.type === 'text'))
    next = [...next, { type: 'text', text: event.text, state: 'done' } satisfies TextUIPart]
  // A turn that ended while a tool was still "running" (canceled, failed)
  // must not leave a working indicator spinning forever.
  return next.map((p) => {
    if (p.type !== 'dynamic-tool' || (p.state !== 'input-available' && p.state !== 'input-streaming'))
      return p
    const input: unknown = p.input
    const stopped: DynamicToolUIPart = {
      type: 'dynamic-tool',
      toolName: p.toolName,
      toolCallId: p.toolCallId,
      input,
      state: 'output-error',
      errorText: event.state === 'completed' ? `${p.toolName} did not report back` : `Turn ${event.state}`,
    }
    return stopped
  })
}

/** Applies one normalized event to a message's parts. */
export function applyEventToParts(parts: Part[], event: AssistantStreamEvent, newId: () => string = defaultId): Part[] {
  switch (event.type) {
    case 'text_delta':
      return event.text ? appendText(parts, event.text) : parts
    case 'text_replace':
      return replaceText(parts, event.text)
    case 'tool_start':
      return startTool(parts, event, newId)
    case 'tool_finish':
      return finishTool(parts, event)
    case 'done':
      return finishTurn(parts, event)
  }
}

/**
 * Reduces one normalized stream event into the transcript: text deltas append
 * to the assistant message's trailing text part, tool calls become
 * `dynamic-tool` parts (`input-available` → `output-available`/`output-error`),
 * and `done` settles every part. Returns a new array; messages other than the
 * target keep their identity, so list rows can skip re-rendering.
 *
 * The status/error a `done` implies is the caller's to track (see
 * {@link turnOutcome}); this only shapes the parts.
 */
export function applyAssistantEvent(
  messages: UIMessage[],
  event: AssistantStreamEvent,
  options: ApplyEventOptions = {},
): UIMessage[] {
  let index = -1
  if (options.messageId) {
    index = messages.findIndex(m => m.id === options.messageId)
  }
  else {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i]!.role === 'assistant') {
        index = i
        break
      }
    }
  }
  if (index === -1)
    return messages
  const target = messages[index]!
  const parts = applyEventToParts(target.parts, event, options.newId)
  if (parts === target.parts)
    return messages
  const next = messages.slice()
  next[index] = { ...target, parts }
  return next
}

/** What a terminal event means for the chat: the next status, and an error to show for a failed turn. */
export function turnOutcome(event: Extract<AssistantStreamEvent, { type: 'done' }>): { status: 'ready' | 'error', error?: Error } {
  if (event.state === 'failed')
    return { status: 'error', error: new Error(event.error || 'The request failed.') }
  return { status: 'ready' }
}
