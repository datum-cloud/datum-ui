'use client'

import type { ReactNode } from 'react'
import type { UseDataTableClientOptions } from '../hooks/use-data-table-client'
import { DataTableLoading } from '../components/loading'
import { useDataTableClient } from '../hooks/use-data-table-client'
import { useIsClient } from '../hooks/use-is-client'
import { DataTableRenderKeyContext, DataTableStoreContext, TableInstanceContext } from './data-table-context'

export type DataTableClientProviderProps<TData> = UseDataTableClientOptions<TData> & {
  readonly className?: string
  /** Rendered during SSR and first client paint. Defaults to a skeleton table. Set to `null` to render nothing. */
  readonly ssrFallback?: ReactNode | null
  readonly children: ReactNode
}

/**
 * Inner component that calls useDataTableClient.
 * Only rendered on the client (gated by ClientProvider).
 */
function ClientProviderInner<TData>({
  className,
  children,
  ssrFallback: _ssrFallback,
  ...options
}: DataTableClientProviderProps<TData>) {
  const { store, table } = useDataTableClient(options)
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

export function ClientProvider<TData>(props: DataTableClientProviderProps<TData>) {
  const isClient = useIsClient()

  if (!isClient) {
    const fallback = props.ssrFallback === undefined
      ? <DataTableLoading columns={props.columns.length} />
      : props.ssrFallback
    return <>{fallback}</>
  }

  return <ClientProviderInner {...props} />
}
