'use client'

import type { ColumnDef, SortingState } from '@tanstack/react-table'
import type {
  DataTableStore,
  FilterValue,
  SelectionColumnOptions,
  StateAdapter,
} from '../types'
import {
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useEffect, useMemo, useRef, useSyncExternalStore } from 'react'
import { withSelectionColumn } from '../columns/selection-column'
import { createDataTableStore } from '../core/store'

export interface ServerFetchArgs {
  readonly sorting: SortingState
  readonly filters: FilterValue
  readonly search: string
  readonly cursor: string | undefined
  readonly limit: number
}

export interface ServerTransformResult<TData> {
  readonly data: TData[]
  readonly nextCursor?: string
  readonly hasNextPage: boolean
}

export interface UseDataTableServerOptions<TResponse, TData> {
  readonly columns: ColumnDef<TData, any>[]
  readonly fetchFn: (args: ServerFetchArgs) => Promise<TResponse>
  readonly transform: (response: TResponse) => ServerTransformResult<TData>
  readonly limit?: number
  readonly getRowId?: (row: TData) => string
  readonly enableRowSelection?: boolean | SelectionColumnOptions
  readonly defaultSort?: SortingState
  readonly defaultFilters?: FilterValue
  readonly stateAdapter?: StateAdapter
}

export function useDataTableServer<TResponse, TData>(
  options: UseDataTableServerOptions<TResponse, TData>,
) {
  const {
    columns,
    fetchFn,
    transform,
    limit = 20,
    getRowId,
    enableRowSelection = false,
    defaultSort,
    defaultFilters,
    stateAdapter,
  } = options

  // Stable refs for callbacks
  const fetchRef = useRef(fetchFn)
  const transformRef = useRef(transform)
  useEffect(() => {
    fetchRef.current = fetchFn
  }, [fetchFn])
  useEffect(() => {
    transformRef.current = transform
  }, [transform])

  // Cursor map: pageIndex → cursor string for that page
  // Page 0 has undefined cursor (start from beginning)
  const cursorMapRef = useRef<Map<number, string | undefined>>(new Map())

  // Track hasNextPage via ref to avoid extra state/render cycle
  const hasNextPageRef = useRef(false)

  // 1. Create store
  const store = useMemo<DataTableStore<TData>>(
    () => createDataTableStore<TData>({
      data: [] as TData[],
      mode: 'server',
      defaultSort,
      defaultFilters,
      pageSize: limit,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  // 2. Read store state
  const { sorting, filters, search, rowSelection, pageSize, pageIndex }
    = useSyncExternalStore(store.subscribe, store.getSnapshot)

  // 3. Fetch on query change — also resets cursors when query params change
  const prevQueryRef = useRef({ sorting, filters, search, pageSize })
  useEffect(() => {
    // Detect query param changes (vs page-only changes)
    const prev = prevQueryRef.current
    const queryChanged
      = prev.sorting !== sorting
        || prev.filters !== filters
        || prev.search !== search
        || prev.pageSize !== pageSize

    if (queryChanged) {
      cursorMapRef.current = new Map()
      hasNextPageRef.current = false
      // Reset to first page — the store update will re-trigger this effect
      // with pageIndex=0, which then performs the actual fetch
      if (pageIndex !== 0) {
        prevQueryRef.current = { sorting, filters, search, pageSize }
        store.setPageIndex(0)
        return
      }
    }
    prevQueryRef.current = { sorting, filters, search, pageSize }

    let cancelled = false
    store.setLoading(true)

    const cursor = cursorMapRef.current.get(pageIndex)

    fetchRef.current({
      sorting,
      filters,
      search,
      cursor,
      limit: pageSize,
    })
      .then((response) => {
        if (cancelled)
          return
        const result = transformRef.current(response)
        store.setServerData(result.data)
        store.setError(null)

        // Track cursor for the next page
        if (result.nextCursor) {
          cursorMapRef.current.set(pageIndex + 1, result.nextCursor)
        }
        hasNextPageRef.current = result.hasNextPage
      })
      .catch((error) => {
        if (cancelled)
          return
        store.setServerData([] as TData[])
        store.setError(error instanceof Error ? error : new Error(String(error)))
        hasNextPageRef.current = false
      })
      .finally(() => {
        if (!cancelled)
          store.setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [sorting, filters, search, pageSize, pageIndex, store])

  // 4. Resolve columns
  const resolvedColumns = useMemo(
    () => enableRowSelection
      ? withSelectionColumn(columns, typeof enableRowSelection === 'object' ? enableRowSelection : {})
      : columns,
    [columns, enableRowSelection],
  )

  // 5. Create TanStack table (display only — no sorting/filtering/pagination)
  const table = useReactTable({
    data: store.getSnapshot().data,
    columns: resolvedColumns,
    state: {
      sorting,
      rowSelection,
      pagination: { pageIndex, pageSize },
    },
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    // Tell TanStack about page capabilities so pagination component works
    pageCount: hasNextPageRef.current ? pageIndex + 2 : pageIndex + 1,
    getCoreRowModel: getCoreRowModel(),
    getRowId,
    enableRowSelection: !!enableRowSelection,
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater
      store.setSorting(next)
    },
    onRowSelectionChange: (updater) => {
      const next = typeof updater === 'function' ? updater(rowSelection) : updater
      store.setRowSelection(next)
    },
    onPaginationChange: (updater) => {
      const prev = { pageIndex, pageSize }
      const next = typeof updater === 'function' ? updater(prev) : updater
      store.setPagination(next.pageIndex, next.pageSize)
    },
  })

  // 7. State adapter sync
  useEffect(() => {
    if (stateAdapter) {
      stateAdapter.write({ sorting, filters, search, pageSize })
    }
  }, [sorting, filters, search, pageSize, stateAdapter])

  return { store, table }
}
