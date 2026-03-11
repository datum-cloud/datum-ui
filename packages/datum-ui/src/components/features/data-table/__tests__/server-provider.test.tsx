/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ServerProvider } from '../core/server-provider'
import { useDataTableServer } from '../hooks/use-data-table-server'
import { useDataTableContext } from '../hooks/use-selectors'

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
  const ctx = useDataTableContext<TestRow>()
  return (
    <div>
      <span data-testid="mode">{ctx.mode}</span>
      <span data-testid="loading">{String(ctx.isLoading)}</span>
    </div>
  )
}

function TestWrapper() {
  const { store, table } = useDataTableServer<TestResponse, TestRow>({
    columns: testColumns,
    fetchFn: mockFetchFn,
    transform: mockTransform,
  })
  return (
    <ServerProvider store={store} table={table}>
      <ContextReader />
    </ServerProvider>
  )
}

describe('serverProvider', () => {
  it('provides context with server mode', () => {
    render(<TestWrapper />)

    expect(screen.getByTestId('mode')).toHaveTextContent('server')
  })

  it('renders children within the provider', () => {
    render(<TestWrapper />)

    expect(screen.getByTestId('mode')).toBeInTheDocument()
    expect(screen.getByTestId('loading')).toBeInTheDocument()
  })
})
