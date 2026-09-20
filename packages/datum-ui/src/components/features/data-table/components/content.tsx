'use client'

import type { Cell, Row, RowData } from '@tanstack/react-table'
import type { DataTableFeatures } from '../core/features'
import type { ContentProps, InlineContentEntry } from '../types'
import { flexRender } from '@tanstack/react-table'
import { useMemo } from 'react'
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
import { DEFAULT_LOADING_ROWS } from '../constants'
import { useDataTableInlineContents, useDataTableLoading, useDataTablePagination, useDataTableRows } from '../hooks/use-selectors'

/**
 * Per-slot class presets keyed by `density`. `'default'` is intentionally empty
 * so omitting `density` (or passing `'default'`) renders identically to before
 * this prop existed. Every preset only ever *adds* to what a caller passes via
 * the matching `*ClassName` prop — `cn(preset, callerClassName)` below lets the
 * caller's own classes win on conflict.
 */
const DENSITY_PRESETS: Record<'default' | 'compact', {
  readonly className?: string
  readonly headerClassName?: string
  readonly headerRowClassName?: string
  readonly headerCellClassName?: string
  readonly bodyClassName?: string
  readonly rowClassName?: string
  readonly cellClassName?: string
}> = {
  default: {},
  compact: {
    // Neutralizes the inner `Table` container's own `overflow-x-auto` wrapper so
    // this element resolves as the sticky header's scrolling ancestor instead.
    className: 'overflow-auto [&>div]:overflow-visible',
    headerClassName: '[&_tr]:border-0',
    headerRowClassName: 'border-0 hover:bg-transparent',
    headerCellClassName: cn(
      'sticky top-0 z-10 h-9 border-b border-border bg-table-header-background px-4',
      'text-xs leading-4 font-normal tracking-normal text-table-header-foreground uppercase',
    ),
    bodyClassName: '[&_tr:last-child]:border-b-0',
    rowClassName: 'border-0 hover:bg-muted/30',
    // py-2 (~36-40px rows): py-0.5 read cramped for multi-value cells (chips,
    // status pills) — still denser than the default table's h-10/p-2 rows.
    cellClassName: 'border-b border-border px-4 py-2 text-sm',
  },
}

function resolveClassName<T>(
  value: string | ((item: T) => string) | undefined,
  item: T,
): string | undefined {
  if (typeof value === 'function')
    return value(item)
  return value
}

/** Clicks inside these should drive their own control, not the row's `onRowClick`. */
function isInteractiveTarget(target: EventTarget | null): boolean {
  return target instanceof HTMLElement
    && target.closest('a, button, [role="checkbox"], input, textarea, select, [data-slot="dt-row-actions"]') != null
}

function renderInlineContentRow<TData extends RowData>(
  entry: InlineContentEntry<TData>,
  colSpan: number,
  rows: Row<DataTableFeatures, TData>[],
) {
  return (
    <TableRow
      key={entry.id}
      data-slot="dt-inline-content"
      data-position={entry.position}
      className={cn('transition-all duration-200', entry.className)}
    >
      <TableCell colSpan={colSpan}>
        {entry.render({
          onClose: entry.onClose,
          rowData: entry.position === 'row'
            ? rows.find(r => r.id === entry.rowId)?.original ?? null
            : null,
        })}
      </TableCell>
    </TableRow>
  )
}

export function DataTableContent<TData extends RowData = Record<string, any>>({
  emptyMessage,
  className,
  tableClassName,
  headerClassName,
  headerRowClassName,
  headerCellClassName,
  bodyClassName,
  rowClassName,
  cellClassName,
  density = 'default',
  onRowClick,
}: ContentProps<TData>) {
  const { rows, headerGroups, totalColumns } = useDataTableRows<TData>()
  const { isLoading, columnCount } = useDataTableLoading()
  const { pageSize } = useDataTablePagination()
  const { inlineContents } = useDataTableInlineContents<TData>()
  const openInlineContents = useMemo(() => inlineContents.filter(e => e.open), [inlineContents])
  const colSpan = totalColumns
  const skeletonColumns = totalColumns || columnCount || DEFAULT_LOADING_ROWS
  const preset = DENSITY_PRESETS[density]

  return (
    <div className={cn('datum-ui-data-table', preset.className, className)} data-slot="dt" style={{ overflowX: 'auto' }}>
      <Table className={cn(tableClassName)} data-slot="dt-table">
        <TableHeader className={cn(preset.headerClassName, headerClassName)} data-slot="dt-header">
          {headerGroups.map(headerGroup => (
            <TableRow key={headerGroup.id} className={cn(preset.headerRowClassName, headerRowClassName)} data-slot="dt-header-row">
              {headerGroup.headers.map(header => (
                <TableHead key={header.id} className={cn(preset.headerCellClassName, headerCellClassName)} data-slot="dt-header-cell">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className={cn(preset.bodyClassName, bodyClassName)} data-slot="dt-body">
          {openInlineContents
            .filter(e => e.position === 'top')
            .map(entry => renderInlineContentRow(entry, colSpan, rows))}
          {rows.length > 0
            ? (
                rows.map((row) => {
                  const rowEntry = openInlineContents.find(
                    e => e.position === 'row' && e.rowId === row.id,
                  )
                  if (rowEntry)
                    return renderInlineContentRow(rowEntry, colSpan, rows)

                  return (
                    <TableRow
                      key={row.id}
                      className={cn(
                        preset.rowClassName,
                        resolveClassName(rowClassName, row as Row<DataTableFeatures, TData>),
                        onRowClick && 'cursor-pointer',
                      )}
                      style={{ transitionProperty: 'none' }}
                      data-slot="dt-row"
                      data-state={row.getIsSelected() ? 'selected' : undefined}
                      onClick={onRowClick
                        ? (e) => {
                            if (!isInteractiveTarget(e.target))
                              onRowClick(row.original)
                          }
                        : undefined}
                    >
                      {row.getVisibleCells().map(cell => (
                        <TableCell
                          key={cell.id}
                          className={cn(preset.cellClassName, resolveClassName(cellClassName, cell as Cell<DataTableFeatures, TData, unknown>))}
                          data-slot="dt-cell"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                })
              )
            : isLoading
              ? (
                  Array.from({ length: pageSize }, (_, i) => (
                    <TableRow key={i} data-slot="dt-skeleton-row">
                      {Array.from({ length: skeletonColumns }, (_, j) => (
                        <TableCell key={j} data-slot="dt-skeleton-cell">
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )
              : (
                  <TableRow data-slot="dt-row">
                    <TableCell
                      colSpan={colSpan}
                      className="h-24 text-center"
                      data-slot="dt-empty"
                    >
                      {emptyMessage ?? 'No results.'}
                    </TableCell>
                  </TableRow>
                )}
        </TableBody>
      </Table>
    </div>
  )
}
