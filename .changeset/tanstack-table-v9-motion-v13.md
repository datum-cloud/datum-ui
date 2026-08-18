---
"@datum-cloud/datum-ui": major
---

Upgrade TanStack Table to v9 and Motion to v13. Both are declared peer dependencies, so the peer ranges move and this is a breaking release.

## `@tanstack/react-table` `>=8.21.3 <9` → `>=9 <10`

**Action required if you write your own column definitions.** TanStack Table v9 made features opt-in and threaded a `TFeatures` generic through every public type. `ColumnDef`, `Row`, `Cell`, `Column`, `Table` and `HeaderGroup` all take the feature set as their **first** type argument.

This package exports the feature set it builds tables with, so you can reference it directly instead of constructing your own:

```diff
- import type { ColumnDef } from '@tanstack/react-table'
+ import type { ColumnDef } from '@tanstack/react-table'
+ import type { DataTableFeatures } from '@datum-cloud/datum-ui/data-table'

- const columns: ColumnDef<User, unknown>[] = [ ... ]
+ const columns: ColumnDef<DataTableFeatures, User, unknown>[] = [ ... ]
```

The same applies to any `Row<User>`, `Cell<User, unknown>` or `Table<User>` annotation in your own code — add `DataTableFeatures` as the first argument.

**`TData` is now constrained.** v9 declares `TData extends RowData`, where `RowData` is `Record<string, any> | Array<any>`. Row types that were previously `unknown` or a primitive no longer type-check; use an object type.

Component props are otherwise unchanged — `DataTable`, `GroupedTable`, `useDataTableClient`, `useDataTableServer` and every sub-component keep the same names, options and behaviour, and still take a single `<TData>` parameter. The feature generic is resolved internally rather than pushed onto your call sites.

Internally the tables moved from `useReactTable` to `useTable` with an explicit feature set (`columnFiltering`, `columnSizing`, `columnVisibility`, `globalFiltering`, `rowPagination`, `rowSelection`, `rowSorting`), so unused v8 features no longer ship in the bundle. The `getCoreRowModel` / `getSortedRowModel` / `getPaginationRowModel` / `getFilteredRowModel` options are gone — the row models are registered on the feature set instead.

`useTableInstance` and `useTableInstanceOrNull` now return v9's `ReactTable` type rather than `Table`. `ReactTable` is `Omit<Table, 'store'>` plus a reactive store, so any code that only reads rows, columns and state is unaffected.

## `motion` `>=12 <13` → `>=13 <14`

No API change. Motion 13 drops `@emotion/is-prop-valid` as an optional dependency in favour of explicit injection, which only affects Styled Components and Emotion users. This package styles with Tailwind, and all `motion` / `AnimatePresence` usage is unchanged.

If you use a CSS-in-JS library alongside Motion, either provide `@emotion/is-prop-valid` through `MotionConfig` or let the styling library own DOM prop forwarding.

---

All 1016 tests pass, lint reports 0 errors, and build and typecheck are green across every workspace package.
