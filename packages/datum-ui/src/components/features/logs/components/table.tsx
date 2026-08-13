'use client'

import type { KeyboardEvent } from 'react'
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
import { parseLogLine } from '../utils/parse-log-line'
import { LogsStatusBadge, LogsTimestamp } from './status-badge'

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
            {columns.includes('time') && <TableHead className="w-[168px]">Time</TableHead>}
            {columns.includes('status') && <TableHead className="w-[110px]">Status</TableHead>}
            {columns.includes('service') && <TableHead className="w-[160px]">Service</TableHead>}
            {columns.includes('resource') && <TableHead className="w-[160px]">Resource</TableHead>}
            {columns.includes('message') && <TableHead>Message</TableHead>}
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
            const selected = entry.id === selectedId
            const message = parsed.kind === 'http' ? parsed.path : entry.line

            return (
              <TableRow
                key={entry.id}
                data-state={selected ? 'selected' : undefined}
                className="cursor-pointer"
                onClick={() => setSelectedId(selected ? null : entry.id)}
              >
                {columns.includes('time') && (
                  <TableCell>
                    <LogsTimestamp date={entry.timestamp} />
                  </TableCell>
                )}
                {columns.includes('status') && (
                  <TableCell>
                    <LogsStatusBadge severity={entry.labels.severity} parsed={parsed} />
                  </TableCell>
                )}
                {columns.includes('service') && (
                  <TableCell className="text-muted-foreground truncate font-mono text-xs">
                    {entry.labels.service_name ?? '—'}
                  </TableCell>
                )}
                {columns.includes('resource') && (
                  <TableCell className="text-muted-foreground truncate font-mono text-xs">
                    {entry.labels.resource_name ?? '—'}
                  </TableCell>
                )}
                {columns.includes('message') && (
                  <TableCell className="truncate font-mono text-xs">{message}</TableCell>
                )}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
