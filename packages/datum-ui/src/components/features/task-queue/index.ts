// UI
export {
  TaskPanel,
  TaskPanelActions,
  TaskPanelCounter,
  TaskPanelHeader,
  TaskPanelItem,
  TaskQueueDropdown,
  TaskQueueTrigger,
  TaskSummaryDialog,
} from './core'

export type { TaskSummaryDialogProps } from './core'
// Engine (for advanced usage / custom storage)
export { detectStorage, LocalTaskStorage, RedisTaskStorage, TaskQueue } from './engine'

// Hooks
export {
  getContextLabel,
  matchesCurrentScope,
  useCurrentScope,
  useTaskQueue,
  useTasksWithLabels,
} from './hooks'
export type { CurrentScope, TasksWithLabels } from './hooks'

// Provider
export { TaskQueueProvider } from './provider'

// Types
export type {
  EnqueueOptions,
  ItemContext,
  ProcessItemEnqueueOptions,
  ProcessorEnqueueOptions,
  RedisClient,
  Task,
  TaskCompletionInfo,
  TaskContext,
  TaskHandle,
  TaskMetadata,
  TaskOutcome,
  TaskQueueAPI,
  TaskQueueConfig,
  TaskStatus,
  TaskStorage,
  TaskSummaryData,
  TaskSummaryItem,
  UseTaskQueueOptions,
} from './types'

// Utils
export { createOrgMetadata, createProjectMetadata, createUserMetadata } from './utils'
