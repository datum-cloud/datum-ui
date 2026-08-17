import type { BadgeProps } from '../../../base/badge'

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

export function httpStatusTextClass(status: number): string {
  switch (httpStatusBadgeType(status)) {
    case 'danger':
      return 'text-[var(--color-badge-danger)]'
    case 'warning':
      return 'text-[var(--color-badge-warning)]'
    case 'info':
      return 'text-[var(--color-badge-info)]'
    case 'success':
      return 'text-[var(--color-badge-success)]'
    default:
      return 'text-muted-foreground'
  }
}
