import type { ColumnDef, RowSelectionState, SortingState } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import type { SelectionColumnOptions } from '../data-table/types'
import type { ActionItem } from '../more-actions/types'

export type DefaultExpanded = 'all' | 'none' | string[]

export interface GroupedTableGroup<TData> {
  /** Stable key used for expand state. */
  id: string
  /** Group header label. */
  title: ReactNode
  /** Right-aligned header slot — count, badges, actions. */
  meta?: ReactNode
  rows: TData[]
  /** Per-group override of the table-level default. */
  defaultOpen?: boolean
}

export interface GroupedTableProps<TData> {
  /** TanStack column defs. `size` (px) drives the shared grid template; unsized columns flex. */
  columns: ColumnDef<TData, unknown>[]
  groups: GroupedTableGroup<TData>[]
  /** Uncontrolled initial state. Default `'all'`. A string[] opens exactly those ids. */
  defaultExpanded?: DefaultExpanded
  /** Controlled open ids. When set, the component does not own expansion state. */
  expanded?: string[]
  onExpandedChange?: (openIds: string[]) => void
  /**
   * Stable row identity, passed through to TanStack. Supply this when consumers
   * reorder rows or groups so React keys stay stable across renders instead of
   * defaulting to the flattened row index.
   */
  getRowId?: (row: TData, index: number) => string

  /** Prepend a checkbox column; pass options to customize. */
  enableRowSelection?: boolean | SelectionColumnOptions
  rowSelection?: RowSelectionState
  onRowSelectionChange?: (selection: RowSelectionState) => void

  /** Append a "⋯" actions column. Receives the row to allow conditional actions. */
  rowActions?: (row: TData) => ActionItem<TData>[]
  rowActionsSheetTitle?: string

  /** Enable sortable headers; sorting is applied within each group. */
  enableSorting?: boolean
  sorting?: SortingState
  onSortingChange?: (sorting: SortingState) => void

  /** Render a built-in debounced search input above the table. */
  enableSearch?: boolean
  searchPlaceholder?: string
  searchableColumns?: string[]
  searchFn?: (row: TData, query: string) => boolean
  search?: string
  onSearchChange?: (search: string) => void
  searchDebounceMs?: number

  /** Render a skeleton instead of rows. */
  isLoading?: boolean

  /** Rendered when there are no groups, every group is empty, or search clears everything. */
  empty?: ReactNode
  className?: string
}
