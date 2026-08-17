import type { DynamicToolUIPart, ToolUIPart, UIMessage } from 'ai'
import type { ReactNode } from 'react'

export type EffortId = 'low' | 'medium' | 'high'

export interface ModelOption {
  /** Stable id sent to the server; must match the allowlist in server/routes/assistant.ts. */
  id: string
  label: string
}

export interface EffortOption {
  id: EffortId
  label: string
}

/** One submitted prompt — the unit tracked by the right-edge turn rail. */
export interface Turn {
  id: string
  text: string
}

/** Props passed to a `renderLink` implementation (a link in the assistant's markdown). */
export interface LinkRenderProps {
  href?: string
  children?: ReactNode
}

export interface ModelSelectorConfig {
  models: ModelOption[]
  efforts: EffortOption[]
  defaultModelId: string
  defaultEffortId: EffortId
}

/**
 * Everything that differs between host apps (staff vs cloud). Supplied once at
 * the workspace root and read by leaf components via `useAssistantConfig()`, so
 * the presentational pieces stay generic and shell-agnostic.
 */
export interface AssistantConfig {
  /** Greeting line on the empty state, e.g. "Hey there, Jacob". */
  greeting: (name?: string) => string
  /** Starter prompts on the empty state. */
  suggestions: string[]
  /** Whether to render the assistant's reasoning ("thinking") blocks. */
  showReasoning: boolean
  /** Model + effort picker config, or `false` to hide the control. */
  modelSelector: ModelSelectorConfig | false
  /** Tool name → progress label ("Searching users…"). Host-specific tool set. */
  toolLabels: Record<string, string>
  /** Renders links inside the assistant's markdown (internal routes, external, host-specific icons). */
  renderLink: (props: LinkRenderProps) => ReactNode
  /** Override the per-message action toolbar (defaults to copy + download). */
  messageActions?: (msg: UIMessage) => ReactNode
  /**
   * Renders a completed tool call inline, in message order. Return a falsy value
   * to leave that tool invisible — the default for every tool, since most only
   * feed the model. Hosts use this to surface a result as UI (cloud-portal turns
   * an `openSupportTicket` result into a button).
   */
  renderToolOutput?: (part: ToolUIPart | DynamicToolUIPart, msg: UIMessage) => ReactNode
}

/**
 * Minimal shape the history list needs. Host apps pass their own richer chat
 * objects (they're structurally compatible) — persistence lives in the host.
 */
export interface ChatSummary {
  id: string
  title: string
  updatedAt: number
  messages: UIMessage[]
}
