'use client'

import type { ReactNode } from 'react'
import type { UseDataTableServerOptions } from '../hooks/use-data-table-server'
import { useDataTableServer } from '../hooks/use-data-table-server'
import { useIsClient } from '../hooks/use-is-client'
import { DataTableRenderKeyContext, DataTableStoreContext, TableInstanceContext } from './data-table-context'

export type DataTableServerProviderProps<TResponse, TData> = UseDataTableServerOptions<TResponse, TData> & {
  readonly className?: string
  /** Rendered during SSR and first client paint. Provide a skeleton matching the table dimensions to avoid layout shift. */
  readonly ssrFallback?: ReactNode
  readonly children: ReactNode
}

/**
 * Inner component that calls useDataTableServer.
 * Only rendered on the client (gated by ServerProvider).
 */
function ServerProviderInner<TResponse, TData>({
  className,
  children,
  ssrFallback: _ssrFallback,
  ...options
}: DataTableServerProviderProps<TResponse, TData>) {
  const { store, table } = useDataTableServer(options)
  return (
    <DataTableStoreContext value={store}>
      <TableInstanceContext value={table}>
        <DataTableRenderKeyContext value={store.getSnapshot()._version}>
          <div className={className}>{children}</div>
        </DataTableRenderKeyContext>
      </TableInstanceContext>
    </DataTableStoreContext>
  )
}

export function ServerProvider<TResponse, TData>(props: DataTableServerProviderProps<TResponse, TData>) {
  const isClient = useIsClient()

  if (!isClient) {
    return <>{props.ssrFallback ?? null}</>
  }

  return <ServerProviderInner {...props} />
}
