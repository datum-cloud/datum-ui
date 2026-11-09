'use client'

import type { LogFilters, LogTimeRange } from '../types'
import type { LogsUrlState, LogsUrlStateOptions } from '../utils/url-state'
import { useCallback, useMemo, useSyncExternalStore } from 'react'
import { logsUrlStateKey, parseLogsUrlState, writeLogsUrlState } from '../utils/url-state'

type SearchParamsUpdate = (prev: URLSearchParams) => URLSearchParams

/**
 * Updates the query string. Shaped like React Router's `setSearchParams`, so
 * `useSearchParams()` from `react-router` plugs straight in.
 */
export type SetLogsSearchParams = (update: SearchParamsUpdate, options?: { replace?: boolean }) => void

export interface UseLogsUrlStateOptions extends LogsUrlStateOptions {
  /**
   * Current query string, from the app's router. Pass it together with
   * `setSearchParams` whenever the app has a client router that owns the URL
   * (React Router, TanStack Router): writing `window.history` behind its back
   * leaves the router's location stale, and its next navigation can drop these
   * params. Leave both out only for plain pages or Next.js App Router, which
   * follows History API calls itself.
   */
  searchParams?: URLSearchParams
  setSearchParams?: SetLogsSearchParams
  /**
   * `replace` (default) rewrites the current history entry, so the back button
   * leaves the page instead of stepping through every filter click. `push`
   * adds an entry per change.
   */
  history?: 'replace' | 'push'
}

/** Values and change handlers to spread onto `Logs.Root`. */
export interface LogsUrlStateProps extends LogsUrlState {
  onTimeRangeChange: (range: LogTimeRange) => void
  onFiltersChange: (filters: LogFilters) => void
  onSearchChange: (search: string) => void
  onLiveChange: (live: boolean) => void
  onSelectedIdChange: (id: string | null) => void
}

// --- window.history adapter -------------------------------------------------

/** pushState/replaceState don't fire `popstate`, so writes announce themselves. */
const LOCATION_CHANGE_EVENT = 'datum-ui:logs-url-change'

function subscribeToLocation(onChange: () => void) {
  window.addEventListener('popstate', onChange)
  window.addEventListener(LOCATION_CHANGE_EVENT, onChange)
  return () => {
    window.removeEventListener('popstate', onChange)
    window.removeEventListener(LOCATION_CHANGE_EVENT, onChange)
  }
}

const getLocationSearch = () => window.location.search
const getServerSearch = () => ''

const setWindowSearchParams: SetLogsSearchParams = (update, options) => {
  const next = update(new URLSearchParams(window.location.search)).toString()
  const url = `${window.location.pathname}${next ? `?${next}` : ''}${window.location.hash}`
  if (options?.replace === false)
    window.history.pushState(window.history.state, '', url)
  else
    window.history.replaceState(window.history.state, '', url)
  window.dispatchEvent(new Event(LOCATION_CHANGE_EVENT))
}

// --- hook --------------------------------------------------------------------

/**
 * Keep `Logs.Root`'s time range, filters, search, live toggle and open row in
 * the address bar, so a refresh or a shared link reopens the same view.
 *
 * ```tsx
 * const logsState = useLogsUrlState()
 * const query = buildLogQL({ matchers: logsState.filters, lineContains: logsState.search })
 * // fetch with query + resolveLogTimeRange(logsState.timeRange)
 *
 * <Logs.Root {...logsState} entries={entries} onRefresh={refetch}>
 *   <Logs.Explorer />
 * </Logs.Root>
 * ```
 *
 * With React Router, hand it the router's search params instead:
 *
 * ```tsx
 * const [searchParams, setSearchParams] = useSearchParams()
 * const logsState = useLogsUrlState({ searchParams, setSearchParams })
 * ```
 */
export function useLogsUrlState(options: UseLogsUrlStateOptions = {}): LogsUrlStateProps {
  const { searchParams, setSearchParams, prefix = '', defaultTimeRange, history = 'replace' } = options

  const locationSearch = useSyncExternalStore(
    subscribeToLocation,
    getLocationSearch,
    getServerSearch,
  )
  const write = setSearchParams ?? setWindowSearchParams
  const replace = history !== 'push'

  // Hosts often pass `defaultTimeRange` inline, so depend on its fields rather
  // than its identity.
  const hasDefault = defaultTimeRange !== undefined
  const defaultFrom = defaultTimeRange?.from
  const defaultTo = defaultTimeRange?.to
  const defaultPreset = defaultTimeRange?.preset
  const urlOptions = useMemo<LogsUrlStateOptions>(() => ({
    prefix,
    defaultTimeRange: hasDefault
      ? { from: defaultFrom ?? '', to: defaultTo ?? '', preset: defaultPreset }
      : undefined,
  }), [prefix, hasDefault, defaultFrom, defaultTo, defaultPreset])

  // Parse only this explorer's params. A preset range is resolved to "now"
  // while parsing, so re-parsing when an unrelated param changes would hand
  // the host a new timeRange and trigger a refetch.
  const ownQuery = logsUrlStateKey(searchParams ?? locationSearch, { prefix })
  const state = useMemo(
    () => parseLogsUrlState(ownQuery, urlOptions),
    [ownQuery, urlOptions],
  )

  const update = useCallback((patch: Partial<LogsUrlState>) => {
    write(prev => writeLogsUrlState(prev, patch, urlOptions), { replace })
  }, [write, urlOptions, replace])

  const onTimeRangeChange = useCallback((timeRange: LogTimeRange) => update({ timeRange }), [update])
  const onFiltersChange = useCallback((filters: LogFilters) => update({ filters }), [update])
  const onSearchChange = useCallback((search: string) => update({ search }), [update])
  const onLiveChange = useCallback((live: boolean) => update({ live }), [update])
  const onSelectedIdChange = useCallback((selectedId: string | null) => update({ selectedId }), [update])

  return useMemo(() => ({
    ...state,
    onTimeRangeChange,
    onFiltersChange,
    onSearchChange,
    onLiveChange,
    onSelectedIdChange,
  }), [state, onTimeRangeChange, onFiltersChange, onSearchChange, onLiveChange, onSelectedIdChange])
}
