/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useDataTableStore } from '../core/data-table-context'
import { ServerProvider } from '../core/server-provider'
import { useDataTableLoading, useDataTablePagination } from '../hooks/use-selectors'

interface TestRow {
  readonly id: string
  readonly name: string
}

interface TestResponse {
  readonly items: TestRow[]
}

const testColumns = [{ accessorKey: 'name' as const, header: 'Name' }]
const testData: TestRow[] = [{ id: '1', name: 'Pod A' }]

const mockFetchFn = (vi.fn() as any).mockResolvedValue({ items: testData })

function mockTransform(response: TestResponse) {
  return { data: response.items, hasNextPage: false }
}

function ContextReader() {
  const store = useDataTableStore()
  const { isLoading } = useDataTableLoading()
  const { pageSize } = useDataTablePagination()
  const mode = store.getSnapshot().mode
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <span data-testid="loading">{String(isLoading)}</span>
      <span data-testid="page-size">{pageSize}</span>
    </div>
  )
}

describe('serverProvider', () => {
  it('provides context with server mode', () => {
    render(
      <ServerProvider
        columns={testColumns}
        fetchFn={mockFetchFn}
        transform={mockTransform}
      >
        <ContextReader />
      </ServerProvider>,
    )

    expect(screen.getByTestId('mode')).toHaveTextContent('server')
  })

  it('renders children within the provider', () => {
    render(
      <ServerProvider
        columns={testColumns}
        fetchFn={mockFetchFn}
        transform={mockTransform}
      >
        <ContextReader />
      </ServerProvider>,
    )

    expect(screen.getByTestId('mode')).toBeInTheDocument()
    expect(screen.getByTestId('loading')).toBeInTheDocument()
  })

  it('always renders children (no SSR gate)', () => {
    render(
      <ServerProvider
        columns={testColumns}
        fetchFn={mockFetchFn}
        transform={mockTransform}
      >
        <span data-testid="child">visible</span>
      </ServerProvider>,
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('syncs limit prop updates into the store and refetches with the new limit', async () => {
    const fetchSpy = (vi.fn() as any).mockResolvedValue({ items: testData })
    const { rerender } = render(
      <ServerProvider columns={testColumns} fetchFn={fetchSpy} transform={mockTransform} limit={10}>
        <ContextReader />
      </ServerProvider>,
    )
    expect(screen.getByTestId('page-size')).toHaveTextContent('10')
    await vi.waitFor(() => {
      expect(fetchSpy).toHaveBeenLastCalledWith(expect.objectContaining({ limit: 10 }))
    })

    rerender(
      <ServerProvider columns={testColumns} fetchFn={fetchSpy} transform={mockTransform} limit={25}>
        <ContextReader />
      </ServerProvider>,
    )

    await vi.waitFor(() => {
      expect(screen.getByTestId('page-size')).toHaveTextContent('25')
      expect(fetchSpy).toHaveBeenLastCalledWith(expect.objectContaining({ limit: 25 }))
    })
  })

  it('starts loading and fetches after hydration', async () => {
    const fetchSpy = (vi.fn() as any).mockResolvedValue({ items: testData })

    render(
      <ServerProvider
        columns={testColumns}
        fetchFn={fetchSpy}
        transform={mockTransform}
      >
        <ContextReader />
      </ServerProvider>,
    )

    // Store starts with isLoading: true
    expect(screen.getByTestId('loading')).toHaveTextContent('true')

    // fetchFn is called after hydration (useEffect fires)
    await vi.waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledTimes(1)
    })
  })
})
