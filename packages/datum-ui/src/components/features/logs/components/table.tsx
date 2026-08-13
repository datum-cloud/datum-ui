'use client'

import type { KeyboardEvent } from 'react'
import type { LogColumnId, LogEntry, ParsedLogLine } from '../types'
import { cn } from '../../../../utils/cn'
import { Skeleton } from '../../../base/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../base/table'
import { useLogs } from '../hooks/use-logs'
import { logLineDisplay, parseLogLine } from '../utils/parse-log-line'
import { LogsSeverityBadge, LogsStatusBadge, LogsTimestamp } from './status-badge'

const COLUMN_LABEL: Record<LogColumnId, string> = {
  time: 'Time',
  severity: 'Severity',
  status: 'Status',
  service: 'Service',
  resource: 'Resource',
  path: 'Path',
  message: 'Message',
}

const COLUMN_HEAD_CLASS: Record<LogColumnId, string> = {
  time: 'w-[168px]',
  severity: 'w-[88px]',
  status: 'w-[110px]',
  service: 'w-[160px]',
  resource: 'w-[160px]',
  path: 'w-[200px]',
  message: '',
}

function LogCell({
  column,
  entry,
  parsed,
  path,
  message,
}: {
  column: LogColumnId
  entry: LogEntry
  parsed: ParsedLogLine
  path: string | null
  message: string
}) {
  switch (column) {
    case 'time':
      return (
        <TableCell>
          <LogsTimestamp date={entry.timestamp} timestampNs={entry.timestampNs} />
        </TableCell>
      )
    case 'severity':
      return (
        <TableCell>
          <LogsSeverityBadge severity={entry.labels.severity} />
        </TableCell>
      )
    case 'status':
      return (
        <TableCell>
          <LogsStatusBadge parsed={parsed} />
        </TableCell>
      )
    case 'service':
      return (
        <TableCell className="text-muted-foreground truncate font-mono text-xs">
          {entry.labels.service_name ?? '—'}
        </TableCell>
      )
    case 'resource':
      return (
        <TableCell className="text-muted-foreground truncate font-mono text-xs">
          {entry.labels.resource_name ?? '—'}
        </TableCell>
      )
    case 'path':
      return (
        <TableCell className="truncate font-mono text-xs" title={path ?? undefined}>
          {path ?? ''}
        </TableCell>
      )
    case 'message':
      return (
        <TableCell className="truncate font-mono text-xs">{message}</TableCell>
      )
  }
}

export function LogsTable({ className }: { className?: string }) {
  const {
    entries,
    columns,
    selectedId,
    setSelectedId,
    isLoading,
    error,
    selectPrevious,
    selectNext,
  } = useLogs()

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowDown' || event.key === 'j') {
      event.preventDefault()
      selectNext()
    }
    if (event.key === 'ArrowUp' || event.key === 'k') {
      event.preventDefault()
      selectPrevious()
    }
    if (event.key === 'Escape') {
      setSelectedId(null)
    }
  }

  return (
    <div
      data-slot="logs-table"
      className={cn('min-h-0 flex-1 overflow-auto outline-none', className)}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {error && (
        <div role="alert" className="text-destructive px-4 py-3 text-sm">
          {error}
        </div>
      )}
      <Table className="table-fixed">
        <TableHeader className="bg-background sticky top-0 z-10">
          <TableRow>
            {columns.map(column => (
              <TableHead key={column} className={COLUMN_HEAD_CLASS[column]}>
                {COLUMN_LABEL[column]}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && entries.length === 0 && (
            Array.from({ length: 8 }, (_, index) => (
              <TableRow key={`skeleton-${index}`}>
                <TableCell colSpan={columns.length}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              </TableRow>
            ))
          )}
          {!isLoading && entries.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-muted-foreground py-10 text-center text-sm">
                No logs in this time range
              </TableCell>
            </TableRow>
          )}
          {entries.map((entry) => {
            const parsed = parseLogLine(entry.line)
            const { path, message } = logLineDisplay(entry.line)
            const selected = entry.id === selectedId

            return (
              <TableRow
                key={entry.id}
                data-state={selected ? 'selected' : undefined}
                className="cursor-pointer"
                onClick={() => setSelectedId(selected ? null : entry.id)}
              >
                {columns.map(column => (
                  <LogCell
                    key={column}
                    column={column}
                    entry={entry}
                    parsed={parsed}
                    path={path}
                    message={message}
                  />
                ))}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
