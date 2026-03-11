/// <reference types="@testing-library/jest-dom/vitest" />
import type { ColumnDef } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DataTableContent } from '../components/content'
import { ClientProvider } from '../core/client-provider'
import { useDataTableClient } from '../hooks/use-data-table-client'

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
  const { store, table } = useDataTableClient({ data, columns })
  return (
    <ClientProvider store={store} table={table}>
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
