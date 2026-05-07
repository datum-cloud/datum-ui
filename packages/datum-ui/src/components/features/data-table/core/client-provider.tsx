'use client'

import type { ReactNode } from 'react'
import type { UseClientTableOptions } from '../hooks/use-data-table-client'
import type { CreateStoreOptions, DataTableStore, UseDataTableClientOptions } from '../types'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useClientTable } from '../hooks/use-data-table-client'
import { DataTableRenderKeyContext, DataTableStoreContext, TableInstanceContext } from './data-table-context'
import { createDataTableStore } from './store'

export type DataTableClientProviderProps<TData> = UseDataTableClientOptions<TData> & {
  readonly loading?: boolean
  readonly className?: string
  readonly children: ReactNode
}

/**
 * Inner component that calls useClientTable.
 * Only rendered after hydration (gated by tableReady).
 */
function ClientProviderInner<TData>({
  store,
  className,
  children,
  ...options
}: UseClientTableOptions<TData> & {
  readonly store: DataTableStore<TData>
  readonly className?: string
  readonly children: ReactNode
}) {
  const { table } = useClientTable(store, options)

  return (
    <TableInstanceContext value={table}>
      <DataTableRenderKeyContext value={store.getSnapshot()._version}>
        <div className={className}>{children}</div>
      </DataTableRenderKeyContext>
    </TableInstanceContext>
  )
}

export function ClientProvider<TData>(props: DataTableClientProviderProps<TData>) {
  const {
    data,
    columns,
    loading,
    pageSize,
    getRowId,
    enableRowSelection,
    defaultSort,
    defaultFilters,
    searchableColumns,
    searchFn,
    filterFns,
    stateAdapter,
    className,
    children,
  } = props

  // Store created immediately — works during SSR
  const store = useMemo<DataTableStore<TData>>(
    () => createDataTableStore<TData>({
      data,
      mode: 'client',
      isLoading: true,
      defaultSort,
      defaultFilters,
      pageSize,
      columnCount: columns.length,
      searchableColumns,
      searchFn,
      filterFns,
    } as CreateStoreOptions<TData>),
    // eslint-disable-next-line react/exhaustive-deps
    [], // intentionally empty — store created once
  )

  // Sync data changes into store (skip initial render — store already has it)
  const isInitialRender = useRef(true)
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false
      return
    }
    store.setData(data)
  }, [data, store])

  // Sync pageSize prop changes — store was seeded with the initial value via
  // useMemo([]), but later prop updates (e.g. Storybook control changes,
  // parent-controlled paging) were silently dropped. Skip the initial render
  // because the store already has it.
  const isPageSizeInitial = useRef(true)
  useEffect(() => {
    if (isPageSizeInitial.current) {
      isPageSizeInitial.current = false
      return
    }
    if (pageSize != null)
      store.setPageSize(pageSize)
  }, [pageSize, store])

  // Table instance — null during SSR, created after hydration
  const [tableReady, setTableReady] = useState(false)
  // eslint-disable-next-line react/set-state-in-effect -- intentional: triggers re-render to detect client
  useEffect(() => setTableReady(true), [])

  // Sync consumer loading prop into store — gated by tableReady so it fires
  // AFTER child effects (data sync), preventing empty-message flash
  useEffect(() => {
    if (!tableReady)
      return
    store.setLoading(loading ?? false)
  }, [loading, tableReady, store])

  return (
    <DataTableStoreContext value={store}>
      {tableReady
        ? (
            <ClientProviderInner
              store={store}
              columns={columns}
              getRowId={getRowId}
              enableRowSelection={enableRowSelection}
              stateAdapter={stateAdapter}
              className={className}
            >
              {children}
            </ClientProviderInner>
          )
        : (
            <TableInstanceContext value={null}>
              <DataTableRenderKeyContext value={0}>
                <div className={className}>{children}</div>
              </DataTableRenderKeyContext>
            </TableInstanceContext>
          )}
    </DataTableStoreContext>
  )
}
