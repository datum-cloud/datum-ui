---
"@datum-cloud/datum-ui": minor
---

`DataTable` gains a compact "list table" surface so a plugin repo with no Tailwind build of its own (e.g. compute) can build a list page that looks like the rest of the product, and staff-portal's own `ListTable` can be refactored to consume the shared piece instead of duplicating it.

`DataTable.Content` and `DataTable.ColumnHeader` add `density?: 'default' | 'compact'`. Omitting it, or passing `'default'`, renders exactly as before. `'compact'` applies a sticky uppercase header on new `--table-header-background` / `--table-header-foreground` tokens, dense borderless rows, and swaps the sort indicator for a dual-caret icon; the existing `*ClassName` props still merge on top and win. `DataTable.Content` also gains `onRowClick`, which skips clicks on links, buttons, checkboxes, form controls, and the row-actions menu — no DOM-walking required in the caller.

`DataTable.ListPanel` is the card itself: an optional search row (uncontrolled, or driven externally via `search={{ value, onChange }}` for server-side search), an optional `toolbar` slot, a loading skeleton, and `density="compact"` content, all inside card chrome. It renders inside `DataTable.Client` / `DataTable.Server` like every other `DataTable.*` part. Pagination is a deliberate sibling, not part of the panel — render `DataTable.ListPagination` below it, which adds the page-size selector, row-count summary (`resourceLabel` appends "organizations", etc.), `hideWhenSinglePage`, and a `labels` prop, since this package ships no i18n of its own.

`SECTION_CARD_CHROME`-style card shadows also start rendering: `--section-card-shadow`, referenced by consumers via `shadow-(--section-card-shadow)` but never previously defined, now aliases the existing `--shadow` token.
