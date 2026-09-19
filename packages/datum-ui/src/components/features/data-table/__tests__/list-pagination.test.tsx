/// <reference types="@testing-library/jest-dom/vitest" />
import type { ColumnDef } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import type { DataTableFeatures } from '../core/features'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DataTableListPagination } from '../components/list-pagination'
import { ClientProvider } from '../core/client-provider'

interface TestRow {
  readonly id: string
  readonly name: string
}

const testColumns: ColumnDef<DataTableFeatures, TestRow, any>[] = [{ accessorKey: 'name', header: 'Name' }]
const testData: TestRow[] = Array.from({ length: 25 }, (_, i) => ({ id: String(i), name: `Pod ${i}` }))

function TestWrapper({
  data,
  columns,
  pageSize,
  children,
}: {
  readonly data: TestRow[]
  readonly columns: ColumnDef<DataTableFeatures, TestRow, any>[]
  readonly pageSize?: number
  readonly children: ReactNode
}) {
  return (
    <ClientProvider data={data} columns={columns} pageSize={pageSize}>
      {children}
    </ClientProvider>
  )
}

describe('dataTableListPagination', () => {
  it('renders the row-count summary', () => {
    render(
      <TestWrapper data={testData} columns={testColumns} pageSize={10}>
        <DataTableListPagination />
      </TestWrapper>,
    )

    expect(screen.getByText('1-10 of 25')).toBeInTheDocument()
  })

  it('appends resourceLabel to the summary', () => {
    render(
      <TestWrapper data={testData} columns={testColumns} pageSize={10}>
        <DataTableListPagination resourceLabel="organizations" />
      </TestWrapper>,
    )

    expect(screen.getByText('1-10 of 25 organizations')).toBeInTheDocument()
  })

  it('renders default English labels', () => {
    render(
      <TestWrapper data={testData} columns={testColumns} pageSize={10}>
        <DataTableListPagination />
      </TestWrapper>,
    )

    expect(screen.getByText('Rows per page')).toBeInTheDocument()
    expect(screen.getByLabelText('Previous page')).toBeInTheDocument()
    expect(screen.getByLabelText('Next page')).toBeInTheDocument()
  })

  it('overrides labels via the labels prop', () => {
    render(
      <TestWrapper data={testData} columns={testColumns} pageSize={10}>
        <DataTableListPagination labels={{ rowsPerPage: 'Zeilen pro Seite' }} />
      </TestWrapper>,
    )

    expect(screen.getByText('Zeilen pro Seite')).toBeInTheDocument()
  })

  it('renders when the data fits on a single page', () => {
    render(
      <TestWrapper data={testData.slice(0, 5)} columns={testColumns} pageSize={10}>
        <DataTableListPagination />
      </TestWrapper>,
    )

    expect(screen.getByText('1-5 of 5')).toBeInTheDocument()
  })

  it('hides entirely when hideWhenSinglePage is set and there is one page', () => {
    const { container } = render(
      <TestWrapper data={testData.slice(0, 5)} columns={testColumns} pageSize={10}>
        <DataTableListPagination hideWhenSinglePage />
      </TestWrapper>,
    )

    expect(container.querySelector('[data-slot="dt-list-pagination"]')).not.toBeInTheDocument()
  })

  it('still renders when hideWhenSinglePage is set but there is more than one page', () => {
    render(
      <TestWrapper data={testData} columns={testColumns} pageSize={10}>
        <DataTableListPagination hideWhenSinglePage />
      </TestWrapper>,
    )

    expect(screen.getByText('1-10 of 25')).toBeInTheDocument()
  })
})
