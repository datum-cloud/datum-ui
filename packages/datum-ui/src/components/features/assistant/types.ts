import type {
  AssistantConfig as CoreAssistantConfig,
  LinkRenderProps as CoreLinkRenderProps,
} from '@datum-cloud/datum-ui-assistant-core'
import type { ReactNode } from 'react'

// The platform-free shapes live in @datum-cloud/datum-ui-assistant-core,
// shared with the React Native assistant; this file binds them to React.
export type {
  ChatSummary,
  EffortId,
  EffortOption,
  ModelOption,
  ModelSelectorConfig,
  Turn,
} from '@datum-cloud/datum-ui-assistant-core'

/** Props passed to a `renderLink` implementation (a link in the assistant's markdown). */
export type LinkRenderProps = CoreLinkRenderProps<ReactNode>

/**
 * Everything that differs between host apps (staff vs cloud). Supplied once at
 * the workspace root and read by leaf components via `useAssistantConfig()`, so
 * the presentational pieces stay generic and shell-agnostic.
 */
export type AssistantConfig = CoreAssistantConfig<ReactNode>

/**
 * How tightly a conversation is laid out. `default` is the full assistant
 * workspace; `compact` suits a conversation embedded in another page: an
 * avatar beside each assistant turn, a narrower column, one-step-smaller body
 * text and tighter markdown spacing.
 */
export type ConversationDensity = 'default' | 'compact'
