'use client'

import type { Table } from '@tanstack/react-table'
import type { DataTableContextValue, DataTableStore } from '../types'
import { createContext, use } from 'react'

export const DataTableStoreContext = createContext<DataTableStore<any> | null>(null)
export const TableInstanceContext = createContext<Table<any> | null>(null)

// Legacy context — retained for backward compat until providers are migrated (Task 4)
export const DataTableContext = createContext<DataTableContextValue<any> | null>(null)

/** @deprecated Use selector hooks from hooks/use-selectors instead */
export function useDataTableContext<TData>(): DataTableContextValue<TData> {
  const context = use(DataTableContext)
  if (!context) {
    throw new Error('useDataTableContext must be used within a DataTable provider')
  }
  return context as DataTableContextValue<TData>
}

export function useDataTableStore<TData>(): DataTableStore<TData> {
  const store = use(DataTableStoreContext)
  if (!store) {
    throw new Error('useDataTableStore must be used within a <DataTable.Client> or <DataTable.Server> provider')
  }
  return store as DataTableStore<TData>
}

export function useTableInstance<TData>(): Table<TData> {
  const table = use(TableInstanceContext)
  if (!table) {
    throw new Error('useTableInstance must be used within a <DataTable.Client> or <DataTable.Server> provider')
  }
  return table as Table<TData>
}
