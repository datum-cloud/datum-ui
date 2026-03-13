/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ClientProvider } from '../core/client-provider'
import { useDataTableStore } from '../core/data-table-context'
import { useDataTableFilters, useDataTableLoading, useDataTablePagination, useDataTableSearch } from '../hooks/use-selectors'

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

  it('always renders children (no SSR gate)', () => {
    render(
      <ClientProvider data={testData} columns={testColumns}>
        <span data-testid="child">visible</span>
      </ClientProvider>,
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('accepts filters set before table is ready', async () => {
    function FilterReader() {
      const { filters, setFilter } = useDataTableFilters()
      return (
        <div>
          <span data-testid="filter-count">{Object.keys(filters).length}</span>
          <button type="button" onClick={() => setFilter('status', 'active')}>Set Filter</button>
        </div>
      )
    }

    render(
      <ClientProvider data={testData} columns={testColumns}>
        <FilterReader />
      </ClientProvider>,
    )

    expect(screen.getByTestId('filter-count')).toHaveTextContent('0')
    await userEvent.click(screen.getByText('Set Filter'))
    expect(screen.getByTestId('filter-count')).toHaveTextContent('1')
  })

  it('syncs loading prop into store', async () => {
    function LoadingReader() {
      const { isLoading } = useDataTableLoading()
      return <span data-testid="loading">{String(isLoading)}</span>
    }

    const { rerender } = render(
      <ClientProvider data={[]} columns={testColumns} loading>
        <LoadingReader />
      </ClientProvider>,
    )

    // After hydration, loading=true should be synced to store
    await vi.waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('true')
    })

    // When loading changes to false, store updates
    rerender(
      <ClientProvider data={testData} columns={testColumns} loading={false}>
        <LoadingReader />
      </ClientProvider>,
    )

    await vi.waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })
  })

  it('defaults isLoading to false when loading prop is omitted', async () => {
    function LoadingReader() {
      const { isLoading } = useDataTableLoading()
      return <span data-testid="loading">{String(isLoading)}</span>
    }

    render(
      <ClientProvider data={testData} columns={testColumns}>
        <LoadingReader />
      </ClientProvider>,
    )

    // Without loading prop, store should eventually settle to false
    await vi.waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })
  })
})
