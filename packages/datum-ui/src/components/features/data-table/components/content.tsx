'use client'

import type { Cell, Row } from '@tanstack/react-table'
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

function resolveClassName<T>(
  value: string | ((item: T) => string) | undefined,
  item: T,
): string | undefined {
  if (typeof value === 'function')
    return value(item)
  return value
}

function renderInlineContentRow<TData>(
  entry: InlineContentEntry<TData>,
  colSpan: number,
  rows: Row<TData>[],
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

export function DataTableContent({
  emptyMessage,
  className,
  tableClassName,
  headerClassName,
  headerRowClassName,
  headerCellClassName,
  bodyClassName,
  rowClassName,
  cellClassName,
}: ContentProps) {
  const { rows, headerGroups, totalColumns } = useDataTableRows()
  const { isLoading, columnCount } = useDataTableLoading()
  const { pageSize } = useDataTablePagination()
  const { inlineContents } = useDataTableInlineContents()
  const openInlineContents = useMemo(() => inlineContents.filter(e => e.open), [inlineContents])
  const colSpan = totalColumns
  const skeletonColumns = totalColumns || columnCount || DEFAULT_LOADING_ROWS

  return (
    <div className={cn('datum-ui-data-table', className)} data-slot="dt" style={{ overflowX: 'auto' }}>
      <Table className={cn(tableClassName)} data-slot="dt-table">
        <TableHeader className={cn(headerClassName)} data-slot="dt-header">
          {headerGroups.map(headerGroup => (
            <TableRow key={headerGroup.id} className={cn(headerRowClassName)} data-slot="dt-header-row">
              {headerGroup.headers.map(header => (
                <TableHead key={header.id} className={cn(headerCellClassName)} data-slot="dt-header-cell">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className={cn(bodyClassName)} data-slot="dt-body">
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
                      className={cn(resolveClassName(rowClassName, row as Row<unknown>))}
                      style={{ transitionProperty: 'none' }}
                      data-slot="dt-row"
                      data-state={row.getIsSelected() ? 'selected' : undefined}
                    >
                      {row.getVisibleCells().map(cell => (
                        <TableCell
                          key={cell.id}
                          className={cn(resolveClassName(cellClassName, cell as Cell<unknown, unknown>))}
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
