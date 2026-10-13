import type { DynamicToolUIPart, ToolUIPart, UIMessage } from 'ai'

export type { DynamicToolUIPart, TextUIPart, ToolUIPart, UIMessage, UIMessagePart } from 'ai'

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

/**
 * Props passed to a `renderLink` implementation (a link in the assistant's
 * markdown). `TNode` is the host's node type: `ReactNode` on the web and in
 * React Native; the core never renders anything itself.
 */
export interface LinkRenderProps<TNode = unknown> {
  href?: string
  children?: TNode
}

export interface ModelSelectorConfig {
  models: ModelOption[]
  efforts: EffortOption[]
  defaultModelId: string
  defaultEffortId: EffortId
}

/** The platform-free part of {@link AssistantConfig}: plain data and string builders. */
export interface AssistantConfigData {
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
}

/**
 * Everything that differs between host apps (staff vs cloud vs mobile).
 * Supplied once at the workspace root and read by leaf components, so the
 * presentational pieces stay generic and shell-agnostic.
 *
 * The render props are generic over the host's node type (`TNode`), so the
 * same shape serves React DOM and React Native.
 */
export interface AssistantConfig<TNode = unknown> extends AssistantConfigData {
  /** Renders links inside the assistant's markdown (internal routes, external, host-specific icons). */
  renderLink: (props: LinkRenderProps<TNode>) => TNode
  /** Override the per-message action toolbar (defaults to copy + download). */
  messageActions?: (msg: UIMessage) => TNode
  /**
   * Renders a completed tool call inline, in message order. Return a falsy value
   * to leave that tool invisible — the default for every tool, since most only
   * feed the model. Hosts use this to surface a result as UI (cloud-portal turns
   * an `openSupportTicket` result into a button).
   */
  renderToolOutput?: (part: ToolUIPart | DynamicToolUIPart, msg: UIMessage) => TNode
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
  /**
   * Archived (hidden but restorable). Only honoured when the host passes
   * `onArchiveChat`; otherwise every chat is listed regardless of this flag.
   */
  archived?: boolean
}

/** A resource the user pointed at with "@kind/name" — mirrors the service's `internal/a2a.Mention`. */
export interface Mention {
  kind: string
  name: string
  apiGroup?: string
}
