import type { RowData, RowSelectionState } from '@tanstack/react-table'
import type {
  CreateStoreOptions,
  DataTableStore,
  DataTableStoreState,
  FilterStrategy,
} from '../types'
import { DEFAULT_PAGE_SIZE } from '../constants'
import { applyFilters } from './filter-engine'

/**
 * Keep only the selection keys whose rows survive a data change.
 * Dropping vanished keys stops a deleted row's selection from
 * resurrecting if a row with the same id reappears later.
 */
function pruneSelection<TData extends RowData>(
  selection: RowSelectionState,
  rows: TData[],
  getRowId: (row: TData) => string,
): RowSelectionState {
  const surviving = new Set(rows.map(getRowId))
  const next: RowSelectionState = {}
  for (const [key, isSelected] of Object.entries(selection)) {
    if (isSelected && surviving.has(key))
      next[key] = true
  }
  return next
}

export function createDataTableStore<TData extends RowData>(
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
    columnCount: options.columnCount ?? 0,
    mode: options.mode,
    isLoading: options.isLoading ?? false,
    error: null,
    inlineContents: [],
    _version: 0,
  }

  // Apply default filters on init if any exist (pageIndex already 0)
  if (options.defaultFilters && Object.keys(options.defaultFilters).length > 0) {
    state = { ...state, filteredData: computeFilteredData(state) }
  }

  function notify() {
    for (const listener of listeners) listener()
  }

  function setState(next: DataTableStoreState<TData>) {
    state = { ...next, _version: state._version + 1 }
    notify()
  }

  const store: DataTableStore<TData> = {
    getSnapshot: () => state,
    subscribe: (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },

    setData: (data) => {
      const next = { ...state, data }
      const filteredData = computeFilteredData(next)

      // Clamp rather than reset: a background update must not move the
      // reader off their page. If the list shrank past their position,
      // land on the new last page — as close as the data allows.
      const pageCount = Math.max(1, Math.ceil(filteredData.length / state.pageSize))
      const pageIndex = Math.min(state.pageIndex, pageCount - 1)

      const rowSelection = options.getRowId
        ? pruneSelection(state.rowSelection, filteredData, options.getRowId)
        : {}

      setState({ ...next, filteredData, pageIndex, rowSelection })
    },

    setServerData: (data) => {
      setState({ ...state, data, filteredData: data })
    },

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
