/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useDataTableStore } from '../core/data-table-context'
import { ServerProvider } from '../core/server-provider'
import { useDataTableLoading } from '../hooks/use-selectors'

interface TestRow {
  readonly id: string
  readonly name: string
}

interface TestResponse {
  readonly items: TestRow[]
}

const testColumns = [{ accessorKey: 'name' as const, header: 'Name' }]
const testData: TestRow[] = [{ id: '1', name: 'Pod A' }]

const mockFetchFn = vi.fn<any>().mockResolvedValue({ items: testData })

function mockTransform(response: TestResponse) {
  return { data: response.items, hasNextPage: false }
}

function ContextReader() {
  const store = useDataTableStore()
  const { isLoading } = useDataTableLoading()
  const mode = store.getSnapshot().mode
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <span data-testid="loading">{String(isLoading)}</span>
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

  it('starts loading and fetches after hydration', async () => {
    const fetchSpy = vi.fn<any>().mockResolvedValue({ items: testData })

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
