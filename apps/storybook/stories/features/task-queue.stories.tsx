import type { Task } from '@datum-cloud/datum-ui/task-queue'
import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import {
  TaskPanelHeader,
  TaskPanelItem,
  TaskQueueProvider,
} from '@datum-cloud/datum-ui/task-queue'
import { FileText, Upload } from 'lucide-react'

const sampleTasks: Array<{ task: Task, contextLabel?: string }> = [
  {
    task: {
      id: '1',
      title: 'Uploading zone-file.txt',
      status: 'running',
      icon: <Upload className="size-4" />,
      total: 10,
      completed: 6,
      failed: 0,
      succeededItems: [],
      failedItems: [],
      errorStrategy: 'continue',
      cancelable: true,
      retryable: false,
      retryCount: 0,
      createdAt: Date.now() - 10_000,
      confirmBeforeUnload: true,
    },
    contextLabel: 'Project Alpha',
  },
  {
    task: {
      id: '2',
      title: 'Processing records',
      status: 'pending',
      icon: <FileText className="size-4" />,
      completed: 0,
      failed: 0,
      succeededItems: [],
      failedItems: [],
      errorStrategy: 'continue',
      cancelable: true,
      retryable: false,
      retryCount: 0,
      createdAt: Date.now() - 5_000,
      confirmBeforeUnload: true,
    },
    contextLabel: 'Project Beta',
  },
  {
    task: {
      id: '3',
      title: 'Export completed',
      status: 'completed',
      total: 50,
      completed: 50,
      failed: 0,
      succeededItems: [],
      failedItems: [],
      errorStrategy: 'continue',
      cancelable: false,
      retryable: false,
      retryCount: 0,
      createdAt: Date.now() - 300_000,
      confirmBeforeUnload: false,
      completedAt: Date.now() - 120_000,
    },
  },
  {
    task: {
      id: '4',
      title: 'Import with errors',
      status: 'completed',
      total: 20,
      completed: 17,
      failed: 3,
      succeededItems: [],
      failedItems: [
        { id: 'r1', message: 'Invalid format' },
        { id: 'r2', message: 'Duplicate entry' },
        { id: 'r3', message: 'Missing field' },
      ],
      errorStrategy: 'continue',
      cancelable: false,
      retryable: true,
      retryCount: 0,
      createdAt: Date.now() - 180_000,
      confirmBeforeUnload: false,
      completedAt: Date.now() - 60_000,
    },
  },
  {
    task: {
      id: '5',
      title: 'Sync failed',
      status: 'failed',
      total: 5,
      completed: 2,
      failed: 3,
      succeededItems: [],
      failedItems: [
        { id: 'f1', message: 'Network error' },
        { id: 'f2', message: 'Timeout' },
        { id: 'f3', message: 'Server error' },
      ],
      errorStrategy: 'stop',
      cancelable: false,
      retryable: true,
      retryCount: 1,
      createdAt: Date.now() - 120_000,
      confirmBeforeUnload: false,
      completedAt: Date.now() - 30_000,
    },
  },
]

const meta: Meta = {
  title: 'Features/TaskQueue',
  parameters: {
    docs: {
      description: {
        component:
          'Async task queue with progress tracking, retry logic, and persistent storage.\n\n'
          + 'Wrap your app with `TaskQueueProvider`, then call `useTaskQueue()` to `enqueue` batch operations. '
          + 'Each task tracks per-item progress, supports cancel and retry, and can optionally persist to '
          + '`localStorage`. After completion, call `showSummary()` to display a results dialog. '
          + 'Requires `date-fns`.',
      },
    },
  },
}

export default meta

type Story = StoryObj

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The task panel showing all task states: running (with progress), pending, completed successfully, '
          + 'completed with partial failures (retryable), and fully failed. '
          + 'In a real app, the panel is driven by `useTaskQueue()` — this story uses static `Task` objects '
          + 'to render the panel UI without needing a live queue.',
      },
    },
  },
  render: () => (
    <TaskQueueProvider>
      <div className="border-border/50 w-96 overflow-hidden rounded-xl border shadow-xl shadow-black/10">
        <TaskPanelHeader />
        <div className="max-h-96 overflow-y-auto">
          {sampleTasks.map(({ task, contextLabel }) => (
            <TaskPanelItem
              key={task.id}
              task={task}
              contextLabel={contextLabel}
              onCancel={() => alert(`Cancel task: ${task.title}`)}
            />
          ))}
        </div>
      </div>
    </TaskQueueProvider>
  ),
}
