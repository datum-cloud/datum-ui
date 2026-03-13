import type { ReactNode } from 'react'
/// <reference types="@testing-library/jest-dom/vitest" />
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DataTableRenderKeyContext, DataTableStoreContext, TableInstanceContext } from '../core/data-table-context'
import { createDataTableStore } from '../core/store'
import {
  useDataTableFilters,
  useDataTableLoading,
  useDataTablePagination,
  useDataTableRows,
  useDataTableSearch,
  useDataTableSelection,
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

function createWrapper(store: any, table: any = mockTable) {
  return ({ children }: { children: ReactNode }) => (
    <DataTableStoreContext value={store}>
      <TableInstanceContext value={table}>
        <DataTableRenderKeyContext value={store.getSnapshot()._version}>
          {children}
        </DataTableRenderKeyContext>
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

describe('useDataTableRows (null table)', () => {
  it('returns empty rows when table is null', () => {
    const store = createDataTableStore({ data: sampleData, mode: 'client' })
    const { result } = renderHook(() => useDataTableRows(), {
      wrapper: createWrapper(store, null),
    })
    expect(result.current.rows).toEqual([])
    expect(result.current.headerGroups).toEqual([])
    expect(result.current.totalColumns).toBe(0)
  })
})

describe('useDataTablePagination (null table)', () => {
  it('returns disabled pagination state when table is null', () => {
    const store = createDataTableStore({ data: sampleData, mode: 'client', pageSize: 10 })
    const { result } = renderHook(() => useDataTablePagination(), {
      wrapper: createWrapper(store, null),
    })
    expect(result.current.canNextPage).toBe(false)
    expect(result.current.canPrevPage).toBe(false)
    expect(result.current.pageCount).toBe(0)
    expect(result.current.pageSize).toBe(10)
    expect(result.current.totalRows).toBe(0)
  })
})

describe('useDataTableSelection (null table)', () => {
  it('returns empty selection when table is null', () => {
    const store = createDataTableStore({ data: sampleData, mode: 'client' })
    const { result } = renderHook(() => useDataTableSelection(), {
      wrapper: createWrapper(store, null),
    })
    expect(result.current.rowSelection).toEqual({})
    expect(result.current.selectedRows).toEqual([])
  })
})
