---
"@datum-cloud/datum-ui": minor
---

data-table: preserve page and selection across data changes

`createDataTableStore().setData()` previously reset `pageIndex` to 0 and
cleared `rowSelection` on every call. Any consumer whose `data` prop
changes from a background source — a websocket, a K8s watch, a polling
query — threw the reader back to page 1 on every update.

`setData` now clamps `pageIndex` into range instead of resetting it, and
prunes `rowSelection` against surviving rows when a custom `getRowId` is
supplied. Without a custom `getRowId`, TanStack falls back to array-index
ids, which are meaningless across a data change, so selection is still
cleared in that case.

Filter, search, and sort changes still reset the page — those are user
actions, not background updates.

Two notes for upgraders:

- If a table swaps datasets without remounting (e.g. a route param change
  where the provider is not keyed), it now lands on the clamped page
  rather than page 1. Key the table on the dataset id if a reset is wanted.
- `getRowId` is captured once at store creation. This is correct for
  module-level functions; an inline closure whose identity carries meaning
  will not be picked up on re-render.
