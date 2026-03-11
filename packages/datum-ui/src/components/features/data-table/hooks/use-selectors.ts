'use client'

import type { HeaderGroup, Row, RowSelectionState } from '@tanstack/react-table'
import type { DataTableStoreState, InlineContentEntry } from '../types'
import { useCallback, useRef, useSyncExternalStore } from 'react'
import { useDataTableStore, useTableInstance } from '../core/data-table-context'

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

  const serverCachedRef = useRef<TSlice | null>(null)
  const getServerSnapshot = useCallback(() => {
    const next = selector(store.getServerSnapshot())
    if (serverCachedRef.current && shallowEqual(serverCachedRef.current, next)) {
      return serverCachedRef.current
    }
    serverCachedRef.current = next
    return next
  }, [store, selector])

  return useSyncExternalStore(store.subscribe, getSnapshot, getServerSnapshot)
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
  const store = useDataTableStore<TData>()
  const table = useTableInstance<TData>()
  return useSliceSelector<TData, {
    rowSelection: RowSelectionState
    setRowSelection: (selection: RowSelectionState) => void
    selectedRows: TData[]
  }>(
    useCallback((state: DataTableStoreState<TData>) => ({
      rowSelection: state.rowSelection,
      setRowSelection: store.setRowSelection,
      selectedRows: table.getFilteredSelectedRowModel().rows.map(r => r.original),
    }), [store, table]),
  )
}

export function useDataTablePagination() {
  const store = useDataTableStore()
  const table = useTableInstance()

  // Stable function references — do not recreate on every snapshot call
  const nextPage = useCallback(() => table.nextPage(), [table])
  const prevPage = useCallback(() => table.previousPage(), [table])

  return useSliceSelector(
    useCallback((state: DataTableStoreState<any>) => ({
      canNextPage: table.getCanNextPage(),
      canPrevPage: table.getCanPreviousPage(),
      nextPage,
      prevPage,
      pageIndex: state.pageIndex,
      pageCount: table.getPageCount(),
      setPageIndex: store.setPageIndex,
      pageSize: state.pageSize,
      setPageSize: store.setPageSize,
      totalRows: state.filteredData.length,
    }), [store, table, nextPage, prevPage]),
  )
}

export function useDataTableRows<TData>() {
  const table = useTableInstance<TData>()
  return useSliceSelector<TData, {
    rows: Row<TData>[]
    headerGroups: HeaderGroup<TData>[]
    totalColumns: number
  }>(
    useCallback((_state: DataTableStoreState<TData>) => ({
      rows: table.getRowModel().rows,
      headerGroups: table.getHeaderGroups(),
      totalColumns: table.getAllColumns().length,
    }), [table]),
  )
}

export function useDataTableLoading() {
  return useSliceSelector(
    useCallback((state: DataTableStoreState<any>) => ({
      isLoading: state.isLoading,
      error: state.error,
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

// Deprecated facade — subscribes to entire snapshot (no re-render isolation)
export function useDataTableContext<TData>() {
  const store = useDataTableStore<TData>()
  const table = useTableInstance<TData>()
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot)
  return {
    table,
    mode: state.mode,
    sorting: state.sorting,
    filters: state.filters,
    search: state.search,
    rowSelection: state.rowSelection,
    isLoading: state.isLoading,
    setSorting: store.setSorting,
    setFilter: store.setFilter,
    clearFilter: store.clearFilter,
    clearAllFilters: store.clearAllFilters,
    setSearch: store.setSearch,
    clearSearch: store.clearSearch,
    setRowSelection: store.setRowSelection,
    pagination: {
      canNextPage: table.getCanNextPage(),
      canPrevPage: table.getCanPreviousPage(),
      nextPage: () => table.nextPage(),
      prevPage: () => table.previousPage(),
      pageIndex: state.pageIndex,
      pageCount: table.getPageCount(),
      setPageIndex: store.setPageIndex,
      pageSize: state.pageSize,
      setPageSize: store.setPageSize,
    },
    inlineContents: state.inlineContents,
    registerInlineContent: store.registerInlineContent,
    unregisterInlineContent: store.unregisterInlineContent,
  }
}
