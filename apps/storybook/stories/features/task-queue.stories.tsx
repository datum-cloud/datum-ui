import type { Task, TaskSummaryItem } from '@datum-cloud/datum-ui'
import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import {
  TaskPanelHeader,
  TaskPanelItem,
  TaskQueueProvider,
  TaskSummaryDialog,
  useTaskQueue,
} from '@datum-cloud/datum-ui'
import { FileText, Upload } from 'lucide-react'
import { useState } from 'react'

const meta: Meta = {
  title: 'Features/TaskQueue',
}

export default meta

type Story = StoryObj

// ---------------------------------------------------------------------------
// Static UI preview -- renders the TaskPanel pieces with hardcoded tasks
// ---------------------------------------------------------------------------

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

export const Default: Story = {
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

// ---------------------------------------------------------------------------
// Interactive story using the real TaskQueueProvider
// ---------------------------------------------------------------------------

function InteractiveTaskDemo() {
  const { enqueue, tasks, cancel, dismissAll } = useTaskQueue()

  const handleAddTask = () => {
    const batchItems = Array.from({ length: 5 }, (_, i) => ({ id: `item-${i}` }))
    enqueue({
      title: `Processing batch ${tasks.length + 1}`,
      cancelable: true,
      items: batchItems,
      processItem: async (_item, ctx) => {
        await new Promise(resolve => setTimeout(resolve, 800))
        if (!ctx.cancelled) {
          ctx.succeed()
        }
      },
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleAddTask}
          className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm"
        >
          Add Task
        </button>
        <button
          type="button"
          onClick={dismissAll}
          className="bg-secondary text-secondary-foreground rounded-md px-4 py-2 text-sm"
        >
          Dismiss All
        </button>
      </div>
      {tasks.length > 0 && (
        <div className="border-border/50 w-96 overflow-hidden rounded-xl border shadow-xl shadow-black/10">
          <TaskPanelHeader />
          <div className="max-h-96 overflow-y-auto">
            {tasks.map(task => (
              <TaskPanelItem
                key={task.id}
                task={task}
                onCancel={() => cancel(task.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export const Interactive: Story = {
  render: () => (
    <TaskQueueProvider>
      <InteractiveTaskDemo />
    </TaskQueueProvider>
  ),
}

// ---------------------------------------------------------------------------
// TaskSummaryDialog -- Default table
// ---------------------------------------------------------------------------

const sampleSummaryItems: TaskSummaryItem[] = [
  { id: '1', label: 'record-a.example.com', status: 'success' },
  { id: '2', label: 'record-b.example.com', status: 'success' },
  { id: '3', label: 'record-c.example.com', status: 'failed', message: 'Invalid format' },
  { id: '4', label: 'record-d.example.com', status: 'success' },
  { id: '5', label: 'record-e.example.com', status: 'failed', message: 'Duplicate entry' },
]

function SummaryDialogDemo() {
  const [open, setOpen] = useState(true)

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm"
      >
        Open Summary
      </button>
      <TaskSummaryDialog
        open={open}
        onOpenChange={setOpen}
        title="Import Results"
        items={sampleSummaryItems}
      />
    </div>
  )
}

export const SummaryDialog: Story = {
  render: () => (
    <TaskQueueProvider>
      <SummaryDialogDemo />
    </TaskQueueProvider>
  ),
}

// ---------------------------------------------------------------------------
// TaskSummaryDialog -- Custom renderContent
// ---------------------------------------------------------------------------

function CustomRenderDemo() {
  const [open, setOpen] = useState(true)

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm"
      >
        Open Custom Summary
      </button>
      <TaskSummaryDialog
        open={open}
        onOpenChange={setOpen}
        title="Custom Render Content"
        items={sampleSummaryItems}
        renderContent={items => (
          <div className="space-y-2">
            {items.map(item => (
              <div
                key={item.id}
                className={`flex items-center justify-between rounded-lg border p-3 ${
                  item.status === 'failed' ? 'border-destructive/30 bg-destructive/5' : 'border-border'
                }`}
              >
                <span className="text-sm font-medium">{item.label}</span>
                <span className={`text-xs font-medium ${
                  item.status === 'failed' ? 'text-destructive' : 'text-green-600'
                }`}
                >
                  {item.status === 'failed' ? item.message : 'OK'}
                </span>
              </div>
            ))}
          </div>
        )}
      />
    </div>
  )
}

export const SummaryDialogCustomRender: Story = {
  render: () => (
    <TaskQueueProvider>
      <CustomRenderDemo />
    </TaskQueueProvider>
  ),
}
