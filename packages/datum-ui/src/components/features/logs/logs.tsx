import { LogsDetail } from './components/detail'
import { LogsExplorer } from './components/explorer'
import { LogsFilterGroup, LogsFilters, LogsTimeRangeFilter } from './components/filters'
import { LogsRoot } from './components/root'
import { LogsTable } from './components/table'
import { LogsLiveToggle, LogsSearch, LogsToolbar } from './components/toolbar'

export const Logs = {
  Root: LogsRoot,
  Explorer: LogsExplorer,
  Filters: LogsFilters,
  FilterGroup: LogsFilterGroup,
  TimeRangeFilter: LogsTimeRangeFilter,
  Toolbar: LogsToolbar,
  Search: LogsSearch,
  LiveToggle: LogsLiveToggle,
  Table: LogsTable,
  Detail: LogsDetail,
} as const
