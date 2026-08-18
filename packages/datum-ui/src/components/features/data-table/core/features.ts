import {
  columnFilteringFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/react-table'

/**
 * The single TanStack Table v9 feature set used by every table in this package.
 *
 * v9 made features opt-in and threaded a `TFeatures` generic through every
 * public type (`ColumnDef<TFeatures, TData, TValue>`, `Row<TFeatures, TData>`,
 * ...). Leaving that generic open would push the parameter into every exported
 * type in this library and force consumers to thread it through their own code.
 *
 * Declaring one concrete feature set and referencing `DataTableFeatures`
 * internally keeps our public types parameterised on `TData` alone, which is
 * what they were in v8.
 *
 * `data-table` needs sorting, pagination and row selection; `grouped-table`
 * additionally needs global filtering for its search box. Both need column
 * sizing (`columnDef.size` drives the shared grid template) and column
 * visibility (`enableHiding` on the injected selection column). The set is the
 * union rather than `stockFeatures` so unused features stay out of the bundle.
 */
export const dataTableFeatures = tableFeatures({
  columnFilteringFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns,
  sortFns,
})

export type DataTableFeatures = typeof dataTableFeatures
