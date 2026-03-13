/// <reference types="@testing-library/jest-dom/vitest" />
import type { ColumnDef } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DataTableInlineContent } from '../components/inline-content'
import { ClientProvider } from '../core/client-provider'
import { useDataTableStore } from '../core/data-table-context'

interface TestRow {
  readonly id: string
  readonly name: string
}

const testColumns: ColumnDef<TestRow, any>[] = [{ accessorKey: 'name', header: 'Name' }]
const testData: TestRow[] = [
  { id: '1', name: 'Row A' },
  { id: '2', name: 'Row B' },
]

let capturedStore: any = null

/** Helper that captures the store from context */
function StoreCapturer({ children }: { readonly children: ReactNode }) {
  capturedStore = useDataTableStore()
  return <>{children}</>
}

function TestWrapper({
  children,
}: {
  readonly children: ReactNode
}) {
  return (
    <ClientProvider data={testData} columns={testColumns}>
      <StoreCapturer>
        {children}
      </StoreCapturer>
    </ClientProvider>
  )
}

describe('dataTableInlineContent', () => {
  it('registers inline content on mount', () => {
    const onClose = vi.fn()
    const renderFn = vi.fn()

    render(
      <TestWrapper>
        <DataTableInlineContent
          position="top"
          open={true}
          onClose={onClose}
        >
          {renderFn}
        </DataTableInlineContent>
      </TestWrapper>,
    )

    const state = capturedStore.getSnapshot()
    expect(state.inlineContents).toHaveLength(1)
    expect(state.inlineContents[0]).toMatchObject({
      position: 'top',
      open: true,
      onClose,
      render: renderFn,
    })
  })

  it('unregisters inline content on unmount', () => {
    const { unmount } = render(
      <TestWrapper>
        <DataTableInlineContent
          position="top"
          open={true}
          onClose={vi.fn()}
        >
          {vi.fn()}
        </DataTableInlineContent>
      </TestWrapper>,
    )

    expect(capturedStore.getSnapshot().inlineContents).toHaveLength(1)

    unmount()

    expect(capturedStore.getSnapshot().inlineContents).toHaveLength(0)
  })

  it('renders nothing itself', () => {
    const { container } = render(
      <TestWrapper>
        <DataTableInlineContent
          position="row"
          rowId="row-1"
          open={false}
          onClose={vi.fn()}
        >
          {vi.fn()}
        </DataTableInlineContent>
      </TestWrapper>,
    )

    // InlineContent renders null; the provider wrapper div is still present
    expect(container.querySelector('[data-slot="dt-inline-content"]')).toBeNull()
  })
})
