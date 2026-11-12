'use client'

import type { RowData } from '@tanstack/react-table'
import type { CreateStoreOptions, DataTableStore } from '../types'
import { useEffect, useRef, useState } from 'react'
import { createDataTableStore } from '../core/store'

/**
 * Creates the DataTable store once and keeps it in step with the props that
 * seeded it. Every DataTable entry point (both providers and both hooks) goes
 * through here, so a prop sync added for one applies to all of them.
 *
 * - The store lives in `useState`, which React never discards, so table state
 *   survives for the lifetime of the component.
 * - `data` is synced in client mode only. In server mode the fetch owns it.
 * - `pageSize` is synced in both modes; the store resets to the first page.
 *
 * Each sync compares against the last value it applied instead of skipping the
 * first effect run, so a StrictMode effect re-run does not write the seed
 * values back over state hydrated from a state adapter.
 */
export function useDataTableStoreInstance<TData extends RowData>(
  options: CreateStoreOptions<TData>,
): DataTableStore<TData> {
  const { data, mode, pageSize } = options

  // Lazy initializer: the options seed the store once, later renders ignore them.
  const [store] = useState(() => createDataTableStore<TData>(options))

  const syncedDataRef = useRef(data)
  useEffect(() => {
    if (mode !== 'client' || syncedDataRef.current === data)
      return
    syncedDataRef.current = data
    store.setData(data)
  }, [data, mode, store])

  const syncedPageSizeRef = useRef(pageSize)
  useEffect(() => {
    if (syncedPageSizeRef.current === pageSize)
      return
    syncedPageSizeRef.current = pageSize
    if (pageSize != null)
      store.setPageSize(pageSize)
  }, [pageSize, store])

  return store
}
