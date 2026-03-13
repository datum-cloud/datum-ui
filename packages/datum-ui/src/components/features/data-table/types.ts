import type {
  Cell,
  Column,
  ColumnDef,
  Row,
  RowSelectionState,
  SortingState,
  Table,
} from '@tanstack/react-table'
import type { ComponentType, ReactNode } from 'react'

// ── Action Types ──

export interface ActionItem<TData> {
  readonly label: string
  readonly icon?: ComponentType<{ className?: string }>
  readonly variant?: 'default' | 'destructive'
  readonly onClick: (row: TData) => void | Promise<void>
  readonly disabled?: boolean | ((row: TData) => boolean)
  readonly hidden?: boolean | ((row: TData) => boolean)
}

// ── Filter Types ──

export interface FilterOption {
  readonly label: string
  readonly value: string
}

export type FilterValue = Record<string, unknown>

// ── Pagination Types ──

export interface ClientPaginationState {
  readonly pageIndex: number
  readonly pageSize: number
  readonly setPageIndex: (index: number) => void
  readonly setPageSize: (size: number) => void
}

export interface ServerPaginationState {
  readonly cursor: string | undefined
  readonly limit: number
  readonly hasNextPage: boolean
  readonly hasPrevPage: boolean
  readonly nextPage: () => void
  readonly prevPage: () => void
  readonly setLimit: (limit: number) => void
}

export interface PaginationState {
  readonly canNextPage: boolean
  readonly canPrevPage: boolean
  readonly nextPage: () => void
  readonly prevPage: () => void
  readonly pageIndex?: number
  readonly pageCount?: number
  readonly setPageIndex?: (index: number) => void
  readonly pageSize: number
  readonly setPageSize: (size: number) => void
}

// ── State Adapter ──

export interface DataTableState {
  readonly sorting: SortingState
  readonly filters: FilterValue
  readonly search: string
  readonly pageIndex?: number
  readonly pageSize?: number
  readonly cursor?: string
  readonly limit?: number
}

export interface StateAdapter {
  readonly read: () => Partial<DataTableState>
  readonly write: (state: DataTableState) => void
}

// ── Server Fetch ──

export interface ServerFetchArgs {
  readonly cursor?: string
  readonly limit: number
  readonly sorting: SortingState
  readonly filters: FilterValue
  readonly search: string
}

export interface ServerTransformResult<TData> {
  readonly data: TData[]
  readonly cursor?: string
  readonly hasNextPage: boolean
}

// ── Inline Content ──

export interface InlineContentRenderParams<TData> {
  readonly onClose: () => void
  readonly rowData: TData | null
}

export interface InlineContentEntry<TData> {
  readonly id: string
  readonly position: 'top' | 'row'
  readonly rowId?: string
  readonly open: boolean
  readonly onClose: () => void
  readonly className?: string
  readonly render: (params: InlineContentRenderParams<TData>) => ReactNode
}

export interface InlineContentProps<TData> {
  readonly position: 'top' | 'row'
  readonly rowId?: string
  readonly open: boolean
  readonly onClose: () => void
  readonly className?: string
  readonly children: (params: InlineContentRenderParams<TData>) => ReactNode
}

// ── Selection Column ──

export interface SelectionColumnOptions {
  /** CSS class for cell checkboxes */
  readonly className?: string
  /** CSS class for header checkbox */
  readonly headerClassName?: string
  /** Custom header render (replaces default "select all" checkbox) */
  readonly renderHeader?: (props: { table: Table<any> }) => ReactNode
  /** Custom cell render (replaces default row checkbox) */
  readonly renderCell?: (props: { row: Row<any> }) => ReactNode
}

// ── Context ──

export interface DataTableContextValue<TData> {
  readonly table: Table<TData>
  readonly mode: 'client' | 'server'
  readonly sorting: SortingState
  readonly filters: FilterValue
  readonly search: string
  readonly rowSelection: RowSelectionState
  readonly isLoading: boolean
  readonly setSorting: (sorting: SortingState) => void
  readonly setFilter: (key: string, value: unknown) => void
  readonly clearFilter: (key: string) => void
  readonly clearAllFilters: () => void
  readonly setSearch: (search: string) => void
  readonly clearSearch: () => void
  readonly setRowSelection: (selection: RowSelectionState) => void
  readonly pagination: PaginationState
  readonly inlineContents: readonly InlineContentEntry<TData>[]
  readonly registerInlineContent: (entry: InlineContentEntry<TData>) => void
  readonly unregisterInlineContent: (id: string) => void
}

// ── Hook Options ──

export interface UseDataTableClientOptions<TData> {
  readonly data: TData[]
  readonly columns: ColumnDef<TData, any>[]
  readonly pageSize?: number
  readonly getRowId?: (row: TData) => string
  readonly enableRowSelection?: boolean | SelectionColumnOptions
  readonly defaultSort?: SortingState
  readonly defaultFilters?: FilterValue
  readonly searchableColumns?: string[]
  readonly searchFn?: (row: TData, search: string) => boolean
  readonly filterFns?: Record<string, (cellValue: unknown, filterValue: unknown) => boolean>
  readonly stateAdapter?: StateAdapter
}

export interface UseDataTableServerOptions<TResponse, TData> {
  readonly columns: ColumnDef<TData, any>[]
  readonly fetchFn: (args: ServerFetchArgs) => Promise<TResponse>
  readonly transform: (response: TResponse) => ServerTransformResult<TData>
  readonly limit?: number
  readonly getRowId?: (row: TData) => string
  readonly enableRowSelection?: boolean | SelectionColumnOptions
  readonly defaultSort?: SortingState
  readonly defaultFilters?: FilterValue
  readonly stateAdapter?: StateAdapter
}

// ── Component Props ──

interface DataTableBaseProps<TData> {
  readonly data: TData[]
  readonly columns: ColumnDef<TData, any>[]
  readonly sorting: SortingState
  readonly setSorting: (sorting: SortingState) => void
  readonly filters: FilterValue
  readonly setFilter: (key: string, value: unknown) => void
  readonly clearFilter: (key: string) => void
  readonly clearAllFilters: () => void
  readonly search: string
  readonly setSearch: (search: string) => void
  readonly clearSearch: () => void
  readonly rowSelection: RowSelectionState
  readonly setRowSelection: (selection: RowSelectionState) => void
  readonly getRowId?: (row: TData) => string
  readonly enableRowSelection?: boolean | SelectionColumnOptions
  readonly className?: string
  readonly children: ReactNode
}

export interface DataTableClientProps<TData> extends DataTableBaseProps<TData> {
  readonly pagination: ClientPaginationState
  readonly searchableColumns?: string[]
  readonly searchFn?: (row: TData, search: string) => boolean
}

export interface DataTableServerProps<TData> extends DataTableBaseProps<TData> {
  readonly isLoading: boolean
  readonly pagination: ServerPaginationState
}

export interface SearchProps {
  readonly placeholder?: string
  readonly debounceMs?: number
  readonly className?: string
  readonly disabled?: boolean
}

export interface FilterSelectProps {
  readonly column: string
  readonly label: string
  readonly options: readonly FilterOption[]
  readonly placeholder?: string
  readonly searchable?: boolean
  readonly className?: string
  readonly selectPopoverClassName?: string
  readonly disabled?: boolean
}

export interface FilterDatePickerProps {
  readonly column: string
  readonly label: string
  readonly className?: string
  readonly datePickerPopoverClassName?: string
  readonly disableFuture?: boolean
  readonly disablePast?: boolean
  readonly minDate?: Date
  readonly maxDate?: Date
  readonly disabled?: boolean
}

export interface FilterCheckboxProps {
  readonly column: string
  readonly label: string
  readonly options: readonly FilterOption[]
  readonly className?: string
  readonly checkboxPopoverClassName?: string
  readonly disabled?: boolean
}

export interface ColumnHeaderProps<TData, TValue> {
  readonly column: Column<TData, TValue>
  readonly title: string
  readonly className?: string
}

export interface RowActionsProps<TData> {
  readonly row: Row<TData>
  readonly actions: readonly ActionItem<TData>[]
  readonly isLoading?: boolean
  readonly className?: string
}

export interface BulkActionsProps<TData> {
  readonly children: (selectedRows: TData[]) => ReactNode
  readonly className?: string
}

export interface ContentProps<TData = unknown> {
  readonly emptyMessage?: ReactNode
  readonly className?: string
  readonly tableClassName?: string
  readonly headerClassName?: string
  readonly headerRowClassName?: string
  readonly headerCellClassName?: string
  readonly bodyClassName?: string
  readonly rowClassName?: string | ((row: Row<TData>) => string)
  readonly cellClassName?: string | ((cell: Cell<TData, unknown>) => string)
}

export interface PaginationProps {
  readonly pageSizes?: readonly number[]
  readonly className?: string
}

export interface ActiveFiltersProps {
  /** Label shown before filter groups. Set to `null` to hide. Default: "Selected Filters" */
  readonly label?: string | null
  /** Column keys to exclude from the active filters display. The filters still apply to data, they just won't appear as badges. Use `'search'` to hide the search badge. */
  readonly excludeFilters?: readonly string[]
  /** Maps column keys to human-readable names */
  readonly filterLabels?: Record<string, string>
  /** Per-column value formatter for badge display. Keys support dot notation (e.g. `'status.approval'`). */
  readonly formatFilterValue?: Readonly<Record<string, (value: any) => string>>
  /** Controls the clear-all action appearance. Default: "icon" (X icon only) */
  readonly clearAll?: 'icon' | 'button' | 'text'
  /** Label for the clear-all action when using "button" or "text" mode. Default: "Clear all" */
  readonly clearAllLabel?: string
  /** CSS class for the root container */
  readonly className?: string
  /** CSS class for the filter group boxes */
  readonly groupClassName?: string
  /** CSS class for filter value badges */
  readonly badgeClassName?: string
}

export interface LoadingProps {
  readonly rows?: number
  readonly columns?: number
  readonly className?: string
}

// ── Store Types ──

export type FilterStrategy = 'checkbox' | 'select' | 'date-gte' | 'date-lte'
  | ((cellValue: unknown, filterValue: unknown) => boolean)

export interface DataTableStoreState<TData> {
  readonly data: TData[]
  readonly filteredData: TData[]
  readonly sorting: SortingState
  readonly filters: FilterValue
  readonly search: string
  readonly rowSelection: RowSelectionState
  readonly pageIndex: number
  readonly pageSize: number
  readonly columnCount: number
  readonly mode: 'client' | 'server'
  readonly isLoading: boolean
  readonly error: Error | null
  readonly inlineContents: readonly InlineContentEntry<TData>[]
  /** Monotonic counter incremented on every state change. Used by table-dependent selectors to detect updates. */
  readonly _version: number
}

export interface DataTableStore<TData> {
  readonly getSnapshot: () => DataTableStoreState<TData>
  readonly subscribe: (listener: () => void) => () => void
  readonly setData: (data: TData[]) => void
  readonly setServerData: (data: TData[]) => void
  readonly setSorting: (sorting: SortingState) => void
  readonly setFilter: (key: string, value: unknown) => void
  readonly clearFilter: (key: string) => void
  readonly clearAllFilters: () => void
  readonly setSearch: (search: string) => void
  readonly clearSearch: () => void
  readonly setRowSelection: (selection: RowSelectionState) => void
  readonly setPageIndex: (index: number) => void
  readonly setPageSize: (size: number) => void
  readonly setPagination: (pageIndex: number, pageSize: number) => void
  readonly setLoading: (loading: boolean) => void
  readonly setError: (error: Error | null) => void
  readonly registerFilter: (column: string, strategy: FilterStrategy) => void
  readonly unregisterFilter: (column: string) => void
  readonly registerInlineContent: (entry: InlineContentEntry<TData>) => void
  readonly unregisterInlineContent: (id: string) => void
}

export interface CreateStoreOptions<TData> {
  readonly data: TData[]
  readonly mode: 'client' | 'server'
  readonly defaultSort?: SortingState
  readonly defaultFilters?: FilterValue
  readonly pageSize?: number
  readonly searchableColumns?: string[]
  readonly searchFn?: (row: TData, query: string) => boolean
  readonly filterFns?: Record<string, (cellValue: unknown, filterValue: unknown) => boolean>
  readonly isLoading?: boolean
  readonly columnCount?: number
}
