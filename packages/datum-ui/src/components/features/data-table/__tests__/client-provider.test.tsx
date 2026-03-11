/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ClientProvider } from '../core/client-provider'
import { useDataTableClient } from '../hooks/use-data-table-client'
import { useDataTableContext } from '../hooks/use-selectors'

interface TestRow {
  readonly id: string
  readonly name: string
}

const testColumns = [{ accessorKey: 'name' as const, header: 'Name' }]
const testData: TestRow[] = [{ id: '1', name: 'Pod A' }]

function ContextReader() {
  const ctx = useDataTableContext<TestRow>()
  return (
    <div>
      <span data-testid="mode">{ctx.mode}</span>
      <span data-testid="search">{ctx.search}</span>
      <span data-testid="page-size">{ctx.pagination.pageSize}</span>
    </div>
  )
}

function TestWrapper() {
  const { store, table } = useDataTableClient({
    data: testData,
    columns: testColumns,
    pageSize: 20,
  })
  return (
    <ClientProvider store={store} table={table}>
      <ContextReader />
    </ClientProvider>
  )
}

describe('clientProvider', () => {
  it('provides context with client mode', () => {
    render(<TestWrapper />)

    expect(screen.getByTestId('mode')).toHaveTextContent('client')
    expect(screen.getByTestId('search')).toHaveTextContent('')
    expect(screen.getByTestId('page-size')).toHaveTextContent('20')
  })
})
