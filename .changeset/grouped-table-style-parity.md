---
"@datum-cloud/datum-ui": minor
---

GroupedTable: align header/body/cell styling with `data-table`, restyle the group band as a muted section header (subtle fill, matching the column header), and drop cell truncation. Adds slot-level `className` overrides mirroring data-table — `tableClassName`, `headerRowClassName`, `headerCellClassName`, `groupHeaderClassName` (`string | (group) => string`), `bodyClassName`, `rowClassName` (`string | (row) => string`), `cellClassName` (`string | (cell) => string`), and `toolbarClassName`.
