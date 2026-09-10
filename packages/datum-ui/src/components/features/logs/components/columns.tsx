'use client'

import type { CSSProperties, ReactNode } from 'react'
import type { LogColumn, LogColumnId, LogColumnSize, LogColumnSpec } from '../types'
import { cn } from '../../../../utils/cn'
import { Skeleton } from '../../../base/skeleton'
import { formatLogTimestampParts } from '../utils/format-timestamp'
import { logRequestHost } from '../utils/host'
import { LogsSeverityBadge, LogsStatusBadge } from './status-badge'

const DEFAULT_FIXED_WIDTH = 160

/** `MMM dd HH:mm:ss.SS` — e.g. `SEP 10 12:03:37.79`. */
const TIME_CHS = 18

const METHOD_CHS = [3, 4, 3, 4] as const
const HOST_CHS = [16, 22, 14, 20, 18, 24] as const
const PATH_CHS = [12, 28, 20, 40, 16, 34] as const

function pick(values: readonly number[], row: number): number {
  return values[row % values.length]!
}

function lineSkeleton(widthCh: number, className?: string) {
  return (
    <Skeleton
      data-slot="logs-skeleton"
      className={cn(
        'inline-block h-4 max-w-full align-middle rounded-sm font-mono text-xs leading-4',
        className,
      )}
      style={{ width: `${widthCh}ch` }}
    />
  )
}

const BUILTIN_COLUMNS: Record<LogColumnId, LogColumn> = {
  time: {
    id: 'time',
    header: 'Time',
    size: 'hug',
    cell: ({ entry }) => {
      const { date, time } = formatLogTimestampParts(entry.timestamp)
      return (
        <time
          dateTime={entry.timestamp.toISOString()}
          className="font-mono text-xs whitespace-nowrap"
        >
          <span className="text-muted-foreground">{date}</span>
          {' '}
          <span className="text-foreground">{time}</span>
        </time>
      )
    },
    skeleton: () => lineSkeleton(TIME_CHS),
  },
  severity: {
    id: 'severity',
    header: 'Severity',
    size: 'hug',
    cell: ({ entry }) => <LogsSeverityBadge severity={entry.labels.severity} />,
    skeleton: () => lineSkeleton(5, 'h-4 rounded-md'),
  },
  status: {
    id: 'status',
    header: 'Status',
    size: 'hug',
    cell: ({ parsed }) => <LogsStatusBadge parsed={parsed} />,
    skeleton: ({ row }) => (
      <span
        className="inline-flex h-4 items-center gap-1.5 font-mono text-[11px] leading-4"
        data-slot="logs-skeleton-status"
      >
        {lineSkeleton(3, 'h-[11px]')}
        {lineSkeleton(pick(METHOD_CHS, row), 'h-[11px]')}
      </span>
    ),
  },
  service: {
    id: 'service',
    header: 'Service',
    size: 'fixed',
    width: DEFAULT_FIXED_WIDTH,
    className: 'text-muted-foreground truncate font-mono text-xs',
    cell: ({ entry }) => entry.labels.service_name ?? '—',
    skeleton: ({ row }) => lineSkeleton(pick(HOST_CHS, row)),
  },
  resource: {
    id: 'resource',
    header: 'Resource',
    size: 'fixed',
    width: DEFAULT_FIXED_WIDTH,
    className: 'text-muted-foreground truncate font-mono text-xs',
    cell: ({ entry }) => {
      const value = entry.labels.resource_name
      return value
        ? <span title={value}>{value}</span>
        : '—'
    },
    skeleton: ({ row }) => lineSkeleton(pick(HOST_CHS, row)),
  },
  host: {
    id: 'host',
    header: 'Host',
    size: 'fixed',
    width: DEFAULT_FIXED_WIDTH,
    className: 'text-muted-foreground truncate font-mono text-xs',
    cell: ({ entry }) => {
      const value = logRequestHost(entry.labels)
      return value
        ? <span title={value}>{value}</span>
        : '—'
    },
    skeleton: ({ row }) => lineSkeleton(pick(HOST_CHS, row)),
  },
  path: {
    id: 'path',
    header: 'Path',
    size: 'fill',
    className: 'truncate font-mono text-xs',
    cell: ({ path }) => (
      <span className={path ? undefined : 'text-muted-foreground'} title={path ?? undefined}>
        {path ?? '—'}
      </span>
    ),
    skeleton: ({ row }) => lineSkeleton(pick(PATH_CHS, row)),
  },
  message: {
    id: 'message',
    header: 'Message',
    size: 'fill',
    className: 'truncate font-mono text-xs',
    cell: ({ message }) => message,
    skeleton: ({ row }) => lineSkeleton(pick(PATH_CHS, row)),
  },
}

// Local declaration so the library type-checks without `@types/node`;
// bundlers substitute `process.env.NODE_ENV` at build time.
declare const process: { env: { NODE_ENV?: string } }

const warnedColumnIds = new Set<string>()

/**
 * Expand column specs into renderable columns. Unknown built-in ids are
 * skipped (with a one-time dev warning) so a typo or a stale URL-driven
 * column list degrades to a narrower table instead of a crash.
 */
export function resolveLogColumns(specs: readonly LogColumnSpec[]): LogColumn[] {
  const columns: LogColumn[] = []
  for (const spec of specs) {
    if (typeof spec !== 'string') {
      columns.push({ size: 'fixed', width: DEFAULT_FIXED_WIDTH, ...spec })
      continue
    }
    const builtin = Object.hasOwn(BUILTIN_COLUMNS, spec) ? BUILTIN_COLUMNS[spec] : undefined
    if (builtin) {
      columns.push(builtin)
      continue
    }
    if (process.env.NODE_ENV !== 'production' && !warnedColumnIds.has(spec)) {
      warnedColumnIds.add(spec)
      console.warn(`[datum-ui/logs] Unknown column id "${spec}" was skipped. Built-in ids: ${Object.keys(BUILTIN_COLUMNS).join(', ')}.`)
    }
  }
  return columns
}

export function columnSize(column: LogColumn): LogColumnSize {
  return column.size ?? 'fixed'
}

export function columnWidth(column: LogColumn): number {
  return column.width ?? DEFAULT_FIXED_WIDTH
}

export function columnHeadClass(column: LogColumn): string {
  switch (columnSize(column)) {
    case 'hug':
      return 'w-px whitespace-nowrap'
    case 'fixed':
      return 'whitespace-nowrap'
    case 'fill':
      return 'min-w-0'
  }
}

export function columnCellClass(column: LogColumn): string {
  switch (columnSize(column)) {
    case 'hug':
      return 'w-px whitespace-nowrap'
    case 'fixed':
      return 'truncate'
    case 'fill':
      return 'min-w-0 truncate'
  }
}

export function columnWidthStyle(column: LogColumn): CSSProperties | undefined {
  if (columnSize(column) !== 'fixed')
    return undefined
  const width = columnWidth(column)
  return { width, maxWidth: width }
}

export function columnSkeleton(column: LogColumn, row: number): ReactNode {
  if (column.skeleton)
    return column.skeleton({ row })

  switch (columnSize(column)) {
    case 'hug':
      return lineSkeleton(column.id === 'time' ? TIME_CHS : 8)
    case 'fixed':
      return lineSkeleton(pick(HOST_CHS, row))
    case 'fill':
      return lineSkeleton(pick(PATH_CHS, row))
  }
}

export function columnHeader(column: LogColumn): ReactNode {
  return column.header
}
