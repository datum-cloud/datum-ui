'use client'

import type { KeyboardEvent, ReactNode } from 'react'
import type { LogColumn } from '../types'
import { Inbox, RefreshCw, TriangleAlert } from 'lucide-react'
import { useMemo, useRef } from 'react'
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

/** Centred message shared by the empty and error states. */
function LogsTableState({
  icon,
  title,
  description,
  action,
  slot,
  role,
  tone = 'muted',
}: {
  icon: ReactNode
  title: string
  description?: ReactNode
  action?: ReactNode
  slot: string
  role?: 'alert'
  tone?: 'muted' | 'destructive'
}) {
  // Rendered after the table (not as a row) so it can take the remaining
  // scroller height and sit in the middle of the log view.
  return (
    <div className="flex min-h-48 flex-1 items-center justify-center px-4 py-8 text-center">
      <div
        role={role}
        data-slot={slot}
        className="flex max-w-md flex-col items-center gap-2"
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
    </div>
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
  const rows = useMemo(
    () => entries.map((entry) => {
      const { parsed, path, message } = logLineDisplay(entry.line, entry.labels)
      return { entry, ctx: { entry, parsed, path, message } }
    }),
    [entries],
  )

  // One state at a time: an error wins over skeletons; skeletons only while
  // there is nothing to show; the empty row only for a settled, clean result.
  const hasRows = entries.length > 0
  const showError = Boolean(error) && !hasRows
  const showErrorBanner = Boolean(error) && hasRows
  const showSkeleton = isLoading && !hasRows && !error
  const showEmpty = !isLoading && !hasRows && !error
  const retry = onRefresh && (
    <Button type="secondary" theme="outline" size="small" onClick={onRefresh}>
      <Icon icon={RefreshCw} size={14} />
      Retry
    </Button>
  )

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
      className={cn('flex min-h-0 flex-1 flex-col overflow-auto outline-none', className)}
      tabIndex={0}
      aria-busy={isLoading || undefined}
      onKeyDown={onKeyDown}
    >
      {showErrorBanner && (
        <div
          role="alert"
          data-slot="logs-error-banner"
          className="border-destructive/30 bg-destructive/5 text-foreground sticky top-0 z-20 flex items-center gap-2 border-b px-3 py-1.5 text-xs"
        >
          <Icon icon={TriangleAlert} size={14} className="text-destructive shrink-0" />
          <span className="min-w-0 truncate">
            <span className="font-medium">Refresh failed.</span>
            {' '}
            <span className="text-muted-foreground">Showing the last successful result.</span>
            {' '}
            <code className="font-mono">{error}</code>
          </span>
          <span className="ml-auto shrink-0">{retry}</span>
        </div>
      )}
      <table className="w-full shrink-0 caption-bottom table-auto text-sm [&_th]:px-3 [&_th]:py-2 [&_td]:px-3 [&_td]:py-1.5">
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
          {showSkeleton && (
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
          {rows.map(({ entry, ctx }) => {
            const selected = entry.id === selectedId

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
      {showError && (
        <LogsTableState
          role="alert"
          slot="logs-error"
          tone="destructive"
          icon={<Icon icon={TriangleAlert} />}
          title="Couldn't load logs"
          description={(
            <code className="bg-muted text-foreground inline-block max-w-full rounded-md border px-2 py-1 text-left font-mono text-[11px] leading-4 break-all">
              {error}
            </code>
          )}
          action={retry}
        />
      )}
      {showEmpty && (
        <LogsTableState
          slot="logs-empty"
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
    </div>
  )
}
