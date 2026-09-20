---
"@datum-cloud/datum-ui": minor
---

`DataTable.Content`'s `density="compact"` cell padding moves from `py-0.5` to `py-2` (~36-40px rows), matching a same-day follow-up fix to staff-portal's own list-table row height. `DataTable.ListPanel` now forwards `tableClassName`, `headerClassName`, `headerRowClassName`, `headerCellClassName`, `bodyClassName`, `rowClassName`, and `cellClassName` to its internal `DataTable.Content`, so an app-specific cell override (sizing a row-actions menu, a copy button rendered inside a cell) can actually reach the table — previously there was no way to apply one through `ListPanel`.
