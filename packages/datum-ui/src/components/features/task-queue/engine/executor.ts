import type { Task, TaskContext, TaskOutcome, TaskProcessor } from '../types'

export interface ExecutorCallbacks {
  onUpdate: (task: Task) => void
  onCancelReady?: (setCancelled: (v: boolean) => void) => void
  onTaskComplete?: () => void
}

/**
 * Shallow-clone a task into an engine-local working copy.
 *
 * The executor mutates its working copy freely and emits fresh copies on every
 * update, so the object handed in (which may be the exact reference held in a
 * live React snapshot) is never mutated in place.
 */
function cloneTask<TResult>(task: Task<TResult>): Task<TResult> {
  return {
    ...task,
    succeededItems: [...(task.succeededItems ?? [])],
    failedItems: [...(task.failedItems ?? [])],
  }
}

export function createTaskContext<TItem = unknown, TResult = unknown>(
  task: Task<TResult>,
  callbacks: ExecutorCallbacks,
): {
  ctx: TaskContext<TItem, TResult>
  getCancelled: () => boolean
  setCancelled: (v: boolean) => void
  getShouldStop: () => boolean
} {
  let cancelled = false
  let shouldStop = false
  const cleanupCallbacks: Array<() => void> = []

  const updateTask = () => {
    callbacks.onUpdate({
      ...task,
      succeededItems: [...task.succeededItems],
      failedItems: [...task.failedItems],
    } as Task)
  }

  const ctx: TaskContext<TItem, TResult> = {
    get items() {
      return (task.items ?? []) as TItem[]
    },
    get cancelled() {
      return cancelled || shouldStop
    },
    get failedItems() {
      return [...task.failedItems]
    },
    succeed(itemId?: string) {
      task.completed += 1
      if (itemId) {
        task.succeededItems = [...task.succeededItems, itemId]
      }
      updateTask()
    },
    fail(itemId?: string, message?: string) {
      task.failed += 1
      if (itemId || message) {
        task.failedItems = [
          ...task.failedItems,
          { id: itemId, message: message ?? 'Unknown error' },
        ]
      }
      // Check errorStrategy: 'stop' - set flag to stop processing
      if (task.errorStrategy === 'stop') {
        shouldStop = true
      }
      updateTask()
    },
    setTitle(title: string) {
      task.title = title
      updateTask()
    },
    setResult(result: TResult) {
      task.result = result
    },
    onCancel(cleanup: () => void) {
      cleanupCallbacks.push(cleanup)
    },
  }

  return {
    ctx,
    getCancelled: () => cancelled,
    setCancelled: (v: boolean) => {
      cancelled = v
      // Call all cleanup callbacks when cancelled
      if (v) {
        cleanupCallbacks.forEach((cleanup) => {
          try {
            cleanup()
          }
          catch (error) {
            console.error('[TaskQueue] Cleanup callback error:', error)
          }
        })
      }
    },
    getShouldStop: () => shouldStop,
  }
}

export async function executeTask<TResult = unknown>(
  inputTask: Task<TResult>,
  processor: TaskProcessor<TResult> | undefined,
  callbacks: ExecutorCallbacks,
): Promise<TaskOutcome<TResult>> {
  if (!processor) {
    return {
      status: 'failed',
      completed: 0,
      failed: 0,
      failedItems: [{ message: 'No processor attached' }],
    }
  }

  // Work on a private copy so the stored object (possibly aliased by a live
  // React snapshot) is never mutated in place.
  const task = cloneTask(inputTask)

  task.status = 'running'
  task.startedAt = Date.now()
  // Ensure succeededItems exists (backwards compatibility)
  if (!task.succeededItems) {
    task.succeededItems = []
  }
  callbacks.onUpdate({ ...task } as Task)

  const { ctx, getCancelled, setCancelled, getShouldStop } = createTaskContext(task, callbacks)

  // Expose setCancelled so the queue can trigger cancellation
  callbacks.onCancelReady?.(setCancelled)

  try {
    await processor(ctx)

    if (getCancelled()) {
      task.status = 'cancelled'
    }
    else if (getShouldStop() || task.failed > 0) {
      // errorStrategy: 'stop' triggered or has failures
      task.status = 'failed'
    }
    else {
      task.status = 'completed'
    }
  }
  catch (error) {
    task.status = 'failed'
    const message = error instanceof Error ? error.message : 'Unknown error'
    task.failedItems = [...task.failedItems, { message }]
    task.failed += 1
  }

  task.completedAt = Date.now()
  callbacks.onUpdate({ ...task } as Task)

  // Notify that task has completed (for timeout cleanup)
  callbacks.onTaskComplete?.()

  return {
    status: task.status as 'completed' | 'failed' | 'cancelled',
    completed: task.completed,
    failed: task.failed,
    failedItems: [...task.failedItems],
    result: task.result,
  }
}
