import type { ReactNode } from 'react'
import type { ButtonProps } from '../../base/button'

// --- Task Status ---

export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'

/** Terminal states a task can settle into. Shared by every "outcome" shape. */
export type TerminalTaskStatus = Extract<TaskStatus, 'completed' | 'failed' | 'cancelled'>

/** Canonical per-item result status used across item-result shapes. */
export type ItemStatus = 'succeeded' | 'failed'

// --- Shared item shapes ---

/** A single failed item recorded on a task/outcome/context. */
export interface FailedItem {
  id?: string
  message: string
}

// --- Task Metadata ---

export interface TaskMetadata {
  /** Scope type: 'project' | 'org' | 'user' | custom */
  scope?: string
  /** Project ID for project-scoped tasks */
  projectId?: string
  /** Human-readable project name */
  projectName?: string
  /** Organization ID */
  orgId?: string
  /** Human-readable organization name */
  orgName?: string
  /** Extensible bag for any additional, consumer-defined context. */
  extra?: Record<string, unknown>
}

// --- Completion Info ---

export interface TaskCompletionInfo<TItem = unknown> {
  status: TaskStatus
  completed: number
  failed: number
  items: Array<{ id: string, status: ItemStatus, message?: string, data: TItem }>
}

// --- Task ---

export interface Task<TResult = unknown, TItem = unknown> {
  id: string
  title: string
  status: TaskStatus
  icon?: ReactNode
  category?: string
  metadata?: TaskMetadata

  // Items (optional — omit for single-process tasks)
  items?: unknown[]
  total?: number

  // Counters
  completed: number
  failed: number

  // Item tracking for retry
  succeededItems: string[]
  failedItems: FailedItem[]
  errorStrategy: 'continue' | 'stop'

  // Capabilities
  cancelable: boolean
  retryable: boolean
  confirmBeforeUnload: boolean

  // Result storage
  result?: TResult

  // Actions
  completionActions?:
    | ButtonProps[]
    | ((result: TResult, info: TaskCompletionInfo<TItem>) => ButtonProps[])

  // Retry tracking
  retryOf?: string
  retryCount: number

  // Internal: processor reference (not serializable)
  _processor?: TaskProcessor<TResult>
  _originalItems?: unknown[]

  // Timestamps
  createdAt: number
  startedAt?: number
  completedAt?: number
}

/**
 * The serializable public view of a task — everything storage persists and the
 * UI renders. Non-serializable engine internals live in {@link TaskRuntime}.
 */
export type TaskView<TResult = unknown, TItem = unknown> = Task<TResult, TItem>

// --- Task processor ---

export type TaskProcessor<TResult = unknown> = (
  ctx: TaskContext<unknown, TResult>,
) => Promise<void>

/**
 * Engine-internal, non-serializable runtime state for a single task.
 *
 * Held only inside the queue engine and never written to storage. Keeping this
 * separate from the serializable {@link TaskView} means a persisted task never
 * carries live functions or timers.
 */
export interface TaskRuntime {
  processor: TaskProcessor
  originalItems?: unknown[]
  getItemId?: (item: unknown) => string | undefined
  onComplete?: (outcome: TaskOutcome) => void | Promise<void>
  resolve?: (outcome: TaskOutcome) => void
  setCancelled?: (cancelled: boolean) => void
  timeoutId?: ReturnType<typeof setTimeout>
  /** Configured timeout in ms; undefined means "no timeout". */
  timeoutMs?: number
  /** Set once a timeout has fired so the settling processor can't overwrite it. */
  timedOut?: boolean
}

// --- Task Context ---

export interface TaskContext<TItem = unknown, TResult = unknown> {
  readonly items: TItem[]
  readonly cancelled: boolean
  readonly failedItems: readonly FailedItem[]
  /** Mark current item as succeeded. Pass itemId to enable retry of remaining items on cancel. */
  succeed: (itemId?: string) => void
  /** Mark current item as failed. Pass itemId and message for retry support. */
  fail: (itemId?: string, message?: string) => void
  setTitle: (title: string) => void
  setResult: (result: TResult) => void
  /** Register cleanup function to call on cancel/timeout. Used for watch subscription cleanup. */
  onCancel: (cleanup: () => void) => void
}

// --- Item Context (for processItem API) ---

export interface ItemContext {
  /** Check if task was cancelled */
  readonly cancelled: boolean
  /** Override auto-detected item ID for retry tracking */
  succeed: (itemId?: string) => void
  /** Override auto-detected item ID and customize error message */
  fail: (itemId?: string, message?: string) => void
}

// --- Task Outcome ---

export interface TaskOutcome<TResult = unknown> {
  status: TerminalTaskStatus
  completed: number
  failed: number
  failedItems: FailedItem[]
  result?: TResult
}

// --- Enqueue Options ---

interface BaseEnqueueOptions<TItem = unknown, TResult = unknown> {
  title: string
  icon?: ReactNode
  category?: string
  metadata?: TaskMetadata
  errorStrategy?: 'continue' | 'stop'
  cancelable?: boolean
  retryable?: boolean
  /**
   * Show browser confirmation dialog when user tries to close/reload page
   * while this task is pending or running.
   *
   * Set to `false` only for non-critical background tasks that can be safely
   * interrupted (cache updates, analytics, read-only operations).
   *
   * **IMPORTANT: Keep `true` (default) for:**
   * - Mutating operations (creates, updates, deletes)
   * - Long-running operations (> 5 seconds)
   * - Operations with side effects (emails, billing, external APIs)
   *
   * @default true
   *
   * @example
   * ```typescript
   * // Mutation - MUST confirm
   * enqueue({
   *   title: 'Creating 50 DNS records',
   *   confirmBeforeUnload: true, // Keep default
   *   processor: async () => { ... }
   * });
   *
   * // Background task - Safe to skip
   * enqueue({
   *   title: 'Warming cache',
   *   confirmBeforeUnload: false, // OK - non-critical
   *   processor: async () => { ... }
   * });
   * ```
   */
  confirmBeforeUnload?: boolean
  completionActions?:
    | ButtonProps[]
    | ((result: TResult, info: TaskCompletionInfo<TItem>) => ButtonProps[])
  onComplete?: (outcome: TaskOutcome<TResult>) => void | Promise<void>
  /**
   * Timeout in milliseconds, measured from when the task starts running (not
   * from enqueue). Default: 300000 (5 minutes). Pass `0` or a negative value to
   * disable the timeout entirely.
   */
  timeout?: number
}

/** Full control mode - consumer handles iteration */
export interface ProcessorEnqueueOptions<
  TItem = unknown,
  TResult = unknown,
> extends BaseEnqueueOptions<TItem, TResult> {
  processor: (ctx: TaskContext<TItem, TResult>) => Promise<void>
  items?: TItem[]
  processItem?: never
  itemConcurrency?: never
  getItemId?: never
}

/** Simplified mode - queue handles iteration */
export interface ProcessItemEnqueueOptions<
  TItem = unknown,
  TResult = unknown,
> extends BaseEnqueueOptions<TItem, TResult> {
  processItem: (item: TItem, ctx: ItemContext) => Promise<void>
  items: TItem[]
  itemConcurrency?: number
  getItemId?: (item: TItem) => string
  processor?: never
}

export type EnqueueOptions<TItem = unknown, TResult = unknown>
  = | ProcessorEnqueueOptions<TItem, TResult>
    | ProcessItemEnqueueOptions<TItem, TResult>

// --- Task Handle ---

export interface TaskHandle<TResult = unknown> {
  id: string
  cancel: () => void
  promise: Promise<TaskOutcome<TResult>>
}

// --- Redis Client Interface ---

export interface RedisClient {
  get: (key: string) => Promise<string | null>
  set: (key: string, value: string) => Promise<string | null>
  del: (key: string) => Promise<number>
  status?: string
}

// --- Queue Config ---

export interface TaskQueueConfig {
  concurrency?: number
  storage?: TaskStorage
  storageKey?: string
  storageType?: 'memory' | 'local' | 'auto'
  redisClient?: RedisClient | null
  /** Global custom renderer for TaskSummaryDialog content. Can be overridden per showSummary call. */
  summaryRenderContent?: SummaryRenderContent
}

// --- Storage ---

export interface TaskStorage {
  getAll: () => TaskView[]
  get: (id: string) => TaskView | undefined
  set: (id: string, task: TaskView) => void
  remove: (id: string) => void
  clear: () => void
  /**
   * Optional hook invoked once an async backend (e.g. Redis) has loaded its
   * persisted data into the in-memory cache. Lets the engine surface and
   * reconcile pre-existing tasks after initialization resolves.
   */
  onReady?: (callback: () => void) => void
  /**
   * Optional subscription for external mutations to a shared backend (e.g.
   * another browser tab writing to the same localStorage key). Returns an
   * unsubscribe function.
   */
  onExternalChange?: (callback: () => void) => () => void
}

// --- Task Summary ---

export interface TaskSummaryItem {
  id: string
  label: string
  status: 'success' | 'failed'
  message?: string
}

export type SummaryRenderContent = (items: TaskSummaryItem[]) => ReactNode

export interface TaskSummaryData {
  title: string
  items: TaskSummaryItem[]
  renderContent?: SummaryRenderContent
}

// --- Queue API (exposed via hook) ---

export interface TaskQueueAPI {
  enqueue: <TItem = unknown, TResult = unknown>(
    options: EnqueueOptions<TItem, TResult>,
  ) => TaskHandle<TResult>
  cancel: (taskId: string) => void
  retry: (taskId: string) => void
  dismiss: (taskId: string) => void
  dismissAll: () => void
  showSummary: (title: string, items: TaskSummaryItem[], options?: { renderContent?: SummaryRenderContent }) => void
  closeSummary: () => void
  activeSummary: TaskSummaryData | null
  /** Global custom renderer from TaskQueueConfig. Per-call renderContent in showSummary takes precedence. */
  summaryRenderContent?: SummaryRenderContent
  tasks: Task[]
}

export interface UseTaskQueueOptions {
  status?: TaskStatus
}
