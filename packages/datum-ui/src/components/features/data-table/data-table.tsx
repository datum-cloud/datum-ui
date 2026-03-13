'use client'

import { DataTableActiveFilters } from './components/active-filters'
import { DataTableBulkActions } from './components/bulk-actions'
import { DataTableColumnHeader } from './components/column-header'
import { DataTableContent } from './components/content'
import { DataTableInlineContent } from './components/inline-content'
import { DataTableLoading } from './components/loading'
import { DataTablePagination } from './components/pagination'
import { DataTableRowActions } from './components/row-actions'
import { DataTableSearch } from './components/search'
import { ClientProvider } from './core/client-provider'
import { ServerProvider } from './core/server-provider'
import { CheckboxFilter } from './filters/checkbox-filter'
import { DatePickerFilter } from './filters/date-picker-filter'
import { SelectFilter } from './filters/select-filter'

export const DataTable = {
  Client: ClientProvider,
  Server: ServerProvider,
  ActiveFilters: DataTableActiveFilters,
  Content: DataTableContent,
  InlineContent: DataTableInlineContent,
  ColumnHeader: DataTableColumnHeader,
  Pagination: DataTablePagination,
  Search: DataTableSearch,
  RowActions: DataTableRowActions,
  BulkActions: DataTableBulkActions,
  Loading: DataTableLoading,
  SelectFilter,
  CheckboxFilter,
  DatePickerFilter,
} as const
