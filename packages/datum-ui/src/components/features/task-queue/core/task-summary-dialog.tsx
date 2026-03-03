import type { ReactNode } from 'react'
import type { TaskSummaryItem } from '../types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/shadcn/ui/table'
import { CircleCheck, XCircle } from 'lucide-react'
import { useMemo } from 'react'
import { cn } from '../../../../utils/cn'
import { Button } from '../../../base/button/button'
import { Dialog } from '../../../base/dialog'
import { Icon } from '../../../icons/icon-wrapper'
import { useTaskQueue } from '../hooks/use-task-queue'

interface BaseProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  actions?: ReactNode
  renderContent?: (items: TaskSummaryItem[]) => ReactNode
}

type ItemsMode = BaseProps & {
  items: TaskSummaryItem[]
  taskId?: never
  getItemLabel?: never
}

type TaskIdMode = BaseProps & {
  taskId: string
  getItemLabel: (id: string) => string
  items?: never
}

export type TaskSummaryDialogProps = ItemsMode | TaskIdMode

// =============================================================================
// Status Config
// =============================================================================

function getStatusConfig(status: TaskSummaryItem['status']) {
  switch (status) {
    case 'success':
      return { icon: CircleCheck, label: 'Success', className: 'text-green-600' }
    case 'failed':
      return { icon: XCircle, label: 'Failed', className: 'text-destructive' }
  }
}

// =============================================================================
// Status Cell
// =============================================================================

function StatusCell({ item }: { item: TaskSummaryItem }) {
  const config = getStatusConfig(item.status)
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1.5">
        <Icon icon={config.icon} className={cn('size-4', config.className)} />
        <span className={cn('text-xs font-medium', config.className)}>{config.label}</span>
      </div>
      {item.message && item.status !== 'success' && (
        <span className="text-muted-foreground pl-5.5 text-xs text-wrap">{item.message}</span>
      )}
    </div>
  )
}

// =============================================================================
// Default Table Content
// =============================================================================

function DefaultTableContent({ items }: { items: TaskSummaryItem[] }) {
  const sorted = useMemo(() =>
    [...items].sort((a, b) => {
      if (a.status === 'failed' && b.status !== 'failed')
        return -1
      if (a.status !== 'failed' && b.status === 'failed')
        return 1
      return 0
    }), [items])

  return (
    <div className="max-h-[400px] overflow-auto rounded-xl border">
      <Table>
        <TableHeader className="bg-muted/50 sticky top-0">
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead className="max-w-80">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.length === 0
            ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-muted-foreground py-6 text-center">No items</TableCell>
                </TableRow>
              )
            : sorted.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.label}</TableCell>
                  <TableCell className="max-w-80 break-all text-wrap whitespace-normal">
                    <StatusCell item={item} />
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  )
}

// =============================================================================
// Hook: Build items from task ID
// =============================================================================

function useTaskSummaryItems(
  taskId: string | undefined,
  getItemLabel: ((id: string) => string) | undefined,
): TaskSummaryItem[] {
  const { tasks } = useTaskQueue()

  return useMemo(() => {
    if (!taskId || !getItemLabel)
      return []

    const task = tasks.find(t => t.id === taskId)
    if (!task)
      return []

    const succeeded: TaskSummaryItem[] = task.succeededItems.map(id => ({
      id,
      label: getItemLabel(id),
      status: 'success',
    }))

    const failed: TaskSummaryItem[] = task.failedItems.map(item => ({
      id: item.id ?? '',
      label: getItemLabel(item.id ?? ''),
      status: 'failed',
      message: item.message,
    }))

    return [...failed, ...succeeded]
  }, [taskId, getItemLabel, tasks])
}

// =============================================================================
// Component
// =============================================================================

export function TaskSummaryDialog(props: TaskSummaryDialogProps) {
  const { open, onOpenChange, title, description, actions, renderContent } = props

  const taskIdItems = useTaskSummaryItems(
    'taskId' in props ? props.taskId : undefined,
    'getItemLabel' in props ? props.getItemLabel : undefined,
  )

  const resolvedItems = props.items ?? taskIdItems

  const successCount = resolvedItems.filter(i => i.status === 'success').length
  const failedCount = resolvedItems.filter(i => i.status === 'failed').length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="w-full sm:max-w-[774px]">
        <Dialog.Header
          title={title}
          description={description ?? `${successCount} succeeded, ${failedCount} failed`}
          onClose={() => onOpenChange(false)}
          className="border-b-0"
        />
        <Dialog.Body className="px-5 py-0">
          {renderContent
            ? renderContent(resolvedItems)
            : <DefaultTableContent items={resolvedItems} />}
        </Dialog.Body>
        <Dialog.Footer className="border-t-0">
          {actions}
          <Button type="primary" theme="solid" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  )
}
