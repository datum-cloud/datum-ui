/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ClientProvider } from '../core/client-provider'
import { useDataTableStore } from '../core/data-table-context'
import { useDataTablePagination, useDataTableSearch } from '../hooks/use-selectors'

interface TestRow {
  readonly id: string
  readonly name: string
}

const testColumns = [{ accessorKey: 'name' as const, header: 'Name' }]
const testData: TestRow[] = [{ id: '1', name: 'Pod A' }]

function ContextReader() {
  const store = useDataTableStore()
  const { search } = useDataTableSearch()
  const { pageSize } = useDataTablePagination()
  const mode = store.getSnapshot().mode
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <span data-testid="search">{search}</span>
      <span data-testid="page-size">{pageSize}</span>
    </div>
  )
}

describe('clientProvider', () => {
  it('provides context with client mode', () => {
    render(
      <ClientProvider
        data={testData}
        columns={testColumns}
        pageSize={20}
      >
        <ContextReader />
      </ClientProvider>,
    )

    expect(screen.getByTestId('mode')).toHaveTextContent('client')
    expect(screen.getByTestId('search')).toHaveTextContent('')
    expect(screen.getByTestId('page-size')).toHaveTextContent('20')
  })
})
