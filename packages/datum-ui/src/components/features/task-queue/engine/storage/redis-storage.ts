import type { RedisClient, TaskStorage, TaskView } from '../../types'
import { TASK_STORAGE_KEY } from '../../constants'
import { isBrowser } from '../../utils'
import { toSerializableTask } from './serialize'

// Default TTL: 7 days in seconds
const DEFAULT_TTL = 60 * 60 * 24 * 7

interface SetexCapableClient extends RedisClient {
  setex: (key: string, ttl: number, value: string) => Promise<unknown>
}

function hasSetex(client: RedisClient): client is SetexCapableClient {
  return 'setex' in client && typeof (client as SetexCapableClient).setex === 'function'
}

export class RedisTaskStorage implements TaskStorage {
  private client: RedisClient
  private key: string
  private cache: Map<string, TaskView> = new Map()
  private initialized = false
  private initPromise: Promise<void> | null = null
  private ttl: number

  private readyCallbacks: Set<() => void> = new Set()
  private pendingSync = false
  // Serializes writes so an older snapshot can never overwrite a newer one.
  private writeChain: Promise<void> = Promise.resolve()

  constructor(client: RedisClient, key: string = TASK_STORAGE_KEY, ttl: number = DEFAULT_TTL) {
    this.client = client
    this.key = key
    this.ttl = ttl

    // Auto-initialize on client side, store promise to await later
    if (isBrowser()) {
      this.initPromise = this.initialize()
    }
    else {
      this.initialized = true
    }
  }

  /**
   * Wait for initialization to complete.
   * Call this before accessing data if you need guaranteed consistency.
   */
  async waitForInit(): Promise<void> {
    if (this.initPromise) {
      await this.initPromise
    }
  }

  /** Invoke `callback` once persisted data has been loaded into the cache. */
  onReady(callback: () => void): void {
    if (this.initialized) {
      callback()
      return
    }
    this.readyCallbacks.add(callback)
  }

  private async initialize(): Promise<void> {
    if (this.initialized)
      return
    if (!isBrowser()) {
      this.initialized = true
      return
    }
    try {
      const raw = await this.client.get(this.key)
      if (raw) {
        const tasks = JSON.parse(raw) as TaskView[]
        // Merge: keep any task written locally before init resolved (local wins)
        // so a pre-init enqueue does not clobber previously persisted tasks.
        tasks.forEach((t) => {
          if (!this.cache.has(t.id))
            this.cache.set(t.id, t)
        })
      }
    }
    catch (error) {
      console.error('[TaskQueue] Redis initialize failed:', error)
    }
    finally {
      this.initialized = true
      this.readyCallbacks.forEach(cb => cb())
      this.readyCallbacks.clear()
      // Flush any mutations that were deferred until init completed.
      if (this.pendingSync) {
        this.pendingSync = false
        this.flush()
      }
    }
  }

  getAll(): TaskView[] {
    return Array.from(this.cache.values())
  }

  get(id: string): TaskView | undefined {
    return this.cache.get(id)
  }

  set(id: string, task: TaskView): void {
    if (!isBrowser())
      return
    this.cache.set(id, task)
    this.scheduleSync()
  }

  remove(id: string): void {
    if (!isBrowser())
      return
    this.cache.delete(id)
    this.scheduleSync()
  }

  clear(): void {
    if (!isBrowser())
      return
    this.cache.clear()
    this.client.del(this.key).catch((error) => {
      console.error('[TaskQueue] Redis clear failed:', error)
    })
  }

  private scheduleSync(): void {
    // Defer writes until init has loaded persisted data, otherwise a write that
    // races ahead of the initial GET would clobber everything already stored.
    if (!this.initialized) {
      this.pendingSync = true
      return
    }
    this.flush()
  }

  private flush(): void {
    // Chain writes so they apply in order. Each write serializes the *latest*
    // cache at the moment it runs, so the final write always reflects final
    // state — an earlier, slower write can never win.
    this.writeChain = this.writeChain
      .then(async () => {
        const value = JSON.stringify(this.getAll().map(toSerializableTask))
        if (hasSetex(this.client)) {
          await this.client.setex(this.key, this.ttl, value)
        }
        else {
          await this.client.set(this.key, value)
        }
      })
      .catch((error) => {
        console.error('[TaskQueue] Redis write failed:', error)
      })
  }
}
