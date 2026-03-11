'use client'

import type { SortingState } from '@tanstack/react-table'
import type { DataTableState, FilterValue, StateAdapter } from '../types'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'
import { useMemo } from 'react'
import { DEFAULT_PAGE_SIZE } from '../constants'

// Nuqs parser type — using `unknown` as a generic stand-in
// since we don't want to tightly couple to nuqs internal types.
// Consumer passes actual nuqs parsers which are type-checked at their call site.
type NuqsParser = unknown

export interface UseNuqsAdapterOptions {
  /**
   * Custom filter parsers to sync to URL.
   * Each key becomes a query parameter.
   *
   * @example
   * ```tsx
   * import { parseAsString, parseAsArrayOf } from 'nuqs'
   *
   * useNuqsAdapter({
   *   filters: {
   *     status: parseAsString.withDefault(''),
   *     regions: parseAsArrayOf(parseAsString).withDefault([]),
   *   },
   * })
   * ```
   */
  readonly filters?: Record<string, NuqsParser>
}

/**
 * Serialize SortingState to URL-friendly string.
 * Format: "name" (asc), "-name" (desc), comma-separated for multi-sort.
 * Example: "-department,name" → [{id:"department",desc:true},{id:"name",desc:false}]
 */
function serializeSorting(sorting: SortingState): string {
  if (sorting.length === 0)
    return ''
  return sorting.map(s => s.desc ? `-${s.id}` : s.id).join(',')
}

/**
 * Parse URL sort string back to SortingState.
 */
function parseSorting(value: string): SortingState {
  if (!value)
    return []
  return value.split(',').filter(Boolean).map((part) => {
    if (part.startsWith('-')) {
      return { id: part.slice(1), desc: true }
    }
    return { id: part, desc: false }
  })
}

const coreSearchParams = {
  sort: parseAsString.withDefault(''),
  q: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(0),
  size: parseAsInteger.withDefault(DEFAULT_PAGE_SIZE),
}

/**
 * Hook that creates a StateAdapter backed by nuqs URL query state.
 *
 * URL format:
 * - `?sort=name` (asc) or `?sort=-name` (desc), comma-separated for multi-sort
 * - `?q=search` for search text
 * - `?page=0&size=20` for pagination
 * - Custom filter keys as declared in options
 *
 * Requires `nuqs` to be installed in the consumer app.
 *
 * @example
 * ```tsx
 * const stateAdapter = useNuqsAdapter({
 *   filters: {
 *     status: parseAsString.withDefault(''),
 *     department: parseAsArrayOf(parseAsString).withDefault([]),
 *   },
 * })
 * const tableState = useDataTableClient({ data, columns, stateAdapter })
 * ```
 */
export function useNuqsAdapter(
  options: UseNuqsAdapterOptions = {},
): StateAdapter {
  const { filters: filterParsers } = options

  const [coreState, setCoreState] = useQueryStates(coreSearchParams)

  const hasFilters = filterParsers != null && Object.keys(filterParsers).length > 0

  // Filters use a separate sentinel when empty to satisfy useQueryStates
  const resolvedFilterParsers = hasFilters
    ? filterParsers
    : { _dt: parseAsString.withDefault('') }
  const [filterState, setFilterState] = useQueryStates(resolvedFilterParsers as Parameters<typeof useQueryStates>[0])

  return useMemo<StateAdapter>(
    () => ({
      read: (): Partial<DataTableState> => ({
        sorting: parseSorting(coreState.sort),
        search: coreState.q,
        pageIndex: coreState.page,
        pageSize: coreState.size,
        ...(hasFilters ? { filters: filterState as FilterValue } : {}),
      }),
      write: (state: DataTableState): void => {
        setCoreState({
          sort: serializeSorting(state.sorting),
          q: state.search,
          page: state.pageIndex ?? 0,
          size: state.pageSize ?? DEFAULT_PAGE_SIZE,
        })
        if (hasFilters && filterParsers) {
          // Build a complete update: set all declared filter keys,
          // using null for any that aren't in the current state
          // so nuqs removes them from the URL.
          const update: Record<string, unknown> = {}
          for (const key of Object.keys(filterParsers)) {
            const value = (state.filters as Record<string, unknown>)?.[key]
            update[key] = value ?? null
          }
          setFilterState(update)
        }
      },
    }),
    [coreState, filterState, hasFilters, setCoreState, setFilterState, filterParsers],
  )
}
