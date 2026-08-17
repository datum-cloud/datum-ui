import type {
  EnqueueOptions,
  ItemContext,
  ProcessItemEnqueueOptions,
  SummaryRenderContent,
  Task,
  TaskContext,
  TaskHandle,
  TaskOutcome,
  TaskProcessor,
  TaskQueueConfig,
  TaskRuntime,
  TaskStorage,
  TaskSummaryData,
  TaskSummaryItem,
  TaskView,
} from '../types'
import { TASK_QUEUE_DEFAULTS } from '../constants'
import { extractItemId, generateTaskId } from '../utils'
import { executeTask } from './executor'
import { detectStorage } from './storage'
import { SummaryStore } from './summary-store'

const DEFAULT_TIMEOUT_MS = 300000 // 5 minutes

// Cross-tab liveness: an owning instance re-stamps its own non-terminal tasks
// on this cadence; another tab treats a task as orphaned only once its owner's
// heartbeat is older than the stale threshold. The threshold is several
// intervals wide to tolerate background-tab timer throttling.
const HEARTBEAT_INTERVAL_MS = 5000
const HEARTBEAT_STALE_MS = 20000

/**
 * A persisted task carrying the engine's cross-tab ownership stamp. These
 * fields are written only to shared storage (localStorage) and survive
 * serialization via the storage layer's field spread; they are intentionally
 * kept off the public {@link TaskView} type as engine-internal metadata.
 */
interface OwnedTaskView extends TaskView {
  _ownerId?: string
  _heartbeatAt?: number
}

export class TaskQueue {
  private storage: TaskStorage
  private concurrency: number
  private runningCount = 0
  private listeners: Set<() => void> = new Set()

  private snapshot: Task[] = []
  private notifyScheduled = false

  /**
   * Consolidated, engine-only runtime state (processor, live callbacks, timers)
   * keyed by task id. Never serialized — persisted tasks only carry the
   * serializable {@link TaskView} half.
   */
  private runtimes: Map<string, TaskRuntime> = new Map()

  // Summary dialog state (decoupled from the scheduler)
  private summary: SummaryStore

  private disposed = false
  private unsubscribeExternal?: () => void

  /** Unique id for this queue instance, used to claim ownership of tasks it runs. */
  private readonly instanceId = generateTaskId()
  /** True when the backend broadcasts writes across tabs (localStorage). */
  private sharedStorage = false
  /** Keepalive that re-stamps this instance's live tasks in shared storage. */
  private heartbeatTimer?: ReturnType<typeof setInterval>

  constructor(config: TaskQueueConfig = {}) {
    this.concurrency = config.concurrency ?? TASK_QUEUE_DEFAULTS.concurrency
    this.storage
      = config.storage
        ?? detectStorage({
          redisClient: config.redisClient,
          storageKey: config.storageKey,
          storageType: config.storageType,
        })
    this.summary = new SummaryStore(config.summaryRenderContent)

    // Storages that broadcast cross-tab writes (localStorage) are shared: a
    // persisted non-terminal task with no local runtime may belong to another
    // *live* tab rather than a dead session, so reconciliation must not blindly
    // fail it. Set before any reconcile call below. (CR-010)
    this.sharedStorage = typeof this.storage.onExternalChange === 'function'

    // Async backends (Redis) load persisted data after construction; reconcile
    // and surface it once ready.
    this.storage.onReady?.(() => {
      this.reconcileOrphans()
      this.notify()
    })

    // Cross-tab convergence for shared backends (localStorage).
    this.unsubscribeExternal = this.storage.onExternalChange?.(() => {
      this.notify()
    })

    // Reconcile any tasks a previous session left mid-flight (sync backends).
    this.reconcileOrphans()
    this.updateSnapshot()
  }

  // --- useSyncExternalStore compatibility ---

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  getSnapshot = (): Task[] => {
    return this.snapshot
  }

  private notify(): void {
    // Batch notifications using microtask to avoid flooding React with sync updates
    if (this.notifyScheduled)
      return
    this.notifyScheduled = true

    queueMicrotask(() => {
      this.notifyScheduled = false
      this.updateSnapshot()
      this.listeners.forEach(listener => listener())
    })
  }

  private updateSnapshot(): void {
    this.snapshot = this.storage.getAll()
  }

  /**
   * Mark tasks a previous session left in a non-terminal state (no live
   * processor exists for them) as failed, so they become dismissible and stop
   * triggering the beforeunload guard instead of being stuck forever.
   */
  private reconcileOrphans(): void {
    const tasks = this.storage.getAll()
    const now = Date.now()
    for (const task of tasks) {
      const isNonTerminal = task.status === 'pending' || task.status === 'running'
      if (!isNonTerminal)
        continue
      if (this.runtimes.has(task.id))
        continue // Belongs to this session — has a live processor.

      // On shared storage a task may be owned by another live tab; do not fail
      // its in-flight work just because this instance holds no runtime. (CR-010)
      if (this.sharedStorage && this.isLiveForeignTask(task, now))
        continue

      const reconciled: TaskView = {
        ...task,
        status: 'failed',
        cancelable: false,
        retryable: false,
        completedAt: Date.now(),
        failedItems: [
          ...task.failedItems,
          { message: 'Task interrupted (page was reloaded)' },
        ],
      }
      this.storage.set(task.id, reconciled)
    }
  }

  /**
   * True when a non-terminal task is claimed by a *different* instance whose
   * heartbeat is still fresh — i.e. another live tab is running it. A task
   * without an ownership stamp (legacy, or persisted by a now-dead session) is
   * not "live foreign" and remains eligible for reconciliation.
   */
  private isLiveForeignTask(task: TaskView, now: number): boolean {
    const owned = task as OwnedTaskView
    if (owned._ownerId === undefined || owned._heartbeatAt === undefined)
      return false // Unowned/legacy → treat as a genuine orphan.
    if (owned._ownerId === this.instanceId)
      return false // Ours but runtime is gone → let it reconcile.
    return now - owned._heartbeatAt < HEARTBEAT_STALE_MS
  }

  /** Stamp this instance's ownership on a task before it is written to shared storage. */
  private withOwnership(task: TaskView): TaskView {
    if (!this.sharedStorage)
      return task
    const owned: OwnedTaskView = {
      ...task,
      _ownerId: this.instanceId,
      _heartbeatAt: Date.now(),
    }
    return owned
  }

  /** Start the heartbeat keepalive if shared storage is in use and it is not already running. */
  private ensureHeartbeat(): void {
    if (!this.sharedStorage || this.heartbeatTimer || this.disposed)
      return
    this.heartbeatTimer = setInterval(() => this.beat(), HEARTBEAT_INTERVAL_MS)
  }

  /**
   * Refresh the ownership timestamp on every non-terminal task this instance is
   * actively running, so other tabs keep seeing them as live. Self-stops once
   * this instance has no more active tasks.
   */
  private beat(): void {
    const now = Date.now()
    let active = false
    for (const task of this.storage.getAll()) {
      if (!this.runtimes.has(task.id))
        continue
      if (task.status !== 'running' && task.status !== 'pending')
        continue
      active = true
      const owned: OwnedTaskView = {
        ...task,
        _ownerId: this.instanceId,
        _heartbeatAt: now,
      }
      this.storage.set(task.id, owned)
    }
    if (!active)
      this.stopHeartbeat()
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = undefined
    }
  }

  // --- Public API ---

  enqueue = <TItem = unknown, TResult = unknown>(
    options: EnqueueOptions<TItem, TResult>,
  ): TaskHandle<TResult> => {
    const id = generateTaskId()
    const items = options.items as unknown[] | undefined

    // Determine processor: use provided processor or build from processItem
    let processor: TaskProcessor
    let getItemId: ((item: unknown) => string | undefined) | undefined
    if ('processItem' in options && options.processItem) {
      processor = this.buildProcessor(
        options as ProcessItemEnqueueOptions<TItem, TResult>,
      ) as TaskProcessor
      getItemId = options.getItemId as ((item: unknown) => string | undefined) | undefined
    }
    else if ('processor' in options && options.processor) {
      processor = options.processor as TaskProcessor
    }
    else {
      throw new Error(
        '[TaskQueue] enqueue: must provide either processor or processItem',
      )
    }

    const cancelable = options.cancelable ?? TASK_QUEUE_DEFAULTS.cancelable
    const confirmBeforeUnload = options.confirmBeforeUnload ?? true

    const task: Task<TResult> = {
      id,
      title: options.title,
      status: 'pending',
      icon: options.icon,
      category: options.category,
      metadata: options.metadata,
      items,
      total: items?.length,
      completed: 0,
      failed: 0,
      succeededItems: [],
      failedItems: [],
      errorStrategy: options.errorStrategy ?? TASK_QUEUE_DEFAULTS.errorStrategy,
      cancelable,
      retryable: options.retryable ?? TASK_QUEUE_DEFAULTS.retryable,
      confirmBeforeUnload,
      completionActions:
        options.completionActions as Task<TResult>['completionActions'],
      retryCount: 0,
      createdAt: Date.now(),
      _originalItems: items ? [...items] : undefined,
    }

    // A timeout <= 0 means "no timeout" rather than "poison immediately".
    const requestedTimeout = options.timeout ?? DEFAULT_TIMEOUT_MS
    const timeoutMs = requestedTimeout > 0 ? requestedTimeout : undefined

    // All non-serializable runtime state lives here, never in storage.
    this.runtimes.set(id, {
      processor,
      originalItems: items ? [...items] : undefined,
      getItemId,
      onComplete: options.onComplete as ((outcome: TaskOutcome) => void | Promise<void>) | undefined,
      timeoutMs,
    })

    const promise = new Promise<TaskOutcome<TResult>>((resolve) => {
      const runtime = this.runtimes.get(id)
      if (runtime)
        runtime.resolve = resolve as (outcome: TaskOutcome) => void
    })

    this.storage.set(id, this.withOwnership(task as TaskView))
    this.notify()
    this.ensureHeartbeat()
    this.drain()

    return {
      id,
      cancel: () => this.cancel(id),
      promise,
    }
  }

  cancel = (taskId: string): void => {
    const task = this.storage.get(taskId)
    if (!task)
      return

    if (task.status === 'running') {
      const runtime = this.runtimes.get(taskId)
      runtime?.setCancelled?.(true)
      return
    }

    // Pending: the task has not started, so cancel it directly instead of
    // silently no-oping and letting it run later anyway.
    if (task.status === 'pending') {
      this.clearTaskTimeout(taskId)
      const cancelled: TaskView = {
        ...task,
        status: 'cancelled',
        completedAt: Date.now(),
      }
      this.storage.set(taskId, cancelled)
      this.notify()
      void this.finalize(taskId, {
        status: 'cancelled',
        completed: cancelled.completed,
        failed: cancelled.failed,
        failedItems: [...cancelled.failedItems],
        result: cancelled.result,
      }, true)
    }
  }

  retry = (taskId: string): void => {
    const task = this.storage.get(taskId)
    if (!task)
      return
    if (task.status !== 'failed' && task.status !== 'cancelled')
      return

    // Get processor from runtime (wasn't serialized to storage)
    const runtime = this.runtimes.get(taskId)
    if (!runtime?.processor) {
      console.error('[TaskQueue] retry: no processor found for task', taskId)
      return
    }

    // Check if this is a batch task (has items) or long process (no items)
    const isBatchTask = task.items && task.items.length > 0

    let next: TaskView

    if (isBatchTask) {
      // Batch task: Resume from where it stopped
      const remainingItems = this.getRetryItems(task)

      if (!remainingItems || remainingItems.length === 0) {
        // Edge case: all items already succeeded (cancel came too late).
        // Mark as completed AND resolve the awaited handle / fire onComplete so
        // the consumer isn't left hanging.
        const succeededItems = task.succeededItems ?? []
        const originalItems = runtime.originalItems ?? task._originalItems ?? task.items ?? []

        if (
          succeededItems.length >= originalItems.length
          || task.completed >= (task.total ?? 0)
        ) {
          const completed: TaskView = {
            ...task,
            status: 'completed',
            completedAt: Date.now(),
          }
          this.storage.set(taskId, completed)
          this.notify()
          void this.finalize(taskId, {
            status: 'completed',
            completed: completed.completed,
            failed: completed.failed,
            failedItems: [...completed.failedItems],
            result: completed.result,
          }, false)
          return
        }

        console.warn('[TaskQueue] retry: no remaining items for task', taskId)
        return
      }

      next = {
        ...task,
        status: 'pending',
        items: remainingItems,
        // Keep completed count and total for continuous progress.
        // Reset only failed items for this retry attempt.
        failedItems: [],
        failed: 0,
        retryCount: task.retryCount + 1,
        startedAt: undefined,
        completedAt: undefined,
      }
    }
    else {
      // Long process: Restart from beginning
      next = {
        ...task,
        status: 'pending',
        completed: 0,
        failed: 0,
        succeededItems: [],
        failedItems: [],
        result: undefined,
        retryCount: task.retryCount + 1,
        startedAt: undefined,
        completedAt: undefined,
      }
    }

    // Timeout is (re-)armed at run start in runTask, so retried runs are timed.
    this.storage.set(taskId, this.withOwnership(next))
    this.notify()
    this.ensureHeartbeat()
    this.drain()
  }

  private getRetryItems(task: TaskView): unknown[] | undefined {
    const runtime = this.runtimes.get(task.id)
    // Use originalItems if available, otherwise fall back to items
    const originalItems = runtime?.originalItems ?? task._originalItems ?? task.items
    if (!originalItems || originalItems.length === 0)
      return undefined

    const getItemId = runtime?.getItemId

    // Ensure arrays exist (backwards compatibility)
    const succeededItems = task.succeededItems ?? []
    const failedItems = task.failedItems ?? []

    // For cancelled tasks: retry items NOT in succeededItems
    if (task.status === 'cancelled' && succeededItems.length > 0) {
      const remaining = originalItems.filter((item) => {
        const itemId = this.resolveItemId(item, getItemId)
        if (!itemId)
          return true // Can't track, include it
        return !succeededItems.includes(itemId)
      })
      return remaining.length > 0 ? remaining : undefined
    }

    // For failed tasks: retry only failed items
    if (task.status === 'failed' && failedItems.length > 0) {
      const failed = originalItems.filter((item) => {
        const itemId = this.resolveItemId(item, getItemId)
        if (!itemId)
          return false
        return failedItems.some(fi => fi.id === itemId)
      })
      return failed.length > 0 ? failed : undefined
    }

    // Fallback: retry all original items
    return originalItems
  }

  /** Extract ID from an item using custom extractor or shared utility */
  private resolveItemId<TItem>(
    item: TItem,
    getItemId?: (item: TItem) => string | undefined,
  ): string | undefined {
    if (getItemId) {
      const custom = getItemId(item)
      if (custom !== undefined)
        return custom
    }

    const id = extractItemId(item)
    if (id !== undefined)
      return id

    // Fallback: stringify (only in queue context, not in UI)
    try {
      return JSON.stringify(item)
    }
    catch {
      return undefined
    }
  }

  dismiss = (taskId: string): void => {
    const task = this.storage.get(taskId)
    if (!task)
      return
    if (task.status === 'running' || task.status === 'pending')
      return
    this.storage.remove(taskId)
    this.cleanupRuntime(taskId)
    this.notify()
  }

  dismissAll = (): void => {
    const tasks = this.storage.getAll()
    tasks.forEach((task) => {
      if (task.status !== 'running' && task.status !== 'pending') {
        this.storage.remove(task.id)
        this.cleanupRuntime(task.id)
      }
    })
    this.notify()
  }

  showSummary = (title: string, items: TaskSummaryItem[], options?: { renderContent?: SummaryRenderContent }): void => {
    this.summary.show(title, items, options)
    this.notify()
  }

  closeSummary = (): void => {
    this.summary.close()
    this.notify()
  }

  getActiveSummary = (): TaskSummaryData | null => {
    return this.summary.getActive()
  }

  getSummaryRenderContent = (): SummaryRenderContent | undefined => {
    return this.summary.getGlobalRenderContent()
  }

  /**
   * Fully tear down the queue: cancel in-flight and pending tasks, clear all
   * timers and listeners. Call from the provider on unmount so a re-mounted
   * provider does not leave orphaned timers/listeners behind.
   */
  dispose(): void {
    if (this.disposed)
      return
    this.disposed = true

    this.stopHeartbeat()

    const tasks = this.storage.getAll()
    tasks.forEach((task) => {
      if (task.status === 'running' || task.status === 'pending')
        this.cancel(task.id)
    })

    // Settle every handle still outstanding as cancelled BEFORE discarding the
    // runtimes. Cancelling a running task above only flips its cancel flag; the
    // in-flight processor may settle later, after this map is cleared, and would
    // then find no runtime and never resolve. Resolving here means
    // `await enqueue().promise` for a task running at unmount settles as
    // cancelled instead of hanging forever. (CR-009)
    this.runtimes.forEach((runtime, taskId) => {
      if (runtime.timeoutId)
        clearTimeout(runtime.timeoutId)
      const resolve = runtime.resolve
      if (resolve) {
        const task = this.storage.get(taskId)
        resolve({
          status: 'cancelled',
          completed: task?.completed ?? 0,
          failed: task?.failed ?? 0,
          failedItems: task ? [...task.failedItems] : [],
          result: task?.result,
        })
        runtime.resolve = undefined
      }
    })
    this.runtimes.clear()
    this.listeners.clear()
    this.unsubscribeExternal?.()
  }

  // --- processItem API ---

  private buildProcessor<TItem, TResult>(
    options: ProcessItemEnqueueOptions<TItem, TResult>,
  ): (ctx: TaskContext<TItem, TResult>) => Promise<void> {
    const {
      processItem,
      itemConcurrency = 1,
      getItemId,
      errorStrategy = 'continue',
    } = options

    return async (ctx) => {
      const pending = [...ctx.items]
      const inFlight: Promise<void>[] = []

      while (pending.length > 0 || inFlight.length > 0) {
        // Check cancellation
        if (ctx.cancelled)
          break

        // Check stop-on-error
        if (errorStrategy === 'stop' && ctx.failedItems.length > 0)
          break

        // Fill slots up to concurrency limit
        while (inFlight.length < itemConcurrency && pending.length > 0) {
          const item = pending.shift()!
          const itemId = this.resolveItemId(item, getItemId) ?? String(item)

          const promise = this.processOneItem(
            item,
            itemId,
            processItem,
            ctx,
          ).finally(() => {
            // Remove from inFlight when done
            const idx = inFlight.indexOf(promise)
            if (idx !== -1)
              inFlight.splice(idx, 1)
          })

          inFlight.push(promise)
        }

        // Wait for at least one to complete before continuing
        if (inFlight.length > 0) {
          await Promise.race(inFlight)
        }
      }
    }
  }

  private async processOneItem<TItem, TResult>(
    item: TItem,
    itemId: string,
    processItem: (item: TItem, ctx: ItemContext) => Promise<void>,
    ctx: TaskContext<TItem, TResult>,
  ): Promise<void> {
    let manuallyHandled = false

    const itemCtx: ItemContext = {
      get cancelled() {
        return ctx.cancelled
      },
      succeed: (id?: string) => {
        manuallyHandled = true
        ctx.succeed(id ?? itemId)
      },
      fail: (id?: string, message?: string) => {
        manuallyHandled = true
        ctx.fail(id ?? itemId, message)
      },
    }

    try {
      await processItem(item, itemCtx)
      // Auto-succeed if not manually handled
      if (!manuallyHandled) {
        ctx.succeed(itemId)
      }
    }
    catch (error) {
      // Auto-fail if not manually handled
      if (!manuallyHandled) {
        const message
          = error instanceof Error ? error.message : 'Unknown error'
        ctx.fail(itemId, message)
      }
    }
  }

  // --- Internal scheduling ---

  private drain(): void {
    const tasks = this.storage.getAll()
    const pending = tasks.filter(t => t.status === 'pending')

    while (this.runningCount < this.concurrency && pending.length > 0) {
      const next = pending.shift()
      if (!next)
        break
      this.runTask(next)
    }
  }

  private async runTask(task: TaskView): Promise<void> {
    this.runningCount += 1

    const runtime = this.runtimes.get(task.id)
    if (!runtime?.processor) {
      // No live processor (e.g. a persisted task with no session runtime).
      // Mark it failed so it does not loop through drain forever.
      this.failOrphan(task.id)
      this.runningCount -= 1
      this.drain()
      return
    }

    // Arm the timeout at RUN start (not enqueue), so time queued behind other
    // tasks does not burn the budget, and retried runs are timed too.
    runtime.timedOut = false
    if (runtime.timeoutMs != null) {
      runtime.timeoutId = setTimeout(() => this.handleTaskTimeout(task.id), runtime.timeoutMs)
    }

    try {
      const outcome = await executeTask(task, runtime.processor, {
        onUpdate: (updated) => {
          // Drop updates once a timeout has already finalized this task, so the
          // settling processor cannot overwrite the timeout status.
          if (this.runtimes.get(task.id)?.timedOut)
            return
          this.storage.set(updated.id, updated as TaskView)
          this.notify()
        },
        onCancelReady: (setCancelled) => {
          const rt = this.runtimes.get(task.id)
          if (rt)
            rt.setCancelled = setCancelled
        },
        onTaskComplete: () => {
          this.clearTaskTimeout(task.id)
        },
      })

      // If a timeout fired mid-flight, it already finalized the task.
      if (this.runtimes.get(task.id)?.timedOut)
        return

      // Keep processor around for retry on non-successful outcomes.
      await this.finalize(task.id, outcome, outcome.status !== 'completed')
    }
    finally {
      this.runningCount -= 1
      const rt = this.runtimes.get(task.id)
      if (rt)
        rt.setCancelled = undefined
      this.drain()
    }
  }

  /**
   * Resolve a task's awaited handle and fire its onComplete callback exactly
   * once. When {@link keepForRetry} is false the runtime is discarded.
   */
  private async finalize(
    taskId: string,
    outcome: TaskOutcome,
    keepForRetry: boolean,
  ): Promise<void> {
    this.clearTaskTimeout(taskId)
    const runtime = this.runtimes.get(taskId)

    if (runtime?.onComplete) {
      try {
        await runtime.onComplete(outcome)
      }
      catch (error) {
        console.error('[TaskQueue] onComplete callback error:', error)
      }
    }

    const resolve = runtime?.resolve
    if (resolve) {
      resolve(outcome)
      if (runtime)
        runtime.resolve = undefined
    }

    if (!keepForRetry)
      this.cleanupRuntime(taskId)
  }

  private failOrphan(taskId: string): void {
    const task = this.storage.get(taskId)
    if (!task)
      return
    const failed: TaskView = {
      ...task,
      status: 'failed',
      cancelable: false,
      retryable: false,
      completedAt: Date.now(),
      failedItems: [
        ...task.failedItems,
        { message: 'Task interrupted (no active processor)' },
      ],
    }
    this.storage.set(taskId, failed)
    this.cleanupRuntime(taskId)
    this.notify()
  }

  private handleTaskTimeout(taskId: string): void {
    const runtime = this.runtimes.get(taskId)
    if (runtime)
      runtime.timeoutId = undefined

    const task = this.storage.get(taskId)
    if (!task) {
      this.cleanupRuntime(taskId)
      return
    }

    // Timer only exists while running; if the task is no longer running just
    // drop the (already cleared) entry. A pending task carries no timer, so it
    // can never be permanently disarmed.
    if (task.status !== 'running')
      return

    // Mark timed out so executeTask's settling update is ignored.
    if (runtime)
      runtime.timedOut = true

    // Trigger cleanup callbacks (watch unsubscribe, etc.)
    runtime?.setCancelled?.(true)

    const failed: TaskView = {
      ...task,
      status: 'failed',
      completedAt: Date.now(),
      failedItems: [
        ...task.failedItems,
        { message: 'Task timeout: exceeded maximum execution time' },
      ],
      failed: task.failed + 1,
    }
    this.storage.set(taskId, failed)
    this.notify()

    // Resolve the handle / fire onComplete, keeping the processor for retry.
    void this.finalize(taskId, {
      status: 'failed',
      completed: failed.completed,
      failed: failed.failed,
      failedItems: [...failed.failedItems],
      result: failed.result,
    }, true)
  }

  private clearTaskTimeout(taskId: string): void {
    const runtime = this.runtimes.get(taskId)
    if (runtime?.timeoutId) {
      clearTimeout(runtime.timeoutId)
      runtime.timeoutId = undefined
    }
  }

  private cleanupRuntime(taskId: string): void {
    this.clearTaskTimeout(taskId)
    this.runtimes.delete(taskId)
  }
}
