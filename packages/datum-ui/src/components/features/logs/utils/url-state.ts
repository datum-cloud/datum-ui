import type { LogFilters, LogTimeRange } from '../types'
import { lastThirtyMinutes, LOG_TIME_PRESETS, resolveLogTimeRange } from './time-range'

/**
 * The parts of `Logs.Root` state that belong in the address bar: everything
 * that decides which logs the host fetches, plus the open row.
 */
export interface LogsUrlState {
  timeRange: LogTimeRange
  filters: LogFilters
  search: string
  live: boolean
  selectedId: string | null
}

export interface LogsUrlStateOptions {
  /**
   * Prepended to every key, e.g. `logs.` gives `logs.q`, `logs.range`. Use it
   * when two explorers share a page, or a key clashes with one the app owns.
   */
  prefix?: string
  /**
   * Range used when the URL has none, and left out of the URL when chosen.
   * Defaults to the last 30 minutes.
   */
  defaultTimeRange?: LogTimeRange
}

/**
 * Query-string keys, before `prefix`. A preset range is written as
 * `range=last-1h`; a hand-picked one as `from` and `to` ISO timestamps. Each
 * selected facet value is its own `filter=<label>:<value>` entry.
 */
export const LOGS_URL_KEYS = {
  search: 'q',
  range: 'range',
  from: 'from',
  to: 'to',
  filter: 'filter',
  live: 'live',
  selected: 'log',
} as const

/** Same rule as `buildLogQL`: anything else can't be a Loki label. */
const LABEL_NAME = /^[a-z_]\w*$/i

function keysFor(prefix = '') {
  return {
    search: `${prefix}${LOGS_URL_KEYS.search}`,
    range: `${prefix}${LOGS_URL_KEYS.range}`,
    from: `${prefix}${LOGS_URL_KEYS.from}`,
    to: `${prefix}${LOGS_URL_KEYS.to}`,
    filter: `${prefix}${LOGS_URL_KEYS.filter}`,
    live: `${prefix}${LOGS_URL_KEYS.live}`,
    selected: `${prefix}${LOGS_URL_KEYS.selected}`,
  }
}

function toParams(input: URLSearchParams | string): URLSearchParams {
  return typeof input === 'string' ? new URLSearchParams(input) : input
}

function isValidDate(value: string | null): value is string {
  return value !== null && value !== '' && !Number.isNaN(new Date(value).getTime())
}

function isKnownPreset(key: string): boolean {
  return LOG_TIME_PRESETS.some(preset => preset.key === key)
}

function sameRange(a: LogTimeRange, b: LogTimeRange): boolean {
  if (a.preset || b.preset)
    return a.preset === b.preset
  return a.from === b.from && a.to === b.to
}

function parseTimeRange(params: URLSearchParams, keys: ReturnType<typeof keysFor>, fallback: LogTimeRange, now: Date): LogTimeRange {
  const preset = params.get(keys.range)
  if (preset && isKnownPreset(preset))
    return resolveLogTimeRange({ from: '', to: '', preset }, now)

  const from = params.get(keys.from)
  const to = params.get(keys.to)
  if (isValidDate(from) && isValidDate(to) && new Date(from) < new Date(to))
    return { from: new Date(from).toISOString(), to: new Date(to).toISOString() }

  return fallback.preset ? resolveLogTimeRange(fallback, now) : fallback
}

function parseFilters(params: URLSearchParams, key: string): LogFilters {
  const filters: LogFilters = {}
  for (const entry of params.getAll(key)) {
    // Label names can't contain ':', so the first one splits name from value.
    const split = entry.indexOf(':')
    if (split <= 0)
      continue
    const name = entry.slice(0, split)
    const value = entry.slice(split + 1)
    if (!LABEL_NAME.test(name) || value === '')
      continue
    const values = filters[name] ?? (filters[name] = [])
    if (!values.includes(value))
      values.push(value)
  }
  return filters
}

/**
 * Read logs state from a query string. Missing or malformed values fall back
 * to the defaults (`Logs.Root`'s own defaults), so a hand-edited or stale link
 * still opens. A preset range is resolved against `now`.
 */
export function parseLogsUrlState(
  input: URLSearchParams | string,
  options: LogsUrlStateOptions & { now?: Date } = {},
): LogsUrlState {
  const params = toParams(input)
  const keys = keysFor(options.prefix)
  const now = options.now ?? new Date()
  const fallback = options.defaultTimeRange ?? lastThirtyMinutes(now)
  const live = params.get(keys.live)

  return {
    timeRange: parseTimeRange(params, keys, fallback, now),
    filters: parseFilters(params, keys.filter),
    search: params.get(keys.search) ?? '',
    live: live === '1' || live === 'true',
    selectedId: params.get(keys.selected) || null,
  }
}

/**
 * Return a copy of `input` with the given parts of logs state written in.
 * Only the parts present in `state` are touched, and params the app owns are
 * kept. Defaults (no search, no filters, not live, the default range) are
 * left out so a fresh explorer has a clean URL.
 */
export function writeLogsUrlState(
  input: URLSearchParams | string,
  state: Partial<LogsUrlState>,
  options: LogsUrlStateOptions = {},
): URLSearchParams {
  const params = new URLSearchParams(toParams(input))
  const keys = keysFor(options.prefix)

  if (state.timeRange !== undefined) {
    params.delete(keys.range)
    params.delete(keys.from)
    params.delete(keys.to)
    const range = state.timeRange
    const fallback = options.defaultTimeRange ?? { from: '', to: '', preset: 'last-30m' }
    if (!sameRange(range, fallback)) {
      if (range.preset && isKnownPreset(range.preset)) {
        params.set(keys.range, range.preset)
      }
      else if (isValidDate(range.from) && isValidDate(range.to)) {
        params.set(keys.from, range.from)
        params.set(keys.to, range.to)
      }
    }
  }

  if (state.filters !== undefined) {
    params.delete(keys.filter)
    for (const [name, values] of Object.entries(state.filters)) {
      if (!LABEL_NAME.test(name))
        continue
      for (const value of values) {
        if (value !== '')
          params.append(keys.filter, `${name}:${value}`)
      }
    }
  }

  if (state.search !== undefined) {
    if (state.search === '')
      params.delete(keys.search)
    else
      params.set(keys.search, state.search)
  }

  if (state.live !== undefined) {
    if (state.live)
      params.set(keys.live, '1')
    else
      params.delete(keys.live)
  }

  if (state.selectedId !== undefined) {
    if (state.selectedId)
      params.set(keys.selected, state.selectedId)
    else
      params.delete(keys.selected)
  }

  return params
}

/**
 * Just this explorer's params, as a query string in a fixed key order. It
 * parses to the same state as the full query string, and only changes when
 * one of these params does, so it works as a memo key: an unrelated app param
 * changing won't re-resolve a preset range (which would hand the host a new
 * `timeRange` and trigger a refetch).
 */
export function logsUrlStateKey(input: URLSearchParams | string, options: Pick<LogsUrlStateOptions, 'prefix'> = {}): string {
  const params = toParams(input)
  const own = new URLSearchParams()
  for (const key of Object.values(keysFor(options.prefix))) {
    for (const value of params.getAll(key))
      own.append(key, value)
  }
  return own.toString()
}
