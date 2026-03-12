'use client'

import type {
  CreateStoreOptions,
  DataTableStore,
  UseDataTableClientOptions,
} from '../types'
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useEffect, useMemo, useRef, useSyncExternalStore } from 'react'
import { withSelectionColumn } from '../columns/selection-column'
import { createDataTableStore } from '../core/store'

export type { UseDataTableClientOptions }

export function useDataTableClient<TData>(options: UseDataTableClientOptions<TData>) {
  const {
    data,
    columns,
    pageSize,
    getRowId,
    enableRowSelection = false,
    defaultSort,
    defaultFilters,
    searchableColumns,
    searchFn,
    filterFns,
    stateAdapter,
  } = options

  // 1. Create store (once)
  const store = useMemo<DataTableStore<TData>>(
    () => createDataTableStore<TData>({
      data,
      mode: 'client',
      defaultSort,
      defaultFilters,
      pageSize,
      searchableColumns,
      searchFn,
      filterFns,
    } as CreateStoreOptions<TData>),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [], // intentionally empty — store created once
  )

  // 2. Sync data changes into store (skip initial render — store already has it)
  const isInitialRender = useRef(true)
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false
      return
    }
    store.setData(data)
  }, [data, store])

  // 3. Resolve columns (auto-inject selection column)
  const resolvedColumns = useMemo(
    () => enableRowSelection
      ? withSelectionColumn(columns, typeof enableRowSelection === 'object' ? enableRowSelection : {})
      : columns,
    [columns, enableRowSelection],
  )

  // 4. Read store state for TanStack table
  const { filteredData, sorting, rowSelection, pageIndex, pageSize: storePageSize, filters, search }
    = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)

  // 5. Create TanStack table (sort + paginate only, no filtering)
  const table = useReactTable({
    data: filteredData,
    columns: resolvedColumns,
    state: {
      sorting,
      rowSelection,
      pagination: { pageIndex, pageSize: storePageSize },
    },
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater
      store.setSorting(next)
    },
    onRowSelectionChange: (updater) => {
      const next = typeof updater === 'function' ? updater(rowSelection) : updater
      store.setRowSelection(next)
    },
    onPaginationChange: (updater) => {
      const prev = { pageIndex, pageSize: storePageSize }
      const next = typeof updater === 'function' ? updater(prev) : updater
      store.setPagination(next.pageIndex, next.pageSize)
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId,
    enableRowSelection: !!enableRowSelection,
  })

  // 6. Hydrate from adapter on mount (must run before write effect)
  const hydratedRef = useRef(false)
  useEffect(() => {
    if (stateAdapter && !hydratedRef.current) {
      hydratedRef.current = true
      const persisted = stateAdapter.read()
      if (persisted.sorting && persisted.sorting.length > 0)
        store.setSorting(persisted.sorting)
      if (persisted.filters) {
        for (const [key, value] of Object.entries(persisted.filters)) {
          if (value != null)
            store.setFilter(key, value)
        }
      }
      if (persisted.search)
        store.setSearch(persisted.search)
      if (persisted.pageIndex != null && persisted.pageIndex > 0)
        store.setPageIndex(persisted.pageIndex)
      if (persisted.pageSize != null)
        store.setPageSize(persisted.pageSize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // mount only

  // 7. State adapter sync (skip first render to avoid overwriting hydrated state)
  const isFirstWrite = useRef(true)
  useEffect(() => {
    if (!stateAdapter)
      return
    if (isFirstWrite.current) {
      isFirstWrite.current = false
      return
    }
    stateAdapter.write({ sorting, filters, search, pageIndex, pageSize: storePageSize })
  }, [sorting, filters, search, pageIndex, storePageSize, stateAdapter])

  return { store, table }
}
