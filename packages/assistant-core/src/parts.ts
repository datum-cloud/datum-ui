import type { DynamicToolUIPart, ReasoningUIPart, TextUIPart, ToolUIPart, UIMessage } from 'ai'

/**
 * UIMessage part guards, matching the `ai@7` exports of the same names.
 *
 * They are re-implemented (one line each) rather than imported because `ai`
 * ships as one ~600 KB module: Metro has no tree shaking, so a runtime import
 * here would pull the whole SDK into every React Native bundle just for these
 * checks. `ai` stays a type-only dependency. `parts.test.ts` pins them to the
 * real `ai` guards so they can't drift.
 */
type AnyPart = UIMessage['parts'][number]

export function isTextUIPart(part: AnyPart): part is TextUIPart {
  return part.type === 'text'
}

export function isReasoningUIPart(part: AnyPart): part is ReasoningUIPart {
  return part.type === 'reasoning'
}

export function isDynamicToolUIPart(part: AnyPart): part is DynamicToolUIPart {
  return part.type === 'dynamic-tool'
}

export function isToolUIPart(part: AnyPart): part is ToolUIPart | DynamicToolUIPart {
  return part.type.startsWith('tool-') || isDynamicToolUIPart(part)
}

export function getToolName(part: ToolUIPart | DynamicToolUIPart): string {
  return isDynamicToolUIPart(part) ? part.toolName : part.type.split('-').slice(1).join('-')
}

/** All of a message's text parts, joined with a blank line (copy / download / share). */
export function messageText(msg: UIMessage): string {
  return msg.parts
    .filter(isTextUIPart)
    .map(p => p.text)
    .join('\n\n')
}

/** The first text part of a message, or "" — a user prompt's text. */
export function firstText(msg: UIMessage): string {
  return msg.parts.find(isTextUIPart)?.text ?? ''
}

/** Whether a message has any non-empty text yet. */
export function hasText(msg: UIMessage): boolean {
  return msg.parts.some(p => isTextUIPart(p) && Boolean(p.text))
}

/** The tool call still in flight (input streaming or awaiting output), if any. */
export function activeToolPart(msg: UIMessage): ToolUIPart | DynamicToolUIPart | undefined {
  return msg.parts.find(
    (p): p is ToolUIPart | DynamicToolUIPart =>
      isToolUIPart(p) && (p.state === 'input-streaming' || p.state === 'input-available'),
  )
}

/** Inputs for the per-message loading derivations. */
export interface MessageActivityInput {
  msg: UIMessage
  isLastMessage: boolean
  /** The host chat status (`ready` | `submitted` | `streaming` | `error`). */
  status: string
}

/** Whether this message is the one currently streaming. */
export function isStreamingMessage({ isLastMessage, status }: Omit<MessageActivityInput, 'msg'>): boolean {
  return isLastMessage && status === 'streaming'
}

/** Show the bare "thinking" dots: streaming, no text yet and no tool running. */
export function showInitialLoading(input: MessageActivityInput): boolean {
  return isStreamingMessage(input) && !hasText(input.msg) && !activeToolPart(input.msg)
}

/** Show the "working" line with a tool label: the last message has a tool in flight. */
export function showToolIndicator({ msg, isLastMessage }: Omit<MessageActivityInput, 'status'>): boolean {
  return isLastMessage && activeToolPart(msg) != null
}

/** Default label for a tool with no entry in `toolLabels`. */
export const DEFAULT_TOOL_LABEL = 'Working…'

/** The progress label for a tool part: the host's label for that tool name, else a fallback. */
export function toolLabel(
  part: ToolUIPart | DynamicToolUIPart,
  toolLabels: Record<string, string>,
  fallback: string = DEFAULT_TOOL_LABEL,
): string {
  return toolLabels[getToolName(part)] ?? fallback
}
