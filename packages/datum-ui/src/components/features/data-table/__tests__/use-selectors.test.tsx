import type { ReactNode } from 'react'
/// <reference types="@testing-library/jest-dom/vitest" />
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DataTableStoreContext, TableInstanceContext } from '../core/data-table-context'
import { createDataTableStore } from '../core/store'
import {
  useDataTableFilters,
  useDataTableLoading,
  useDataTableSearch,
} from '../hooks/use-selectors'

const sampleData = [
  { id: '1', name: 'Alice', department: 'Engineering', status: 'active' },
  { id: '2', name: 'Bob', department: 'Design', status: 'inactive' },
]

const mockTable = {
  getCanNextPage: () => false,
  getCanPreviousPage: () => false,
  nextPage: vi.fn(),
  previousPage: vi.fn(),
  getPageCount: () => 1,
  getRowModel: () => ({ rows: [] }),
  getHeaderGroups: () => [],
  getAllColumns: () => [],
  getFilteredSelectedRowModel: () => ({ rows: [] }),
  getState: () => ({ pagination: { pageIndex: 0, pageSize: 20 } }),
} as any

function createWrapper(store: any, table = mockTable) {
  return ({ children }: { children: ReactNode }) => (
    <DataTableStoreContext value={store}>
      <TableInstanceContext value={table}>
        {children}
      </TableInstanceContext>
    </DataTableStoreContext>
  )
}

describe('useDataTableFilters', () => {
  it('returns current filters and setters', () => {
    const store = createDataTableStore({ data: sampleData, mode: 'client' })
    const { result } = renderHook(() => useDataTableFilters(), {
      wrapper: createWrapper(store),
    })
    expect(result.current.filters).toEqual({})
    act(() => store.setFilter('status', 'active'))
    expect(result.current.filters).toEqual({ status: 'active' })
  })

  it('does NOT re-render when sorting changes', () => {
    const store = createDataTableStore({ data: sampleData, mode: 'client' })
    const renderCount = { current: 0 }
    renderHook(() => {
      renderCount.current++
      return useDataTableFilters()
    }, { wrapper: createWrapper(store) })

    const countBefore = renderCount.current
    act(() => store.setSorting([{ id: 'name', desc: true }]))
    expect(renderCount.current).toBe(countBefore)
  })
})

describe('useDataTableSearch', () => {
  it('returns current search and setters', () => {
    const store = createDataTableStore({ data: sampleData, mode: 'client' })
    const { result } = renderHook(() => useDataTableSearch(), {
      wrapper: createWrapper(store),
    })
    expect(result.current.search).toBe('')
    act(() => store.setSearch('alice'))
    expect(result.current.search).toBe('alice')
  })
})

describe('useDataTableLoading', () => {
  it('returns loading and error state', () => {
    const store = createDataTableStore({ data: [], mode: 'server' })
    const { result } = renderHook(() => useDataTableLoading(), {
      wrapper: createWrapper(store),
    })
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()

    act(() => store.setLoading(true))
    expect(result.current.isLoading).toBe(true)

    act(() => store.setError(new Error('fail')))
    expect(result.current.error?.message).toBe('fail')
  })

  it('does NOT re-render when filters change', () => {
    const store = createDataTableStore({ data: sampleData, mode: 'server' })
    const renderCount = { current: 0 }
    renderHook(() => {
      renderCount.current++
      return useDataTableLoading()
    }, { wrapper: createWrapper(store) })

    const countBefore = renderCount.current
    act(() => store.setFilter('status', 'active'))
    expect(renderCount.current).toBe(countBefore)
  })
})

