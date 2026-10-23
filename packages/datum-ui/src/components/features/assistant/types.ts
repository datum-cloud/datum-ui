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
 * workspace; `compact` suits a conversation embedded in another page: it fills
 * the host's width, puts an avatar beside each assistant turn, tightens
 * markdown spacing and uses a one-line composer.
 */
export type ConversationDensity = 'default' | 'compact'

/** The message part type that carries a pick-one question (see {@link AssistantChoicesData}). */
export const CHOICES_PART_TYPE = 'data-choices'

/** Icon names a choice option may carry. Anything else renders with no icon. */
export type AssistantChoiceIcon
  = | 'clock'
    | 'container'
    | 'database'
    | 'domain'
    | 'globe'
    | 'laptop'
    | 'location'
    | 'network'
    | 'server'
    | 'shield'

/** One answer to a pick-one question. `label` is sent back as the person's reply. */
export interface AssistantChoiceOption {
  id: string
  label: string
  icon?: AssistantChoiceIcon | string
}

/**
 * The data of a `data-choices` message part: a question the assistant put to
 * the person as buttons. `selectedId` is set once they pick one.
 */
export interface AssistantChoicesData {
  question: string
  options: AssistantChoiceOption[]
  selectedId?: string
}

/** The message part type that carries a plan the person can approve (see {@link AssistantPlanData}). */
export const PLAN_PART_TYPE = 'data-plan'

/** One resource a plan creates or changes, in apply order. */
export interface AssistantPlanResource {
  kind: string
  name: string
  namespace?: string
  action: 'create' | 'update' | string
  /** One plain-language line on what it does for the person. */
  summary?: string
  /** What an update changes, one line per change. */
  diff?: string[]
  /** The manifest the plan covers, as YAML. */
  manifest: string
}

/** One resource applying a plan created or changed. */
export interface AssistantAppliedResource {
  action: string
  kind: string
  name: string
  namespace?: string
}

/**
 * Where a plan is. `pending` waits for the person; `applying` is their
 * approval in flight; `applied` and `failed` are its outcome. Expired and
 * replaced are not stored: the card works them out from `expiresAt` and from
 * whether a newer plan exists.
 */
export type AssistantPlanStatus = 'pending' | 'applying' | 'applied' | 'failed'

/**
 * The data of a `data-plan` message part: a change the assistant settled and
 * the token that applies exactly it. The part's `id` names the plan.
 */
export interface AssistantPlanData {
  token: string
  /** When the plan stops being accepted, RFC 3339. */
  expiresAt: string
  resources: AssistantPlanResource[]
  status: AssistantPlanStatus
  /** When the person approved it, RFC 3339. */
  approvedAt?: string
  applied?: AssistantAppliedResource[]
  error?: string
}
