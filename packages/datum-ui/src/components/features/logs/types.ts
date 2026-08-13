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
}

export type LogFilters = Record<string, string[]>

export type LogColumnId = 'time' | 'severity' | 'status' | 'service' | 'resource' | 'message'

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
  columns?: readonly LogColumnId[]
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
  columns: readonly LogColumnId[]
  hasActiveFilters: boolean
  onRefresh?: () => void
  onExport?: (entries: readonly LogEntry[]) => void
}
