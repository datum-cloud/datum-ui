'use client'

import type { Table } from '@tanstack/react-table'
import type { DataTableContextValue, DataTableStore } from '../types'
import { createContext, use, useContext } from 'react' // eslint-disable-line react/no-use-context -- useContext needed: use() breaks context subscriptions after SSR hydration

export const DataTableStoreContext = createContext<DataTableStore<any> | null>(null)
export const TableInstanceContext = createContext<Table<any> | null>(null)

/**
 * Monotonic counter that increments on every store mutation.
 * Table-dependent hooks consume this context to force re-renders
 * through React's {children} composition boundary, since the
 * mutable table singleton (stable ref) cannot trigger context updates.
 */
export const DataTableRenderKeyContext = createContext<number>(0)

/**
 * Forces a re-render when the store changes. Used by table-dependent hooks.
 * Uses useContext (not use()) because use() does not reliably register
 * context subscriptions in SSR/hydration scenarios (React Router SSR),
 * preventing re-renders when the context value changes.
 */
export function useRenderKey(): number {
  // eslint-disable-next-line react/no-use-context -- use() does not register context subscriptions after SSR hydration
  return useContext(DataTableRenderKeyContext)
}

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
