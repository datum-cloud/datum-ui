/// <reference types="@testing-library/jest-dom/vitest" />
import type { ColumnDef } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DataTableInlineContent } from '../components/inline-content'
import { ClientProvider } from '../core/client-provider'
import { useDataTableClient } from '../hooks/use-data-table-client'

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

function TestWrapper({
  data,
  columns,
  children,
}: {
  readonly data: TestRow[]
  readonly columns: ColumnDef<TestRow, any>[]
  readonly children: ReactNode
}) {
  const { store, table } = useDataTableClient({ data, columns })
  capturedStore = store
  return (
    <ClientProvider store={store} table={table}>
      {children}
    </ClientProvider>
  )
}

describe('dataTableInlineContent', () => {
  it('registers inline content on mount', () => {
    const onClose = vi.fn()
    const renderFn = vi.fn()

    render(
      <TestWrapper data={testData} columns={testColumns}>
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
      <TestWrapper data={testData} columns={testColumns}>
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
      <TestWrapper data={testData} columns={testColumns}>
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
