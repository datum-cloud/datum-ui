import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useDataTableClient } from '../hooks/use-data-table-client'

interface TestRow {
  id: string
  name: string
  status: string
}

const testData: TestRow[] = [
  { id: '1', name: 'Pod A', status: 'running' },
  { id: '2', name: 'Pod B', status: 'pending' },
  { id: '3', name: 'Pod C', status: 'running' },
]

const testColumns = [
  { accessorKey: 'name' as const, header: 'Name' },
  { accessorKey: 'status' as const, header: 'Status' },
]

describe('useDataTableClient', () => {
  it('returns initial state with defaults', () => {
    const { result } = renderHook(() =>
      useDataTableClient({ data: testData, columns: testColumns }),
    )

    const state = result.current.store.getSnapshot()
    expect(state.data).toEqual(testData)
    expect(state.sorting).toEqual([])
    expect(state.filters).toEqual({})
    expect(state.search).toBe('')
    expect(state.rowSelection).toEqual({})
    expect(state.pageIndex).toBe(0)
    expect(state.pageSize).toBe(20)
  })

  it('updates sorting state', () => {
    const { result } = renderHook(() =>
      useDataTableClient({ data: testData, columns: testColumns }),
    )

    act(() => {
      result.current.store.setSorting([{ id: 'name', desc: false }])
    })

    expect(result.current.store.getSnapshot().sorting).toEqual([{ id: 'name', desc: false }])
  })

  it('manages filter state immutably', () => {
    const { result } = renderHook(() =>
      useDataTableClient({ data: testData, columns: testColumns }),
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

  it('manages search state', () => {
    const { result } = renderHook(() =>
      useDataTableClient({ data: testData, columns: testColumns }),
    )

    act(() => {
      result.current.store.setSearch('Pod A')
    })

    expect(result.current.store.getSnapshot().search).toBe('Pod A')

    act(() => {
      result.current.store.clearSearch()
    })

    expect(result.current.store.getSnapshot().search).toBe('')
  })

  it('manages pagination state', () => {
    const { result } = renderHook(() =>
      useDataTableClient({ data: testData, columns: testColumns, pageSize: 2 }),
    )

    expect(result.current.store.getSnapshot().pageSize).toBe(2)
    expect(result.current.store.getSnapshot().pageIndex).toBe(0)

    act(() => {
      result.current.store.setPageIndex(1)
    })

    expect(result.current.store.getSnapshot().pageIndex).toBe(1)
  })

  it('respects defaultSort and defaultFilters', () => {
    const { result } = renderHook(() =>
      useDataTableClient({
        data: testData,
        columns: testColumns,
        defaultSort: [{ id: 'name', desc: true }],
        defaultFilters: { status: 'running' },
      }),
    )

    const state = result.current.store.getSnapshot()
    expect(state.sorting).toEqual([{ id: 'name', desc: true }])
    expect(state.filters).toEqual({ status: 'running' })
  })

  it('clears all filters', () => {
    const { result } = renderHook(() =>
      useDataTableClient({
        data: testData,
        columns: testColumns,
        defaultFilters: { status: 'running', name: 'Pod' },
      }),
    )

    act(() => {
      result.current.store.clearAllFilters()
    })

    expect(result.current.store.getSnapshot().filters).toEqual({})
  })

  it('reads initial state from stateAdapter on mount', () => {
    const adapter = {
      read: () => ({
        sorting: [{ id: 'name', desc: true }],
        filters: { status: 'running' },
        search: 'test',
      }),
      write: () => {},
    }

    const { result } = renderHook(() =>
      useDataTableClient({
        data: testData,
        columns: testColumns,
        stateAdapter: adapter,
      }),
    )

    // Adapter hydration happens in a mount effect, so state should be synced
    const state = result.current.store.getSnapshot()
    expect(state.sorting).toEqual([{ id: 'name', desc: true }])
    expect(state.filters).toEqual({ status: 'running' })
    expect(state.search).toBe('test')
  })
})
