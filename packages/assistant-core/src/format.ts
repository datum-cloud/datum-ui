import type { UIMessage } from 'ai'
import type { AssistantConfigData, ChatSummary, Turn } from './types'
import { firstText, isTextUIPart } from './parts'

/**
 * Neutral fallback config data so leaf components render without a host
 * having wired a full config. Hosts add their `renderLink` and override the
 * rest.
 */
export const DEFAULT_ASSISTANT_CONFIG: AssistantConfigData = {
  greeting: name => `Hey there${name ? `, ${name}` : ''}`,
  suggestions: [],
  showReasoning: true,
  modelSelector: false,
  toolLabels: {},
}

/** Human-friendly relative timestamp for the chat history list. */
export function formatRelativeTime(timestamp: number, now: number = Date.now()): string {
  const seconds = Math.floor((now - timestamp) / 1000)
  if (seconds < 60)
    return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60)
    return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24)
    return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days === 1)
    return 'Yesterday'
  if (days < 7)
    return `${days}d ago`
  return new Date(timestamp).toLocaleDateString()
}

/** The turn list (one per submitted prompt), for a turn rail or jump list. */
export function deriveTurns(messages: UIMessage[]): Turn[] {
  return messages
    .filter(m => m.role === 'user')
    .map(m => ({ id: m.id, text: m.parts.find(isTextUIPart)?.text ?? '' }))
}

/**
 * The label of a reasoning ("thinking") block: live while streaming, then the
 * measured duration in whole seconds once it's done, or just "Thought" when no
 * duration was measured (a block that arrived complete, e.g. from history).
 */
export function thinkingLabel(isStreaming: boolean, durationSeconds: number | null): string {
  if (isStreaming)
    return 'Thinking…'
  if (durationSeconds === null)
    return 'Thought'
  return durationSeconds < 1 ? 'Thought for less than 1 second' : `Thought for ${durationSeconds}s`
}

/** User-facing copy for a failed turn, from the error's message. */
export function assistantErrorMessage(error: Pick<Error, 'message'>): string {
  const { message } = error
  if (message.includes('429') || message.includes('Too Many'))
    return 'Easy there, speed racer! You\'ve hit the rate limit. Give it a minute and try again.'
  if (message.includes('503') || message.includes('not configured'))
    return 'AI assistant is not configured.'
  return `Something went wrong — ${message}`
}

/** A whole chat as Markdown: `# title`, then `## You` / `## Assistant` sections. */
export function chatToMarkdown(chat: Pick<ChatSummary, 'title' | 'messages'>): string {
  const lines = chat.messages.map((msg) => {
    const role = msg.role === 'user' ? 'You' : 'Assistant'
    const text = msg.parts
      .filter(isTextUIPart)
      .map(p => p.text)
      .join('\n')
    return `## ${role}\n\n${text}`
  })
  return `# ${chat.title}\n\n${lines.join('\n\n---\n\n')}\n`
}

/** A safe Markdown file name for a chat title, e.g. "My chat!" → "my-chat-.md". */
export function chatFileName(title: string): string {
  return `${title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.md`
}

export const NEW_CHAT_TITLE = 'New chat'

/** A provisional title from the first prompt, for a chat the server hasn't titled yet. */
export function deriveTitle(messages: UIMessage[], maxLength: number = 42): string {
  const first = messages.find(m => m.role === 'user')
  const text = first ? firstText(first) : ''
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text || NEW_CHAT_TITLE
}
