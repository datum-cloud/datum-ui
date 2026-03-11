'use client'

import type { ColumnDef } from '@tanstack/react-table'
import type { SelectionColumnOptions } from '../types'
import { Checkbox } from '@repo/shadcn/ui/checkbox'

const SELECTION_COLUMN_ID = 'select'

export function createSelectionColumn<TData>(
  options: SelectionColumnOptions = {},
): ColumnDef<TData> {
  const { className, headerClassName, renderHeader, renderCell } = options

  return {
    id: SELECTION_COLUMN_ID,
    size: 40,
    enableSorting: false,
    enableHiding: false,
    header: renderHeader
      ?? (({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected()
            || (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className={headerClassName}
        />
      )),
    cell: renderCell
      ?? (({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
          className={className}
        />
      )),
  }
}

export function hasSelectionColumn<TData>(columns: ColumnDef<TData, any>[]): boolean {
  return columns.some(col => 'id' in col && col.id === SELECTION_COLUMN_ID)
}

export function withSelectionColumn<TData>(
  columns: ColumnDef<TData, any>[],
  options: SelectionColumnOptions = {},
): ColumnDef<TData, any>[] {
  if (hasSelectionColumn(columns)) {
    return columns
  }
  return [createSelectionColumn<TData>(options), ...columns]
}
