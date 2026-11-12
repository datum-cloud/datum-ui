'use client'

import type { ReactTable, RowData } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import type { UseClientTableOptions } from '../hooks/use-data-table-client'
import type { DataTableStore, UseDataTableClientOptions } from '../types'
import type { DataTableFeatures } from './features'
import { useEffect, useState } from 'react'
import { useClientTable } from '../hooks/use-data-table-client'
import { useDataTableStoreInstance } from '../hooks/use-data-table-store-instance'
import { DataTableRenderKeyContext, DataTableStoreContext, TableInstanceContext } from './data-table-context'

export type DataTableClientProviderProps<TData extends RowData> = UseDataTableClientOptions<TData> & {
  readonly loading?: boolean
  readonly className?: string
  readonly children: ReactNode
}

/**
 * Inner component that calls useClientTable.
 * Only rendered after hydration (gated by tableReady).
 */
function ClientProviderInner<TData extends RowData>({
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
    <TableInstanceContext value={table as ReactTable<DataTableFeatures, any>}>
      <DataTableRenderKeyContext value={store.getSnapshot()._version}>
        <div className={className}>{children}</div>
      </DataTableRenderKeyContext>
    </TableInstanceContext>
  )
}

export function ClientProvider<TData extends RowData>(props: DataTableClientProviderProps<TData>) {
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

  // Store created immediately — works during SSR. The shared hook also syncs
  // later `data` and `pageSize` prop changes into it.
  const store = useDataTableStoreInstance<TData>({
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
    getRowId,
  })

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
