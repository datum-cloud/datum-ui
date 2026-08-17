import type { TaskView } from '../../types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TaskQueue } from '../queue'
import { LocalTaskStorage } from '../storage/local-storage'
import { MemoryTaskStorage } from '../storage/memory-storage'

function makeStoredTask(overrides: Partial<TaskView>): TaskView {
  return {
    id: 'x',
    title: 't',
    status: 'pending',
    completed: 0,
    failed: 0,
    succeededItems: [],
    failedItems: [],
    errorStrategy: 'continue',
    cancelable: true,
    retryable: true,
    confirmBeforeUnload: true,
    retryCount: 0,
    createdAt: Date.now(),
    ...overrides,
  }
}

afterEach(() => {
  vi.useRealTimers()
  localStorage.clear()
})

describe('taskQueue immutability (BUG-026/027)', () => {
  it('never mutates a task object handed out in an earlier snapshot', async () => {
    const storage = new MemoryTaskStorage()
    const queue = new TaskQueue({ storage })

    let release: (() => void) | undefined
    const gate = new Promise<void>((resolve) => {
      release = resolve
    })

    const handle = queue.enqueue({
      title: 'immutability',
      processor: async (ctx) => {
        ctx.succeed('a')
        await gate
      },
    })

    // The synchronous drain runs the processor up to its first await, so the
    // task is already running with completed === 1.
    const runningRef = storage.get(handle.id)!
    expect(runningRef.status).toBe('running')
    expect(runningRef.completed).toBe(1)

    release!()
    await handle.promise

    // The previously captured object must not have been mutated in place.
    expect(runningRef.status).toBe('running')
    expect(runningRef.completed).toBe(1)
    expect(storage.get(handle.id)!.status).toBe('completed')
  })
})

describe('taskQueue cancel of pending tasks (BUG-065/130)', () => {
  it('cancels a queued task instead of letting it run later', async () => {
    const queue = new TaskQueue({ storage: new MemoryTaskStorage(), concurrency: 1 })

    let releaseA: (() => void) | undefined
    const gateA = new Promise<void>((resolve) => {
      releaseA = resolve
    })
    let bRan = false

    const handleA = queue.enqueue({
      title: 'A',
      processor: async () => {
        await gateA
      },
    })
    const handleB = queue.enqueue({
      title: 'B',
      processor: async () => {
        bRan = true
      },
    })

    queue.cancel(handleB.id)
    const outcomeB = await handleB.promise
    expect(outcomeB.status).toBe('cancelled')
    expect(bRan).toBe(false)

    releaseA!()
    await handleA.promise
    // B was cancelled while pending — it must never run.
    expect(bRan).toBe(false)
  })
})

describe('taskQueue retry item ids (BUG-023)', () => {
  it('uses the custom getItemId when computing retry items', async () => {
    const queue = new TaskQueue({ storage: new MemoryTaskStorage() })
    const items = [{ ref: 'x1' }, { ref: 'x2' }] // no id/name/key/uuid -> needs getItemId
    const attempts: string[] = []
    let shouldFailX2 = true
    let onRetryComplete: ((status: string) => void) | null = null

    const handle = queue.enqueue({
      title: 'batch',
      items,
      getItemId: item => item.ref,
      onComplete: (outcome) => {
        onRetryComplete?.(outcome.status)
        onRetryComplete = null
      },
      processItem: async (item, ctx) => {
        attempts.push(item.ref)
        if (item.ref === 'x2' && shouldFailX2)
          ctx.fail(undefined, 'boom')
      },
    })

    const first = await handle.promise
    expect(first.status).toBe('failed')

    attempts.length = 0
    shouldFailX2 = false
    const retried = new Promise<string>((resolve) => {
      onRetryComplete = resolve
    })
    queue.retry(handle.id)

    expect(await retried).toBe('completed')
    // Only the failed item (matched by custom id) should be retried.
    expect(attempts).toEqual(['x2'])
  })
})

describe('taskQueue retry of all-succeeded cancelled task (BUG-127)', () => {
  it('completes and fires onComplete instead of hanging', async () => {
    const queue = new TaskQueue({ storage: new MemoryTaskStorage(), concurrency: 1 })
    const outcomes: string[] = []

    let releaseHang: (() => void) | undefined
    const hang = new Promise<void>((resolve) => {
      releaseHang = resolve
    })

    let onRetryComplete: (() => void) | null = null
    const handle = queue.enqueue({
      title: 'all-succeeded',
      items: [{ id: 'a' }],
      onComplete: (outcome) => {
        outcomes.push(outcome.status)
        onRetryComplete?.()
        onRetryComplete = null
      },
      processItem: async (_item, ctx) => {
        ctx.succeed('a')
        await hang
      },
    })

    // Item already succeeded synchronously; cancel while it is still running.
    queue.cancel(handle.id)
    releaseHang!()
    const cancelled = await handle.promise
    expect(cancelled.status).toBe('cancelled')

    const retried = new Promise<void>((resolve) => {
      onRetryComplete = resolve
    })
    queue.retry(handle.id)
    await retried
    expect(outcomes).toEqual(['cancelled', 'completed'])
  })
})

describe('taskQueue timeouts (BUG-024/067/128)', () => {
  it('fails a running task whose run exceeds its timeout', async () => {
    vi.useFakeTimers()
    const queue = new TaskQueue({ storage: new MemoryTaskStorage() })

    const handle = queue.enqueue({
      title: 'hangs',
      timeout: 1000,
      processor: () => new Promise<void>(() => {}), // never resolves
    })

    await vi.advanceTimersByTimeAsync(1001)
    const outcome = await handle.promise
    expect(outcome.status).toBe('failed')
    expect(outcome.failedItems.some(f => f.message.includes('timeout'))).toBe(true)
  })

  it('treats timeout: 0 as "no timeout" instead of poisoning the task', async () => {
    vi.useFakeTimers()
    const queue = new TaskQueue({ storage: new MemoryTaskStorage() })

    const handle = queue.enqueue({
      title: 'no-timeout',
      timeout: 0,
      processor: () => new Promise<void>((resolve) => {
        setTimeout(resolve, 5000)
      }),
    })

    await vi.advanceTimersByTimeAsync(10000)
    const outcome = await handle.promise
    expect(outcome.status).toBe('completed')
    expect(outcome.failedItems).toHaveLength(0)
  })
})

describe('localTaskStorage serialization (BUG-028)', () => {
  it('strips non-serializable icon/completionActions and does not throw on circular refs', () => {
    const storage = new LocalTaskStorage('test-serialize')
    const circular: Record<string, unknown> = {}
    circular.self = circular // stand-in for a non-serializable ReactNode element

    expect(() =>
      storage.set(
        '1',
        makeStoredTask({
          id: '1',
          icon: circular as never,
          completionActions: (() => []) as never,
        }),
      ),
    ).not.toThrow()

    const all = storage.getAll()
    expect(all).toHaveLength(1)
    const got = storage.get('1')!
    expect(got.icon).toBeUndefined()
    expect(got.completionActions).toBeUndefined()
  })
})

describe('taskQueue reconciliation on load (BUG-022/126/129)', () => {
  it('marks persisted non-terminal tasks as failed so they are dismissible', () => {
    const storage = new MemoryTaskStorage()
    storage.set('old-running', makeStoredTask({ id: 'old-running', status: 'running' }))
    storage.set('old-pending', makeStoredTask({ id: 'old-pending', status: 'pending' }))

    const queue = new TaskQueue({ storage })
    const running = queue.getSnapshot().find(t => t.id === 'old-running')!
    const pending = queue.getSnapshot().find(t => t.id === 'old-pending')!

    expect(running.status).toBe('failed')
    expect(running.retryable).toBe(false)
    expect(pending.status).toBe('failed')
    expect(pending.retryable).toBe(false)
  })
})

describe('taskQueue dispose settles in-flight handles (CR-009)', () => {
  it('resolves a task running at dispose as cancelled instead of leaking', async () => {
    const storage = new MemoryTaskStorage()
    const queue = new TaskQueue({ storage })

    const handle = queue.enqueue({
      title: 'running-at-dispose',
      // Never settles on its own — only dispose can end the awaited handle.
      processor: () => new Promise<void>(() => {}),
    })

    // The synchronous drain has the processor running by now.
    expect(storage.get(handle.id)!.status).toBe('running')

    queue.dispose()

    // Before the fix this promise never resolved (runtime + resolve discarded),
    // so the await would hang and time the test out.
    const outcome = await handle.promise
    expect(outcome.status).toBe('cancelled')
  })

  it('resolves a pending task queued at dispose as cancelled', async () => {
    const storage = new MemoryTaskStorage()
    const queue = new TaskQueue({ storage, concurrency: 1 })

    const blocking = queue.enqueue({
      title: 'blocker',
      processor: () => new Promise<void>(() => {}),
    })
    const queued = queue.enqueue({
      title: 'still-pending',
      processor: async () => {},
    })

    expect(storage.get(queued.id)!.status).toBe('pending')

    queue.dispose()

    const outcome = await queued.promise
    expect(outcome.status).toBe('cancelled')
    void blocking
  })
})

describe('taskQueue multi-tab reconcile (CR-010)', () => {
  it('does not fail a live foreign tab\'s running task in shared storage', () => {
    const key = 'ct-shared'
    const storageA = new LocalTaskStorage(key)
    const queueA = new TaskQueue({ storage: storageA })

    const handle = queueA.enqueue({
      title: 'A-running',
      processor: () => new Promise<void>(() => {}), // stays running in tab A
    })
    expect(storageA.get(handle.id)!.status).toBe('running')

    // A second tab opens against the same localStorage key and reconciles.
    const storageB = new LocalTaskStorage(key)
    const queueB = new TaskQueue({ storage: storageB })

    const seen = queueB.getSnapshot().find(t => t.id === handle.id)!
    // The first tab is alive (fresh heartbeat) — its task must not be clobbered.
    expect(seen.status).toBe('running')

    queueA.dispose()
    queueB.dispose()
  })

  it('still fails a genuinely orphaned task with no live owner (reload recovery)', () => {
    const key = 'ct-orphan'
    const storage = new LocalTaskStorage(key)
    // Persisted by a now-dead session: no ownership stamp.
    storage.set('old-running', makeStoredTask({ id: 'old-running', status: 'running' }))

    const queue = new TaskQueue({ storage })
    const reconciled = queue.getSnapshot().find(t => t.id === 'old-running')!
    expect(reconciled.status).toBe('failed')
    expect(reconciled.retryable).toBe(false)

    queue.dispose()
  })

  it('keeps a long-running foreign task alive past the stale window via heartbeat', () => {
    vi.useFakeTimers()
    const key = 'ct-long'
    const storageA = new LocalTaskStorage(key)
    const queueA = new TaskQueue({ storage: storageA })

    const handle = queueA.enqueue({
      title: 'long',
      processor: () => new Promise<void>(() => {}),
    })

    // Advance well past the 20s stale window. Without the heartbeat keepalive
    // the enqueue-time stamp would be stale and a new tab would fail the task.
    vi.advanceTimersByTime(60000)

    const storageB = new LocalTaskStorage(key)
    const queueB = new TaskQueue({ storage: storageB })

    const seen = queueB.getSnapshot().find(t => t.id === handle.id)!
    expect(seen.status).toBe('running')

    queueA.dispose()
    queueB.dispose()
    void handle
  })
})
