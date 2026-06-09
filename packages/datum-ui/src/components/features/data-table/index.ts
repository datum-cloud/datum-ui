// Adapters
export { useNuqsAdapter } from './adapters/nuqs-adapter'

export type { UseNuqsAdapterOptions } from './adapters/nuqs-adapter'
// Columns
export { createSelectionColumn } from './columns/selection-column'

// Components (reusable, context-free)
export { DataTableColumnHeader } from './components/column-header'
export { DataTableRowActions } from './components/row-actions'

// Constants
export {
  DEFAULT_DEBOUNCE_MS,
  DEFAULT_LOADING_ROWS,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZES,
} from './constants'
// Search utilities (reused by grouped-table)
export { resolvePath, rowMatchesSearch } from './core/filter-engine'

export type { SearchConfig } from './core/filter-engine'
// Store
export { createDataTableStore } from './core/store'

// Namespace (primary API)
export { DataTable } from './data-table'
// Hooks
export {
  useDataTableFilters,
  useDataTableInlineContents,
  useDataTableLoading,
  useDataTablePagination,
  useDataTableRows,
  useDataTableSearch,
  useDataTableSelection,
  useDataTableSorting,
} from './hooks/use-selectors'

// Types
export type {
  ActionItem,
  ActiveFiltersProps,
  BulkActionsProps,
  ClientPaginationState,
  ColumnHeaderProps,
  ContentProps,
  CreateStoreOptions,
  DataTableClientProps,
  DataTableContextValue,
  DataTableServerProps,
  DataTableState,
  DataTableStore,
  DataTableStoreState,
  FilterCheckboxProps,
  FilterDatePickerProps,
  FilterOption,
  FilterSelectProps,
  FilterStrategy,
  FilterValue,
  InlineContentEntry,
  InlineContentProps,
  InlineContentRenderParams,
  LoadingProps,
  PaginationProps,
  PaginationState,
  RowActionsProps,
  SearchProps,
  SelectionColumnOptions,
  ServerFetchArgs,
  ServerPaginationState,
  ServerTransformResult,
  StateAdapter,
  UseDataTableClientOptions,
  UseDataTableServerOptions,
} from './types'
