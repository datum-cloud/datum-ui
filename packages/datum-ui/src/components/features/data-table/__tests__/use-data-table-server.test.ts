import { act, renderHook } from '@testing-library/react'
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

const mockFetchFn = vi.fn<any>().mockResolvedValue({
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
})
