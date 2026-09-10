'use client'

import type { ParsedLogLine } from '../types'
import { cn } from '../../../../utils/cn'
import { Badge } from '../../../base/badge'
import { httpStatusBadgeType, httpStatusTextClass, severityBadgeType } from '../utils/severity'

export function LogsSeverityBadge({ severity }: { severity?: string }) {
  const unlabeled = !severity
  return (
    <Badge
      type={severityBadgeType(severity)}
      theme={unlabeled ? 'solid' : 'light'}
      className={cn(
        'h-4 px-1.5 py-0 font-mono text-[10px] leading-4 font-medium',
        unlabeled && 'border-border bg-muted text-foreground',
      )}
    >
      {severity ?? 'LOG'}
    </Badge>
  )
}

/** Compact HTTP status chip, used inline next to the detail title. */
export function LogsHttpStatusChip({ status, className }: { status: number, className?: string }) {
  return (
    <Badge
      type={httpStatusBadgeType(status)}
      theme="light"
      data-slot="logs-http-status"
      className={cn('h-5 shrink-0 px-1.5 py-0 font-mono text-[11px] leading-5 font-medium tabular-nums', className)}
    >
      {status}
    </Badge>
  )
}

export function LogsStatusBadge({ parsed }: { parsed: ParsedLogLine }) {
  if (parsed.kind !== 'http') {
    return <span className="text-muted-foreground">—</span>
  }

  return (
    // Status first: three digits give a straight left edge, method widths trail.
    <span className="inline-flex h-4 items-center gap-1.5 font-mono text-[11px] leading-4 font-medium">
      <span className={cn('tabular-nums', httpStatusTextClass(parsed.status))}>{parsed.status}</span>
      <span className="text-muted-foreground">{parsed.method}</span>
    </span>
  )
}
