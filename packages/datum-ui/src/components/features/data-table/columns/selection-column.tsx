'use client'

import type { ColumnDef, RowData } from '@tanstack/react-table'
import type { DataTableFeatures } from '../core/features'
import type { SelectionColumnOptions } from '../types'
import { Checkbox } from '../../../base/checkbox'

const SELECTION_COLUMN_ID = 'select'

export function createSelectionColumn<TData extends RowData>(
  options: SelectionColumnOptions<TData> = {},
): ColumnDef<DataTableFeatures, TData> {
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

export function hasSelectionColumn<TData extends RowData>(columns: ColumnDef<DataTableFeatures, TData, any>[]): boolean {
  return columns.some(col => 'id' in col && col.id === SELECTION_COLUMN_ID)
}

export function withSelectionColumn<TData extends RowData>(
  columns: ColumnDef<DataTableFeatures, TData, any>[],
  options: SelectionColumnOptions<TData> = {},
): ColumnDef<DataTableFeatures, TData, any>[] {
  if (hasSelectionColumn(columns)) {
    return columns
  }
  return [createSelectionColumn<TData>(options), ...columns]
}
