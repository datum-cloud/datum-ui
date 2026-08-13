import type { LogColumnId } from '../types'

export const DEFAULT_LOG_COLUMNS: readonly LogColumnId[] = [
  'time',
  'severity',
  'status',
  'service',
  'path',
  'message',
]

export const CANONICAL_FACET_NAMES = ['severity', 'service_name', 'resource_name'] as const

export const FACET_LABELS: Record<string, string> = {
  severity: 'Severity',
  service_name: 'Service',
  resource_name: 'Resource',
}

export const SEVERITY_ORDER = ['ERROR', 'FATAL', 'WARN', 'WARNING', 'INFO', 'DEBUG', 'TRACE'] as const

export const DEFAULT_LOGQL_MATCHER = '{service_name=~".+"}'
