'use client'

import type { HeaderGroup, Row } from '@tanstack/react-table'
import type { DataTableStoreState, InlineContentEntry } from '../types'
import { useCallback, useRef, useSyncExternalStore } from 'react'
import { useDataTableStore, useRenderKey, useTableInstanceOrNull } from '../core/data-table-context'

function shallowEqual(a: Record<string, unknown>, b: Record<string, unknown>): boolean {
  const keysA = Object.keys(a)
  const keysB = Object.keys(b)
  if (keysA.length !== keysB.length)
    return false
  for (const key of keysA) {
    const va = a[key]
    const vb = b[key]
    if (va === vb)
      continue
    // Treat arrays as equal if they have the same length and same items by reference
    if (Array.isArray(va) && Array.isArray(vb)) {
      if (va.length !== vb.length)
        return false
      for (let i = 0; i < va.length; i++) {
        if (va[i] !== vb[i])
          return false
      }
      continue
    }
    return false
  }
  return true
}

function useSliceSelector<TData, TSlice extends Record<string, unknown>>(
  selector: (state: DataTableStoreState<TData>) => TSlice,
): TSlice {
  const store = useDataTableStore<TData>()
  const cachedRef = useRef<TSlice | null>(null)

  const getSnapshot = useCallback(() => {
    const next = selector(store.getSnapshot())
    if (cachedRef.current && shallowEqual(cachedRef.current, next)) {
      return cachedRef.current
    }
    cachedRef.current = next
    return next
  }, [store, selector])

  return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot)
}

export function useDataTableFilters() {
  const store = useDataTableStore()
  return useSliceSelector(
    useCallback((state: DataTableStoreState<any>) => ({
      filters: state.filters,
      setFilter: store.setFilter,
      clearFilter: store.clearFilter,
      clearAllFilters: store.clearAllFilters,
      registerFilter: store.registerFilter,
      unregisterFilter: store.unregisterFilter,
    }), [store]),
  )
}

export function useDataTableSearch() {
  const store = useDataTableStore()
  return useSliceSelector(
    useCallback((state: DataTableStoreState<any>) => ({
      search: state.search,
      setSearch: store.setSearch,
      clearSearch: store.clearSearch,
    }), [store]),
  )
}

export function useDataTableSorting() {
  const store = useDataTableStore()
  return useSliceSelector(
    useCallback((state: DataTableStoreState<any>) => ({
      sorting: state.sorting,
      setSorting: store.setSorting,
    }), [store]),
  )
}

export function useDataTableSelection<TData>() {
  useRenderKey() // re-render when store changes (table is mutable singleton)
  const store = useDataTableStore<TData>()
  const table = useTableInstanceOrNull<TData>()
  const state = store.getSnapshot()

  return {
    rowSelection: state.rowSelection,
    setRowSelection: store.setRowSelection,
    selectedRows: table
      ? table.getFilteredSelectedRowModel().rows.map(r => r.original)
      : [] as TData[],
  }
}

export function useDataTablePagination() {
  useRenderKey() // re-render when store changes (table is mutable singleton)
  const store = useDataTableStore()
  const table = useTableInstanceOrNull()
  const state = store.getSnapshot()

  if (!table) {
    return {
      canNextPage: false,
      canPrevPage: false,
      nextPage: () => {},
      prevPage: () => {},
      pageIndex: state.pageIndex,
      pageCount: 0,
      setPageIndex: store.setPageIndex,
      pageSize: state.pageSize,
      setPageSize: store.setPageSize,
      totalRows: 0,
    }
  }

  return {
    canNextPage: table.getCanNextPage(),
    canPrevPage: table.getCanPreviousPage(),
    nextPage: () => table.nextPage(),
    prevPage: () => table.previousPage(),
    pageIndex: state.pageIndex,
    pageCount: table.getPageCount(),
    setPageIndex: store.setPageIndex,
    pageSize: state.pageSize,
    setPageSize: store.setPageSize,
    totalRows: state.filteredData.length,
  }
}

export function useDataTableRows<TData>() {
  useRenderKey() // re-render when store changes (table is mutable singleton)
  const table = useTableInstanceOrNull<TData>()
  if (!table) {
    return { rows: [] as Row<TData>[], headerGroups: [] as HeaderGroup<TData>[], totalColumns: 0 }
  }
  return {
    rows: table.getRowModel().rows,
    headerGroups: table.getHeaderGroups(),
    totalColumns: table.getAllColumns().length,
  }
}

export function useDataTableLoading() {
  return useSliceSelector(
    useCallback((state: DataTableStoreState<any>) => ({
      isLoading: state.isLoading,
      error: state.error,
      columnCount: state.columnCount,
    }), []),
  )
}

export function useDataTableInlineContents<TData>() {
  const store = useDataTableStore<TData>()
  return useSliceSelector<TData, {
    inlineContents: readonly InlineContentEntry<TData>[]
    registerInlineContent: (entry: InlineContentEntry<TData>) => void
    unregisterInlineContent: (id: string) => void
  }>(
    useCallback((state: DataTableStoreState<TData>) => ({
      inlineContents: state.inlineContents,
      registerInlineContent: store.registerInlineContent,
      unregisterInlineContent: store.unregisterInlineContent,
    }), [store]),
  )
}
