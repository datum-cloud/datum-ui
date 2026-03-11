import type { FilterStrategy } from '../types'

type FilterFn = (cellValue: unknown, filterValue: unknown) => boolean

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

export function applyFilters<TData>(
  data: TData[],
  filters: Record<string, unknown>,
  search: string,
  registeredFilters: Map<string, FilterStrategy>,
  customFilterFns: Record<string, FilterFn>,
  searchConfig: {
    searchFn?: (row: TData, query: string) => boolean
    searchableColumns?: string[]
  },
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
        const cellValue = (row as Record<string, unknown>)[column]
        if (!fn(cellValue, value))
          return false
      }
    }

    if (hasSearch) {
      const query = search.toLowerCase()
      if (searchConfig.searchFn) {
        return searchConfig.searchFn(row, search)
      }
      if (searchConfig.searchableColumns && searchConfig.searchableColumns.length > 0) {
        return searchConfig.searchableColumns.some((col) => {
          const cellValue = (row as Record<string, unknown>)[col]
          return cellValue != null && String(cellValue).toLowerCase().includes(query)
        })
      }
      // Fallback: search all string/number values on the row
      return Object.values(row as Record<string, unknown>).some((val) => {
        if (val == null)
          return false
        return String(val).toLowerCase().includes(query)
      })
    }

    return true
  })
}
