/// <reference types="@testing-library/jest-dom/vitest" />
import type { TaskQueue } from '../../engine'
import type { TaskSummaryItem } from '../../types'
import { render, screen } from '@testing-library/react'
import { use } from 'react'
import { describe, expect, it } from 'vitest'
import { ErrorDescriptionProvider } from '../../../error-content/error-description-context'
import { MemoryTaskStorage } from '../../engine/storage/memory-storage'
import { TaskQueueContext, TaskQueueProvider } from '../../provider/task-queue-provider'
import { TaskSummaryDialog } from '../task-summary-dialog'

function renderDialog(items: TaskSummaryItem[]) {
  return render(
    <TaskQueueProvider config={{ storage: new MemoryTaskStorage() }}>
      <TaskSummaryDialog open onOpenChange={() => {}} title="Delete records" items={items} />
    </TaskQueueProvider>,
  )
}

describe('taskSummaryDialog error details', () => {
  it('shows the plain message with the raw text behind closed Error details', () => {
    renderDialog([{ id: '1', label: 'web', status: 'failed', message: 'Plain', detail: 'raw' }])
    expect(screen.getByText('Plain')).toBeInTheDocument()
    const details = screen.getByText('Error details').closest('details')
    expect(details).not.toBeNull()
    expect(details).not.toHaveAttribute('open')
    expect(details).toHaveTextContent('raw')
  })

  it('shows no details for an item without detail', () => {
    renderDialog([{ id: '1', label: 'web', status: 'failed', message: 'Plain' }])
    expect(screen.queryByText('Error details')).toBeNull()
  })
})

describe('taskQueueProvider error formatting', () => {
  it('describes thrown errors with the tree\'s describer by default', async () => {
    let queue: TaskQueue | undefined
    function Capture() {
      queue = use(TaskQueueContext)?.queue
      return null
    }
    render(
      <ErrorDescriptionProvider describe={() => ({ title: 'From provider' })}>
        <TaskQueueProvider config={{ storage: new MemoryTaskStorage() }}>
          <Capture />
        </TaskQueueProvider>
      </ErrorDescriptionProvider>,
    )
    const outcome = await queue!.enqueue({ title: 't', processor: async () => {
      throw new Error('raw')
    } }).promise
    expect(outcome.failedItems[0]?.message).toBe('From provider')
  })
})
