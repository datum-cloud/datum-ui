import type { TaskStorage, TaskView } from '../../types'
import { TASK_STORAGE_KEY } from '../../constants'
import { isBrowser } from '../../utils'
import { toSerializableTask } from './serialize'

export class LocalTaskStorage implements TaskStorage {
  private key: string

  constructor(key: string = TASK_STORAGE_KEY) {
    this.key = key
  }

  getAll(): TaskView[] {
    if (!isBrowser())
      return []
    try {
      const raw = localStorage.getItem(this.key)
      return raw ? (JSON.parse(raw) as TaskView[]) : []
    }
    catch {
      return []
    }
  }

  get(id: string): TaskView | undefined {
    if (!isBrowser())
      return undefined
    return this.getAll().find(t => t.id === id)
  }

  set(id: string, task: TaskView): void {
    if (!isBrowser())
      return
    // Re-read fresh immediately before writing so a concurrent tab's unrelated
    // task updates are not clobbered by a stale in-memory copy.
    const tasks = this.getAll()
    const index = tasks.findIndex(t => t.id === id)
    if (index >= 0) {
      tasks[index] = task
    }
    else {
      tasks.push(task)
    }
    this.persist(tasks)
  }

  remove(id: string): void {
    if (!isBrowser())
      return
    const tasks = this.getAll().filter(t => t.id !== id)
    this.persist(tasks)
  }

  clear(): void {
    if (!isBrowser())
      return
    try {
      localStorage.removeItem(this.key)
    }
    catch {
      // Ignore storage errors
    }
  }

  /**
   * Notify when another tab writes to the same storage key, so this instance's
   * consumers can re-read and converge instead of showing stale state.
   */
  onExternalChange(callback: () => void): () => void {
    if (!isBrowser())
      return () => {}
    const handler = (event: StorageEvent) => {
      if (event.key === this.key)
        callback()
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }

  private persist(tasks: TaskView[]): void {
    try {
      const serializable = tasks.map(toSerializableTask)
      localStorage.setItem(this.key, JSON.stringify(serializable))
    }
    catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.warn('[TaskQueue] Storage quota exceeded. Consider dismissing old tasks.')
      }
    }
  }
}
