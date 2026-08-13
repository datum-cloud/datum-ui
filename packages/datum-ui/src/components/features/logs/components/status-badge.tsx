'use client'

import type { ParsedLogLine } from '../types'
import { Badge } from '../../../base/badge'
import { Tooltip } from '../../../base/tooltip'
import {
  formatLocalTimestamp,
  formatLogTimestamp,
  formatRelativeTimestamp,
  formatUtcTimestamp,
} from '../utils/format-timestamp'
import { httpStatusBadgeType, severityBadgeType } from '../utils/severity'

export function LogsTimestamp({ date }: { date: Date }) {
  return (
    <Tooltip
      message={(
        <div className="flex flex-col gap-1 text-xs">
          <span>{formatRelativeTimestamp(date)}</span>
          <span>{formatUtcTimestamp(date)}</span>
          <span>{formatLocalTimestamp(date)}</span>
        </div>
      )}
    >
      <time
        dateTime={date.toISOString()}
        className="text-muted-foreground font-mono text-xs whitespace-nowrap"
      >
        {formatLogTimestamp(date)}
      </time>
    </Tooltip>
  )
}

export function LogsStatusBadge({
  severity,
  parsed,
}: {
  severity?: string
  parsed: ParsedLogLine
}) {
  if (parsed.kind === 'http') {
    return (
      <Badge
        type={httpStatusBadgeType(parsed.status)}
        theme="light"
        className="font-mono text-[11px] font-medium"
      >
        {parsed.method}
        {' '}
        {parsed.status}
      </Badge>
    )
  }

  return (
    <Badge
      type={severityBadgeType(severity)}
      theme="light"
      className="font-mono text-[11px] font-medium"
    >
      {severity ?? 'LOG'}
    </Badge>
  )
}
