import type { FilterFn, FilterStrategy } from '../types'

/**
 * Resolve a dot-path on an object (e.g. "status.registrationApproval").
 * Falls back to a flat key lookup when the path has no dots.
 */
export function resolvePath(obj: unknown, path: string): unknown {
  if (obj == null)
    return undefined
  const record = obj as Record<string, unknown>
  // Fast path: no dot → flat lookup (most common case)
  if (!path.includes('.'))
    return record[path]
  return path.split('.').reduce<unknown>(
    (acc, key) => (acc != null ? (acc as Record<string, unknown>)[key] : undefined),
    record,
  )
}

interface FilterStrategies {
  'checkbox': FilterFn
  'select': FilterFn
  'date-gte': FilterFn
  'date-lte': FilterFn
  [key: string]: FilterFn
}

export const FILTER_STRATEGIES: FilterStrategies = {
  'checkbox': (cellValue, filterValue) => {
    if (filterValue == null)
      return true
    if (Array.isArray(filterValue) && filterValue.length === 0)
      return true
    if (!Array.isArray(filterValue))
      return cellValue === filterValue
    if (Array.isArray(cellValue))
      return cellValue.some(v => filterValue.includes(v))
    return filterValue.includes(cellValue)
  },

  'select': (cellValue, filterValue) => {
    if (filterValue == null || filterValue === '')
      return true
    return cellValue === filterValue
  },

  'date-gte': (cellValue, filterValue) => {
    if (!filterValue)
      return true
    const cell = new Date(cellValue as string)
    const filter = new Date(filterValue as string)
    if (Number.isNaN(cell.getTime()) || Number.isNaN(filter.getTime()))
      return true
    return cell >= filter
  },

  'date-lte': (cellValue, filterValue) => {
    if (!filterValue)
      return true
    const cell = new Date(cellValue as string)
    const filter = new Date(filterValue as string)
    if (Number.isNaN(cell.getTime()) || Number.isNaN(filter.getTime()))
      return true
    return cell <= filter
  },
}

function resolveStrategy(strategy: FilterStrategy | undefined): FilterFn | undefined {
  if (!strategy)
    return undefined
  if (typeof strategy === 'function')
    return strategy
  return FILTER_STRATEGIES[strategy]
}

export interface SearchConfig<TData> {
  searchFn?: (row: TData, query: string) => boolean
  searchableColumns?: string[]
}

/** True when a row matches a free-text query (custom fn → columns → all values). */
export function rowMatchesSearch<TData>(
  row: TData,
  search: string,
  config: SearchConfig<TData>,
): boolean {
  if (!search || search.length === 0)
    return true
  if (config.searchFn)
    return config.searchFn(row, search)

  const query = search.toLowerCase()
  if (config.searchableColumns && config.searchableColumns.length > 0) {
    return config.searchableColumns.some((col) => {
      const cellValue = resolvePath(row, col)
      return cellValue != null && String(cellValue).toLowerCase().includes(query)
    })
  }
  return Object.values(row as Record<string, unknown>).some(
    val => val != null && String(val).toLowerCase().includes(query),
  )
}

export function applyFilters<TData>(
  data: TData[],
  filters: Record<string, unknown>,
  search: string,
  registeredFilters: Map<string, FilterStrategy>,
  customFilterFns: Record<string, FilterFn>,
  searchConfig: SearchConfig<TData>,
): TData[] {
  const hasFilters = Object.keys(filters).length > 0
  const hasSearch = search.length > 0

  if (!hasFilters && !hasSearch)
    return data

  return data.filter((row) => {
    if (hasFilters) {
      for (const [column, value] of Object.entries(filters)) {
        const fn = customFilterFns[column] ?? resolveStrategy(registeredFilters.get(column))
        if (!fn) {
          console.warn(`[DataTable] No filter strategy registered for column "${column}". Filter ignored.`)
          continue
        }
        const cellValue = resolvePath(row, column)
        if (!fn(cellValue, value))
          return false
      }
    }

    if (hasSearch && !rowMatchesSearch(row, search, searchConfig))
      return false

    return true
  })
}
