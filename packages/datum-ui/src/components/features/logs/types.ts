import type { ReactNode } from 'react'

export interface LokiStream {
  stream: Record<string, string>
  values: Array<[timestampNs: string, line: string]>
}

export interface LokiQueryRangeResponse {
  status: 'success' | 'error'
  data?: {
    resultType: 'streams' | 'vector'
    result: LokiStream[]
  }
  errorType?: string
  error?: string
}

export interface LogEntry {
  id: string
  timestamp: Date
  timestampNs: string
  line: string
  labels: Record<string, string>
}

export interface LogFacetOption {
  value: string
  count?: number
}

export interface LogFacet {
  name: string
  label: string
  options: LogFacetOption[]
}

export interface LogTimeRange {
  from: string
  to: string
  /**
   * Key of the relative preset this range came from (e.g. `last-30m`).
   * Absent for hand-picked absolute ranges. Pass through
   * `resolveLogTimeRange` to slide a preset window forward to "now".
   */
  preset?: string
}

export type LogFilters = Record<string, string[]>

/** One bar of the timeline histogram. `start` is inclusive, `end` exclusive. */
export interface LogHistogramBucket {
  start: string
  end: string
  count: number
}

export type LogColumnId
  = | 'time'
    | 'severity'
    | 'status'
    | 'service'
    | 'resource'
    | 'host'
    | 'path'
    | 'message'

/** How a column behaves in a full-width table. */
export type LogColumnSize = 'hug' | 'fixed' | 'fill'

export interface LogColumnCellContext {
  entry: LogEntry
  parsed: ParsedLogLine
  path: string | null
  message: string
}

/**
 * A logs table column. Pass a built-in `LogColumnId` or a custom column
 * so consumers can add Host / Request without CSS overrides.
 */
export interface LogColumnSkeletonContext {
  row: number
}

export interface LogColumn {
  id: string
  header: ReactNode
  size?: LogColumnSize
  /** Pixel width when `size` is `fixed`. Defaults to 160. */
  width?: number
  className?: string
  headerClassName?: string
  cell: (ctx: LogColumnCellContext) => ReactNode
  /** Placeholder that mirrors this cell's real content while logs load. */
  skeleton?: (ctx: LogColumnSkeletonContext) => ReactNode
}

export type LogColumnSpec = LogColumnId | LogColumn

export interface ParsedHttpLogLine {
  kind: 'http'
  method: string
  path: string
  status: number
  durationMs: number
}

export interface ParsedTextLogLine {
  kind: 'text'
  line: string
}

export type ParsedLogLine = ParsedHttpLogLine | ParsedTextLogLine

export interface BuildLogQLOptions {
  matchers?: LogFilters
  lineContains?: string
}

export type LogSeverity = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL' | (string & {})

export interface LogsRootProps {
  entries: readonly LogEntry[]
  facets?: readonly LogFacet[]
  /**
   * Bucketed counts for `Logs.Timeline`. Supply server-side counts (e.g. a
   * LogQL `count_over_time` range query) so the histogram reflects the whole
   * window rather than the loaded page. Defaults to bucketing `entries`
   * across `timeRange`.
   */
  histogram?: readonly LogHistogramBucket[]
  timeRange?: LogTimeRange
  defaultTimeRange?: LogTimeRange
  filters?: LogFilters
  defaultFilters?: LogFilters
  search?: string
  defaultSearch?: string
  live?: boolean
  defaultLive?: boolean
  selectedId?: string | null
  defaultSelectedId?: string | null
  isLoading?: boolean
  error?: ReactNode
  columns?: readonly LogColumnSpec[]
  onTimeRangeChange?: (range: LogTimeRange) => void
  onFiltersChange?: (filters: LogFilters) => void
  onSearchChange?: (search: string) => void
  onLiveChange?: (live: boolean) => void
  onSelectedIdChange?: (id: string | null) => void
  onRefresh?: () => void
  onExport?: (entries: readonly LogEntry[]) => void
  className?: string
  children: ReactNode
}

export interface LogsContextValue {
  entries: readonly LogEntry[]
  facets: readonly LogFacet[]
  histogram: readonly LogHistogramBucket[]
  timeRange: LogTimeRange
  setTimeRange: (range: LogTimeRange) => void
  filters: LogFilters
  setFilters: (filters: LogFilters) => void
  toggleFilterValue: (name: string, value: string) => void
  resetFilters: () => void
  search: string
  setSearch: (search: string) => void
  live: boolean
  setLive: (live: boolean) => void
  selectedId: string | null
  setSelectedId: (id: string | null) => void
  selectedEntry: LogEntry | null
  selectedIndex: number
  selectPrevious: () => void
  selectNext: () => void
  isLoading: boolean
  error: ReactNode
  columns: readonly LogColumn[]
  hasActiveFilters: boolean
  onRefresh?: () => void
  onExport?: (entries: readonly LogEntry[]) => void
}
