import type { ColumnDef } from '@tanstack/react-table'
import type { SelectionColumnOptions } from '../../data-table'
import type { ActionItem } from '../../more-actions'
import { createSelectionColumn, DataTableColumnHeader, DataTableRowActions } from '../../data-table'

export interface ComposeOptions<TData> {
  enableRowSelection?: boolean | SelectionColumnOptions<TData>
  enableSorting?: boolean
  rowActions?: (row: TData) => ActionItem<TData>[]
  rowActionsSheetTitle?: string
}

/** Wrap plain string headers in the sortable header; leave all other columns untouched. */
function withSortableHeaders<TData>(columns: ColumnDef<TData, unknown>[]): ColumnDef<TData, unknown>[] {
  return columns.map((col) => {
    if (typeof col.header !== 'string')
      return col
    const title = col.header
    return {
      ...col,
      enableSorting: col.enableSorting ?? true,
      header: ({ column }) => <DataTableColumnHeader column={column} title={title} />,
    } as ColumnDef<TData, unknown>
  })
}

export function composeColumns<TData>(
  columns: ColumnDef<TData, unknown>[],
  options: ComposeOptions<TData>,
): ColumnDef<TData, unknown>[] {
  const { enableRowSelection, enableSorting, rowActions, rowActionsSheetTitle } = options
  let cols = columns

  if (enableSorting)
    cols = withSortableHeaders(cols)

  if (enableRowSelection) {
    const selOpts = typeof enableRowSelection === 'object' ? enableRowSelection : {}
    cols = [createSelectionColumn<TData>(selOpts) as ColumnDef<TData, unknown>, ...cols]
  }

  if (rowActions) {
    cols = [...cols, {
      id: 'actions',
      size: 44,
      enableSorting: false,
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          actions={rowActions(row.original)}
          sheetTitle={rowActionsSheetTitle}
        />
      ),
    }]
  }

  return cols
}
