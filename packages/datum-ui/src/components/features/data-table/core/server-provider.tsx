'use client'

import type { ReactTable, RowData } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import type { UseServerTableOptions } from '../hooks/use-data-table-server'
import type { DataTableStore, UseDataTableServerOptions } from '../types'
import type { DataTableFeatures } from './features'
import { useEffect, useState } from 'react'
import { useServerTable } from '../hooks/use-data-table-server'
import { useDataTableStoreInstance } from '../hooks/use-data-table-store-instance'
import { DataTableRenderKeyContext, DataTableStoreContext, TableInstanceContext } from './data-table-context'

export type DataTableServerProviderProps<TResponse, TData extends RowData> = UseDataTableServerOptions<TResponse, TData> & {
  readonly className?: string
  readonly children: ReactNode
}

/**
 * Inner component that calls useServerTable.
 * Only rendered after hydration (gated by tableReady).
 */
function ServerProviderInner<TResponse, TData extends RowData>({
  store,
  className,
  children,
  ...options
}: UseServerTableOptions<TResponse, TData> & {
  readonly store: DataTableStore<TData>
  readonly className?: string
  readonly children: ReactNode
}) {
  const { table } = useServerTable(store, options)

  return (
    <TableInstanceContext value={table as ReactTable<DataTableFeatures, any>}>
      <DataTableRenderKeyContext value={store.getSnapshot()._version}>
        <div className={className}>{children}</div>
      </DataTableRenderKeyContext>
    </TableInstanceContext>
  )
}

export function ServerProvider<TResponse, TData extends RowData>(props: DataTableServerProviderProps<TResponse, TData>) {
  const {
    columns,
    fetchFn,
    transform,
    limit = 20,
    getRowId,
    enableRowSelection,
    defaultSort,
    defaultFilters,
    stateAdapter,
    className,
    children,
  } = props

  // Store created immediately — works during SSR. The shared hook also syncs
  // later `limit` prop changes into the store's page size.
  const store = useDataTableStoreInstance<TData>({
    data: [],
    mode: 'server',
    isLoading: true,
    defaultSort,
    defaultFilters,
    pageSize: limit,
    columnCount: columns.length,
  })

  // Table instance — null during SSR, created after hydration
  const [tableReady, setTableReady] = useState(false)
  // eslint-disable-next-line react/set-state-in-effect -- intentional: triggers re-render to detect client
  useEffect(() => setTableReady(true), [])

  return (
    <DataTableStoreContext value={store}>
      {tableReady
        ? (
            <ServerProviderInner
              store={store}
              columns={columns}
              fetchFn={fetchFn}
              transform={transform}
              limit={limit}
              getRowId={getRowId}
              enableRowSelection={enableRowSelection}
              stateAdapter={stateAdapter}
              className={className}
            >
              {children}
            </ServerProviderInner>
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
