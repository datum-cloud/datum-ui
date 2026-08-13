import type { BadgeProps } from '../../../base/badge/badge'

export type SeverityBadgeType = NonNullable<BadgeProps['type']>

const SEVERITY_BADGE: Record<string, SeverityBadgeType> = {
  ERROR: 'danger',
  FATAL: 'danger',
  CRITICAL: 'danger',
  WARN: 'warning',
  WARNING: 'warning',
  INFO: 'info',
  DEBUG: 'muted',
  TRACE: 'muted',
}

export function severityBadgeType(severity: string | undefined): SeverityBadgeType {
  if (!severity)
    return 'muted'
  return SEVERITY_BADGE[severity.toUpperCase()] ?? 'muted'
}

export function httpStatusBadgeType(status: number): SeverityBadgeType {
  if (status >= 500)
    return 'danger'
  if (status >= 400)
    return 'warning'
  if (status >= 300)
    return 'info'
  if (status >= 200)
    return 'success'
  return 'muted'
}
