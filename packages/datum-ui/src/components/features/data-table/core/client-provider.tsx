'use client'

import type { Table } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import type { DataTableStore } from '../types'
import { DataTableStoreContext, TableInstanceContext } from './data-table-context'

export interface DataTableClientProviderProps<TData> {
  readonly store: DataTableStore<TData>
  readonly table: Table<TData>
  readonly className?: string
  readonly children: ReactNode
}

export function ClientProvider<TData>({
  store,
  table,
  className,
  children,
}: DataTableClientProviderProps<TData>) {
  return (
    <DataTableStoreContext value={store}>
      <TableInstanceContext value={table}>
        <div className={className}>{children}</div>
      </TableInstanceContext>
    </DataTableStoreContext>
  )
}
