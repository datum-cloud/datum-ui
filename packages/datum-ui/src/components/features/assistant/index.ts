export {
  AssistantConfigProvider,
  DEFAULT_ASSISTANT_CONFIG,
  defaultRenderLink,
  useAssistantConfig,
} from './assistant-config'
// Props-driven assistant workspace + its composable pieces. The host owns state
// and transport (its own chat hook) and feeds them in; staff and cloud reuse
// the same presentational layer.
export { AssistantWorkspace, type AssistantWorkspaceProps } from './components/assistant-workspace'

export { BrainGlyph } from './components/brain-glyph'
export * from './components/composer'
export * from './components/conversation'
export { EmptyState } from './components/empty-state'
export * from './components/message'
export * from './components/sidebar'

export { formatRelativeTime } from './format-relative-time'
export { sanitizeUserHtml } from './sanitize-html'
export type {
  AssistantConfig,
  ChatSummary,
  EffortId,
  EffortOption,
  LinkRenderProps,
  ModelOption,
  ModelSelectorConfig,
  Turn,
} from './types'

export { useTurnRail } from './use-turn-rail'
