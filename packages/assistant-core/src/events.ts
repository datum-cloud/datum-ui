/**
 * The normalized assistant event vocabulary — the same flat events the
 * service's `POST /chat/conversations/{id}/sendmessage` streams and the chat
 * kit consumes (`text_delta` / `tool_start` / `tool_finish` / `done`), plus
 * `text_replace` for recovering a turn whose stream dropped (the stored
 * answer replaces the fragment wholesale; there is no offset to resume from).
 *
 * The A2A adapter (`a2a.ts`) maps JSON-RPC stream frames to these, so the
 * reducer (`reducer.ts`) and the UI never see the wire protocol.
 */

export interface TextDeltaEvent {
  type: 'text_delta'
  text: string
}

export interface TextReplaceEvent {
  type: 'text_replace'
  text: string
}

export interface ToolStartEvent {
  type: 'tool_start'
  id?: string
  name: string
  summary?: string
}

export interface ToolFinishEvent {
  type: 'tool_finish'
  id?: string
  name: string
  ok: boolean
  elapsedMs: number
}

export type TurnState = 'completed' | 'failed' | 'canceled'

export interface DoneEvent {
  type: 'done'
  state: TurnState
  /** The authoritative final answer (completed only). */
  text?: string
  /** The failure reason (failed only). */
  error?: string
}

export type AssistantStreamEvent = TextDeltaEvent | TextReplaceEvent | ToolStartEvent | ToolFinishEvent | DoneEvent

const EVENT_TYPES = new Set<AssistantStreamEvent['type']>(['text_delta', 'text_replace', 'tool_start', 'tool_finish', 'done'])

export function isAssistantStreamEvent(value: unknown): value is AssistantStreamEvent {
  if (typeof value !== 'object' || value === null)
    return false
  const type = (value as { type?: unknown }).type
  return typeof type === 'string' && EVENT_TYPES.has(type as AssistantStreamEvent['type'])
}
