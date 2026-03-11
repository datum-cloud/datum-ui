import type { Table } from '@tanstack/react-table'
import type {
  CreateStoreOptions,
  DataTableStore,
  DataTableStoreState,
  FilterStrategy,
} from '../types'
import { DEFAULT_PAGE_SIZE } from '../constants'
import { applyFilters } from './filter-engine'

export function createDataTableStore<TData>(
  options: CreateStoreOptions<TData>,
): DataTableStore<TData> {
  let registeredFilters = new Map<string, FilterStrategy>()
  const listeners = new Set<() => void>()

  function computeFilteredData(s: DataTableStoreState<TData>): TData[] {
    if (s.mode === 'server')
      return s.data
    return applyFilters(
      s.data,
      s.filters,
      s.search,
      registeredFilters,
      options.filterFns ?? {},
      {
        searchFn: options.searchFn,
        searchableColumns: options.searchableColumns,
      },
    )
  }

  let state: DataTableStoreState<TData> = {
    data: options.data,
    filteredData: options.data,
    sorting: options.defaultSort ?? [],
    filters: options.defaultFilters ?? {},
    search: '',
    rowSelection: {},
    pageIndex: 0,
    pageSize: options.pageSize ?? DEFAULT_PAGE_SIZE,
    mode: options.mode,
    isLoading: false,
    error: null,
    inlineContents: [],
  }

  // Apply default filters on init if any exist (pageIndex already 0)
  if (options.defaultFilters && Object.keys(options.defaultFilters).length > 0) {
    state = { ...state, filteredData: computeFilteredData(state) }
  }

  // Capture initial state for SSR — frozen, never changes
  const serverSnapshot = state

  function notify() {
    for (const listener of listeners) listener()
  }

  function setState(next: DataTableStoreState<TData>) {
    state = next
    notify()
  }

  const store: DataTableStore<TData> = {
    getSnapshot: () => state,
    getServerSnapshot: () => serverSnapshot,
    subscribe: (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },

    setData: (data) => {
      const next = { ...state, data, pageIndex: 0, rowSelection: {} }
      setState({ ...next, filteredData: computeFilteredData(next) })
    },

    setServerData: (data) => {
      setState({ ...state, data, filteredData: data })
    },

    // Table instance stored for future use by selector hooks (Task 3)
    setTable: (_t: Table<TData>) => { /* retained for provider wiring */ },

    setSorting: (sorting) => {
      setState({ ...state, sorting, rowSelection: {} })
    },

    setFilter: (key, value) => {
      const next = { ...state, filters: { ...state.filters, [key]: value }, rowSelection: {}, pageIndex: 0 }
      setState({ ...next, filteredData: computeFilteredData(next) })
    },

    clearFilter: (key) => {
      const filters = Object.fromEntries(
        Object.entries(state.filters).filter(([k]) => k !== key),
      )
      const next = { ...state, filters, rowSelection: {}, pageIndex: 0 }
      setState({ ...next, filteredData: computeFilteredData(next) })
    },

    clearAllFilters: () => {
      const next = { ...state, filters: {}, rowSelection: {}, pageIndex: 0 }
      setState({ ...next, filteredData: computeFilteredData(next) })
    },

    setSearch: (search) => {
      const next = { ...state, search, rowSelection: {}, pageIndex: 0 }
      setState({ ...next, filteredData: computeFilteredData(next) })
    },

    clearSearch: () => {
      const next = { ...state, search: '', rowSelection: {}, pageIndex: 0 }
      setState({ ...next, filteredData: computeFilteredData(next) })
    },

    setRowSelection: (rowSelection) => {
      setState({ ...state, rowSelection })
    },

    setPageIndex: (pageIndex) => {
      if (!Number.isFinite(pageIndex) || pageIndex < 0)
        return
      setState({ ...state, pageIndex: Math.floor(pageIndex), rowSelection: {} })
    },

    setPageSize: (pageSize) => {
      if (!Number.isFinite(pageSize) || pageSize < 1)
        return
      setState({ ...state, pageSize: Math.floor(pageSize), pageIndex: 0, rowSelection: {} })
    },

    setPagination: (pageIndex, pageSize) => {
      const safeIndex = Number.isFinite(pageIndex) ? Math.max(0, Math.floor(pageIndex)) : state.pageIndex
      const safeSize = Number.isFinite(pageSize) ? Math.max(1, Math.floor(pageSize)) : state.pageSize
      setState({ ...state, pageIndex: safeIndex, pageSize: safeSize, rowSelection: {} })
    },

    setLoading: (isLoading) => {
      setState({ ...state, isLoading })
    },

    setError: (error) => {
      setState({ ...state, error })
    },

    registerFilter: (column, strategy) => {
      const next = new Map(registeredFilters)
      next.set(column, strategy)
      registeredFilters = next
      const filteredData = computeFilteredData(state)
      setState({ ...state, filteredData })
    },

    unregisterFilter: (column) => {
      const next = new Map(registeredFilters)
      next.delete(column)
      registeredFilters = next
      if (column in state.filters) {
        const filteredData = computeFilteredData(state)
        setState({ ...state, filteredData })
      }
    },

    registerInlineContent: (entry) => {
      const existing = state.inlineContents.findIndex(e => e.id === entry.id)
      const inlineContents = existing >= 0
        ? state.inlineContents.map((e, i) => i === existing ? entry : e)
        : [...state.inlineContents, entry]
      setState({ ...state, inlineContents })
    },

    unregisterInlineContent: (id) => {
      const inlineContents = state.inlineContents.filter(e => e.id !== id)
      setState({ ...state, inlineContents })
    },
  }

  return store
}
