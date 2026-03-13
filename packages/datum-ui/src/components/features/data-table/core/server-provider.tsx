'use client'

import type { ReactNode } from 'react'
import type { UseServerTableOptions } from '../hooks/use-data-table-server'
import type { DataTableStore, UseDataTableServerOptions } from '../types'
import { useEffect, useMemo, useState } from 'react'
import { useServerTable } from '../hooks/use-data-table-server'
import { DataTableRenderKeyContext, DataTableStoreContext, TableInstanceContext } from './data-table-context'
import { createDataTableStore } from './store'

export type DataTableServerProviderProps<TResponse, TData> = UseDataTableServerOptions<TResponse, TData> & {
  readonly className?: string
  readonly children: ReactNode
}

/**
 * Inner component that calls useServerTable.
 * Only rendered after hydration (gated by tableReady).
 */
function ServerProviderInner<TResponse, TData>({
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
    <TableInstanceContext value={table}>
      <DataTableRenderKeyContext value={store.getSnapshot()._version}>
        <div className={className}>{children}</div>
      </DataTableRenderKeyContext>
    </TableInstanceContext>
  )
}

export function ServerProvider<TResponse, TData>(props: DataTableServerProviderProps<TResponse, TData>) {
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

  // Store created immediately — works during SSR
  const store = useMemo<DataTableStore<TData>>(
    () => createDataTableStore<TData>({
      data: [] as TData[],
      mode: 'server',
      isLoading: true,
      defaultSort,
      defaultFilters,
      pageSize: limit,
      columnCount: columns.length,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [], // intentionally empty — store created once
  )

  // Table instance — null during SSR, created after hydration
  const [tableReady, setTableReady] = useState(false)
  // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect -- intentional: triggers re-render to detect client
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
