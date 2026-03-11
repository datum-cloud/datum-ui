/// <reference types="@testing-library/jest-dom/vitest" />
import type { ColumnDef } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DataTablePagination } from '../components/pagination'
import { ClientProvider } from '../core/client-provider'
import { useDataTableClient } from '../hooks/use-data-table-client'

interface TestRow {
  readonly id: string
  readonly name: string
}

const testColumns: ColumnDef<TestRow, any>[] = [{ accessorKey: 'name', header: 'Name' }]
const testData: TestRow[] = Array.from({ length: 25 }, (_, i) => ({ id: String(i), name: `Pod ${i}` }))

function TestWrapper({
  data,
  columns,
  pageSize,
  children,
}: {
  readonly data: TestRow[]
  readonly columns: ColumnDef<TestRow, any>[]
  readonly pageSize?: number
  readonly children: ReactNode
}) {
  const { store, table } = useDataTableClient({ data, columns, pageSize })
  return (
    <ClientProvider store={store} table={table}>
      {children}
    </ClientProvider>
  )
}

describe('dataTablePagination', () => {
  it('renders row info in client mode', () => {
    render(
      <TestWrapper data={testData} columns={testColumns} pageSize={10}>
        <DataTablePagination />
      </TestWrapper>,
    )

    expect(screen.getByText(/Showing 1 to 10 of 25 rows/)).toBeInTheDocument()
  })

  it('renders page number buttons in client mode', () => {
    render(
      <TestWrapper data={testData} columns={testColumns} pageSize={10}>
        <DataTablePagination />
      </TestWrapper>,
    )

    // 25 items / 10 per page = 3 pages
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument()
  })

  it('renders rows per page selector', () => {
    render(
      <TestWrapper data={testData} columns={testColumns} pageSize={10}>
        <DataTablePagination />
      </TestWrapper>,
    )

    expect(screen.getByText('Rows per page')).toBeInTheDocument()
  })
})
