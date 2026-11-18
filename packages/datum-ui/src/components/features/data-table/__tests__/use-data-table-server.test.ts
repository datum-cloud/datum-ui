import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useDataTableServer } from '../hooks/use-data-table-server'

interface TestRow {
  id: string
  name: string
}

interface TestResponse {
  items: TestRow[]
  nextCursor?: string
}

const testColumns = [{ accessorKey: 'name' as const, header: 'Name' }]

const mockFetchFn = (vi.fn() as any).mockResolvedValue({
  items: [{ id: '1', name: 'Pod A' }],
  nextCursor: 'abc123',
})

function mockTransform(response: TestResponse) {
  return {
    data: response.items,
    nextCursor: response.nextCursor,
    hasNextPage: !!response.nextCursor,
  }
}

describe('useDataTableServer', () => {
  it('returns initial state with defaults', () => {
    const { result } = renderHook(() =>
      useDataTableServer<TestResponse, TestRow>({
        columns: testColumns,
        fetchFn: mockFetchFn,
        transform: mockTransform,
      }),
    )

    const state = result.current.store.getSnapshot()
    expect(state.data).toEqual([])
    expect(state.isLoading).toBe(true)
    expect(state.sorting).toEqual([])
    expect(state.filters).toEqual({})
    expect(state.search).toBe('')
    expect(state.pageSize).toBe(20)
  })

  it('updates sorting state', () => {
    const { result } = renderHook(() =>
      useDataTableServer<TestResponse, TestRow>({
        columns: testColumns,
        fetchFn: mockFetchFn,
        transform: mockTransform,
      }),
    )

    act(() => {
      result.current.store.setSorting([{ id: 'name', desc: false }])
    })

    expect(result.current.store.getSnapshot().sorting).toEqual([{ id: 'name', desc: false }])
  })

  it('manages filter state immutably', () => {
    const { result } = renderHook(() =>
      useDataTableServer<TestResponse, TestRow>({
        columns: testColumns,
        fetchFn: mockFetchFn,
        transform: mockTransform,
      }),
    )

    act(() => {
      result.current.store.setFilter('status', 'running')
    })

    expect(result.current.store.getSnapshot().filters).toEqual({ status: 'running' })

    act(() => {
      result.current.store.clearFilter('status')
    })

    expect(result.current.store.getSnapshot().filters).toEqual({})
  })

  it('syncs a limit prop change into the store page size', () => {
    const { result, rerender } = renderHook(
      ({ limit }) => useDataTableServer<TestResponse, TestRow>({
        columns: testColumns,
        fetchFn: mockFetchFn,
        transform: mockTransform,
        limit,
      }),
      { initialProps: { limit: 10 } },
    )
    expect(result.current.store.getSnapshot().pageSize).toBe(10)

    rerender({ limit: 25 })

    expect(result.current.store.getSnapshot().pageSize).toBe(25)
  })

  it('manages page size', () => {
    const { result } = renderHook(() =>
      useDataTableServer<TestResponse, TestRow>({
        columns: testColumns,
        fetchFn: mockFetchFn,
        transform: mockTransform,
        limit: 10,
      }),
    )

    expect(result.current.store.getSnapshot().pageSize).toBe(10)

    act(() => {
      result.current.store.setPageSize(25)
    })

    expect(result.current.store.getSnapshot().pageSize).toBe(25)
  })

  it('snaps an arbitrary page jump with no known cursor back to page 0', async () => {
    const { result } = renderHook(() =>
      useDataTableServer<TestResponse, TestRow>({
        columns: testColumns,
        fetchFn: mockFetchFn,
        transform: mockTransform,
      }),
    )

    // Cursor pagination is sequential; page 5 has no cursor on a fresh table.
    // Jumping there must not render page-0 data mislabeled as page 5.
    await act(async () => {
      result.current.store.setPageIndex(5)
      await Promise.resolve()
    })

    expect(result.current.store.getSnapshot().pageIndex).toBe(0)
  })

  it('clears all filters', () => {
    const { result } = renderHook(() =>
      useDataTableServer<TestResponse, TestRow>({
        columns: testColumns,
        fetchFn: mockFetchFn,
        transform: mockTransform,
        defaultFilters: { status: 'running', name: 'Pod' },
      }),
    )

    act(() => {
      result.current.store.clearAllFilters()
    })

    expect(result.current.store.getSnapshot().filters).toEqual({})
  })

  it('fetches again with the same arguments on refetch', async () => {
    const fetchFn = (vi.fn() as any).mockResolvedValue({ items: [{ id: '1', name: 'Pod A' }] })
    const { result } = renderHook(() => useDataTableServer<TestResponse, TestRow>({ columns: testColumns, fetchFn, transform: mockTransform }))
    await waitFor(() => expect(fetchFn).toHaveBeenCalledTimes(1))
    act(() => result.current.store.refetch())
    await waitFor(() => expect(fetchFn).toHaveBeenCalledTimes(2))
    expect(fetchFn.mock.calls[1][0]).toEqual(fetchFn.mock.calls[0][0])
  })

  it('keeps a thrown non-Error value readable and as the cause', async () => {
    const thrown = { kind: 'Status', message: 'denied' }
    const fetchFn = (vi.fn() as any).mockRejectedValue(thrown)
    const { result } = renderHook(() => useDataTableServer<TestResponse, TestRow>({ columns: testColumns, fetchFn, transform: mockTransform }))
    await waitFor(() => expect(result.current.store.getSnapshot().error).not.toBeNull())
    const error = result.current.store.getSnapshot().error!
    expect(error.message).toBe('denied')
    expect(error.cause).toBe(thrown)
  })
})
