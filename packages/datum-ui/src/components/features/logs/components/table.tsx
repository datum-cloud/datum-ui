'use client'

import type { KeyboardEvent, ReactNode } from 'react'
import type { LogColumn } from '../types'
import { Inbox, RefreshCw, TriangleAlert } from 'lucide-react'
import { useRef } from 'react'
import { cn } from '../../../../utils/cn'
import { Button } from '../../../base/button'
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../base/table'
import { Icon } from '../../../icons/icon-wrapper'
import { useLogs } from '../hooks/use-logs'
import { logLineDisplay } from '../utils/parse-log-line'
import {
  columnCellClass,
  columnHeadClass,
  columnHeader,
  columnSkeleton,
  columnWidthStyle,
} from './columns'

const SKELETON_ROWS = 12

/** Centred message row shared by the empty and error states. */
function LogsTableState({
  icon,
  title,
  description,
  action,
  colSpan,
  slot,
  role,
  tone = 'muted',
}: {
  icon: ReactNode
  title: string
  description?: ReactNode
  action?: ReactNode
  colSpan: number
  slot: string
  role?: 'alert'
  tone?: 'muted' | 'destructive'
}) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={colSpan} className="pt-20 pb-12 text-center">
        <div
          role={role}
          data-slot={slot}
          className="mx-auto flex max-w-md flex-col items-center gap-2 px-4"
        >
          <span
            className={cn(
              'flex size-9 items-center justify-center rounded-full border',
              tone === 'destructive'
                ? 'border-destructive/20 bg-destructive/10 text-destructive'
                : 'border-border bg-muted text-muted-foreground',
            )}
          >
            {icon}
          </span>
          <p className="text-foreground text-sm font-medium">{title}</p>
          {description && (
            <p className="text-muted-foreground text-xs">{description}</p>
          )}
          {action && <div className="mt-1.5">{action}</div>}
        </div>
      </TableCell>
    </TableRow>
  )
}

function LogCell({ column, children }: { column: LogColumn, children: ReactNode }) {
  return (
    <TableCell
      className={cn(columnCellClass(column), column.className)}
      style={columnWidthStyle(column)}
    >
      {children}
    </TableCell>
  )
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
    onRefresh,
    hasActiveFilters,
    resetFilters,
    search,
    setSearch,
  } = useLogs()
  const scrollerRef = useRef<HTMLDivElement>(null)

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
      ref={scrollerRef}
      data-slot="logs-table"
      className={cn('min-h-0 flex-1 overflow-auto outline-none', className)}
      tabIndex={0}
      aria-busy={isLoading || undefined}
      onKeyDown={onKeyDown}
    >
      <table className="w-full caption-bottom table-auto text-sm [&_th]:px-3 [&_th]:py-2 [&_td]:px-3 [&_td]:py-1.5">
        <TableHeader className="bg-background sticky top-0 z-10">
          <TableRow>
            {columns.map(column => (
              <TableHead
                key={column.id}
                className={cn(columnHeadClass(column), column.headerClassName)}
                style={columnWidthStyle(column)}
              >
                {columnHeader(column)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && entries.length === 0 && (
            Array.from({ length: SKELETON_ROWS }, (_, index) => (
              <TableRow key={`skeleton-${index}`} data-slot="logs-skeleton-row">
                {columns.map(column => (
                  <LogCell key={column.id} column={column}>
                    {columnSkeleton(column, index)}
                  </LogCell>
                ))}
              </TableRow>
            ))
          )}
          {error && (
            <LogsTableState
              role="alert"
              slot="logs-error"
              tone="destructive"
              colSpan={columns.length}
              icon={<Icon icon={TriangleAlert} />}
              title="Couldn't load logs"
              description={(
                <code className="bg-muted text-foreground inline-block max-w-full rounded-md border px-2 py-1 text-left font-mono text-[11px] leading-4 break-all">
                  {error}
                </code>
              )}
              action={onRefresh && (
                <Button type="secondary" theme="outline" size="small" onClick={onRefresh}>
                  <Icon icon={RefreshCw} size={14} />
                  Retry
                </Button>
              )}
            />
          )}
          {!isLoading && entries.length === 0 && !error && (
            <LogsTableState
              slot="logs-empty"
              colSpan={columns.length}
              icon={<Icon icon={Inbox} />}
              title="No logs in this time range"
              description={hasActiveFilters || search
                ? 'Try widening the range or clearing the filters.'
                : 'Try widening the range or check back in a moment.'}
              action={(hasActiveFilters || search) && (
                <Button
                  type="secondary"
                  theme="outline"
                  size="small"
                  onClick={() => {
                    resetFilters()
                    setSearch('')
                  }}
                >
                  Clear filters
                </Button>
              )}
            />
          )}
          {entries.map((entry) => {
            const { parsed, path, message } = logLineDisplay(entry.line, entry.labels)
            const selected = entry.id === selectedId
            const ctx = { entry, parsed, path, message }

            return (
              <TableRow
                key={entry.id}
                data-state={selected ? 'selected' : undefined}
                aria-selected={selected}
                className={cn(
                  'cursor-pointer hover:bg-foreground/5',
                  'data-[state=selected]:bg-foreground/10',
                  'data-[state=selected]:hover:bg-foreground/10',
                )}
                onClick={() => {
                  setSelectedId(selected ? null : entry.id)
                  scrollerRef.current?.focus()
                }}
              >
                {columns.map(column => (
                  <LogCell key={column.id} column={column}>
                    {column.cell(ctx)}
                  </LogCell>
                ))}
              </TableRow>
            )
          })}
        </TableBody>
      </table>
    </div>
  )
}
