'use client'

import type { ParsedLogLine } from '../types'
import { cn } from '../../../../utils/cn'
import { Badge } from '../../../base/badge'
import { DateTime } from '../../date-time'
import { formatLogTimestamp } from '../utils/format-timestamp'
import { httpStatusTextClass, severityBadgeType } from '../utils/severity'

export function LogsTimestamp({ date, timestampNs }: { date: Date, timestampNs?: string }) {
  return (
    <DateTime date={date} variant="detailed" timestamp={timestampNs}>
      <time
        dateTime={date.toISOString()}
        className="text-muted-foreground font-mono text-xs whitespace-nowrap"
      >
        {formatLogTimestamp(date)}
      </time>
    </DateTime>
  )
}

export function LogsSeverityBadge({ severity }: { severity?: string }) {
  return (
    <Badge
      type={severityBadgeType(severity)}
      theme="light"
      className="h-4 px-1.5 py-0 font-mono text-[10px] leading-4 font-medium"
    >
      {severity ?? 'LOG'}
    </Badge>
  )
}

export function LogsStatusBadge({ parsed }: { parsed: ParsedLogLine }) {
  if (parsed.kind !== 'http') {
    return <span className="text-muted-foreground">—</span>
  }

  return (
    <span className="inline-grid grid-cols-[7ch_auto] gap-x-2 font-mono text-[11px] font-medium">
      <span className="text-muted-foreground">{parsed.method}</span>
      <span className={cn('tabular-nums', httpStatusTextClass(parsed.status))}>{parsed.status}</span>
    </span>
  )
}
