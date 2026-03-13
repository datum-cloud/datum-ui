/// <reference types="@testing-library/jest-dom/vitest" />
import type { ColumnDef } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DataTableContent } from '../components/content'
import { ClientProvider } from '../core/client-provider'
import { DataTableRenderKeyContext, DataTableStoreContext, TableInstanceContext } from '../core/data-table-context'
import { createDataTableStore } from '../core/store'

interface TestRow {
  readonly id: string
  readonly name: string
}

const testColumns: ColumnDef<TestRow, any>[] = [{ accessorKey: 'name', header: 'Name' }]
const testData: TestRow[] = [
  { id: '1', name: 'Pod A' },
  { id: '2', name: 'Pod B' },
]

function TestWrapper({
  data,
  columns,
  children,
}: {
  readonly data: TestRow[]
  readonly columns: ColumnDef<TestRow, any>[]
  readonly children: ReactNode
}) {
  return (
    <ClientProvider data={data} columns={columns}>
      {children}
    </ClientProvider>
  )
}

describe('dataTableContent', () => {
  it('renders table with data', () => {
    render(
      <TestWrapper data={testData} columns={testColumns}>
        <DataTableContent />
      </TestWrapper>,
    )

    expect(screen.getByText('Pod A')).toBeInTheDocument()
    expect(screen.getByText('Pod B')).toBeInTheDocument()
  })

  it('renders empty message when no data', () => {
    render(
      <TestWrapper data={[]} columns={testColumns}>
        <DataTableContent emptyMessage="No pods found" />
      </TestWrapper>,
    )

    expect(screen.getByText('No pods found')).toBeInTheDocument()
  })

  it('renders default empty message', () => {
    render(
      <TestWrapper data={[]} columns={testColumns}>
        <DataTableContent />
      </TestWrapper>,
    )

    expect(screen.getByText('No results.')).toBeInTheDocument()
  })

  it('renders data-slot attributes on all elements', () => {
    const { container } = render(
      <TestWrapper data={testData} columns={testColumns}>
        <DataTableContent />
      </TestWrapper>,
    )

    expect(container.querySelector('[data-slot="dt"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="dt-table"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="dt-header"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="dt-header-row"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="dt-header-cell"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="dt-body"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="dt-row"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="dt-cell"]')).toBeInTheDocument()
  })

  it('renders data-slot="dt-empty" when no data', () => {
    const { container } = render(
      <TestWrapper data={[]} columns={testColumns}>
        <DataTableContent />
      </TestWrapper>,
    )

    expect(container.querySelector('[data-slot="dt-empty"]')).toBeInTheDocument()
  })
})

describe('dataTableContent loading state', () => {
  it('renders skeleton rows when isLoading is true', () => {
    const store = createDataTableStore<Record<string, unknown>>({
      data: [],
      mode: 'client',
      isLoading: true,
      pageSize: 10,
    })

    const mockTable = {
      getRowModel: () => ({ rows: [] }),
      getHeaderGroups: () => [],
      getAllColumns: () => [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
      getFilteredSelectedRowModel: () => ({ rows: [] }),
      getCanNextPage: () => false,
      getCanPreviousPage: () => false,
      getPageCount: () => 0,
      getFilteredRowModel: () => ({ rows: [] }),
      nextPage: () => {},
      previousPage: () => {},
    } as any

    const { container } = render(
      <DataTableStoreContext value={store}>
        <TableInstanceContext value={mockTable}>
          <DataTableRenderKeyContext value={0}>
            <DataTableContent emptyMessage="No pods found" />
          </DataTableRenderKeyContext>
        </TableInstanceContext>
      </DataTableStoreContext>,
    )

    expect(screen.queryByText('No pods found')).not.toBeInTheDocument()
    const skeletonRows = container.querySelectorAll('[data-slot="dt-skeleton-row"]')
    expect(skeletonRows).toHaveLength(10)
    // Each row should have 3 skeleton cells (matching totalColumns from mockTable)
    const skeletonCells = container.querySelectorAll('[data-slot="dt-skeleton-cell"]')
    expect(skeletonCells).toHaveLength(30)
  })

  it('uses columnCount from store when table has no columns', () => {
    const store = createDataTableStore<Record<string, unknown>>({
      data: [],
      mode: 'client',
      isLoading: true,
      pageSize: 3,
      columnCount: 5,
    })

    const mockTable = {
      getRowModel: () => ({ rows: [] }),
      getHeaderGroups: () => [],
      getAllColumns: () => [],
      getFilteredSelectedRowModel: () => ({ rows: [] }),
      getCanNextPage: () => false,
      getCanPreviousPage: () => false,
      getPageCount: () => 0,
      getFilteredRowModel: () => ({ rows: [] }),
      nextPage: () => {},
      previousPage: () => {},
    } as any

    const { container } = render(
      <DataTableStoreContext value={store}>
        <TableInstanceContext value={mockTable}>
          <DataTableRenderKeyContext value={0}>
            <DataTableContent />
          </DataTableRenderKeyContext>
        </TableInstanceContext>
      </DataTableStoreContext>,
    )

    const skeletonRows = container.querySelectorAll('[data-slot="dt-skeleton-row"]')
    expect(skeletonRows).toHaveLength(3)
    const skeletonCells = container.querySelectorAll('[data-slot="dt-skeleton-cell"]')
    expect(skeletonCells).toHaveLength(15)
  })

  it('shows empty message when not loading and no data', () => {
    const store = createDataTableStore<Record<string, unknown>>({
      data: [],
      mode: 'client',
      isLoading: false,
    })

    const mockTable = {
      getRowModel: () => ({ rows: [] }),
      getHeaderGroups: () => [],
      getAllColumns: () => [],
      getFilteredSelectedRowModel: () => ({ rows: [] }),
      getCanNextPage: () => false,
      getCanPreviousPage: () => false,
      getPageCount: () => 0,
      getFilteredRowModel: () => ({ rows: [] }),
      nextPage: () => {},
      previousPage: () => {},
    } as any

    render(
      <DataTableStoreContext value={store}>
        <TableInstanceContext value={mockTable}>
          <DataTableRenderKeyContext value={0}>
            <DataTableContent emptyMessage="No pods found" />
          </DataTableRenderKeyContext>
        </TableInstanceContext>
      </DataTableStoreContext>,
    )

    expect(screen.getByText('No pods found')).toBeInTheDocument()
  })
})
