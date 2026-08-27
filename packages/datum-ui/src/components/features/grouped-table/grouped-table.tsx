import type { ColumnDef, Row, RowData } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import type { DataTableFeatures } from '../data-table/core/features'
import type { GroupedTableProps } from './types'
import { flexRender, useTable } from '@tanstack/react-table'
import { ChevronRight } from 'lucide-react'
import { useMemo } from 'react'
import { cn } from '../../../utils/cn'
import { Collapsible, CollapsibleTrigger } from '../../base/collapsible'
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../base/table'
import { Icon } from '../../icons/icon-wrapper'
import { rowMatchesSearch } from '../data-table'
import { dataTableFeatures } from '../data-table/core/features'
import { GroupedSkeleton } from './components/grouped-skeleton'
import { GroupedToolbar } from './components/grouped-toolbar'
import { bucketRows } from './lib/bucket-rows'
import { composeColumns } from './lib/compose-columns'
import { sortRows } from './lib/sort-rows'
import { useControllableState } from './lib/use-controllable-state'
import { useGroupedExpansion } from './use-grouped-expansion'

/** Floor width for unsized (flex) columns so they keep their share instead of collapsing on narrow viewports. */
const MIN_FLEX_COLUMN_WIDTH = 120

function columnWidth<TData extends RowData>(col: ColumnDef<DataTableFeatures, TData, unknown>): string {
  return typeof col.size === 'number' ? `${col.size}px` : 'auto'
}

/** Minimum width the table track needs so every column keeps a usable size; below this the area scrolls horizontally. */
function trackMinWidth<TData extends RowData>(resolvedColumns: ColumnDef<DataTableFeatures, TData, unknown>[]): number {
  return resolvedColumns.reduce(
    (total, col) => total + (typeof col.size === 'number' ? col.size : MIN_FLEX_COLUMN_WIDTH),
    0,
  )
}

/**
 * Plain-text column label for the per-group screen-reader-only header.
 * Sortable columns wrap their string header in an interactive component, so we
 * fall back to the accessor key; the injected selection/actions columns get
 * generic labels. Interactive header controls are intentionally NOT duplicated.
 */
function columnTitle<TData extends RowData>(col: ColumnDef<DataTableFeatures, TData, unknown>): string {
  if (typeof col.header === 'string')
    return col.header
  if (col.id === 'select')
    return 'Select'
  if (col.id === 'actions')
    return 'Actions'
  const accessorKey = (col as { accessorKey?: unknown }).accessorKey
  return typeof accessorKey === 'string' ? accessorKey : ''
}

function renderColGroup<TData extends RowData>(resolvedColumns: ColumnDef<DataTableFeatures, TData, unknown>[]): ReactNode {
  return (
    <colgroup>
      {resolvedColumns.map((col, i) => (
        <col key={`col-${i}`} style={{ width: columnWidth(col) }} />
      ))}
    </colgroup>
  )
}

/** Resolve a static or per-item className override (mirrors data-table). */
function resolveClassName<T>(value: string | ((item: T) => string) | undefined, item: T): string | undefined {
  return typeof value === 'function' ? value(item) : value
}

export function GroupedTable<TData extends RowData>(props: GroupedTableProps<TData>) {
  const {
    columns,
    groups,
    defaultExpanded,
    expanded,
    onExpandedChange,
    getRowId,
    enableRowSelection,
    rowSelection: rowSelectionProp,
    onRowSelectionChange,
    rowActions,
    rowActionsSheetTitle,
    enableSorting,
    sorting: sortingProp,
    onSortingChange,
    enableSearch,
    searchPlaceholder,
    searchableColumns,
    searchFn,
    search: searchProp,
    onSearchChange,
    searchDebounceMs,
    isLoading,
    empty,
    className,
    toolbarClassName,
    tableClassName,
    headerRowClassName,
    headerCellClassName,
    groupHeaderClassName,
    bodyClassName,
    rowClassName,
    cellClassName,
  } = props

  const [sorting, setSorting] = useControllableState(sortingProp, [], onSortingChange)
  const [rowSelection, setRowSelection] = useControllableState(rowSelectionProp, {}, onRowSelectionChange)
  const [search, setSearch] = useControllableState(searchProp, '', onSearchChange)
  const isSearching = search.trim().length > 0

  const { isOpen, toggle } = useGroupedExpansion(groups, { defaultExpanded, expanded, onExpandedChange })

  const resolvedColumns = useMemo(
    () => composeColumns(columns, { enableRowSelection, enableSorting, rowActions, rowActionsSheetTitle }),
    [columns, enableRowSelection, enableSorting, rowActions, rowActionsSheetTitle],
  )

  const minWidth = useMemo(() => trackMinWidth(resolvedColumns), [resolvedColumns])

  const flatData = useMemo(() => groups.flatMap(g => g.rows), [groups])

  const table = useTable({
    features: dataTableFeatures,
    data: flatData,
    columns: resolvedColumns,
    state: {
      sorting,
      rowSelection,
      globalFilter: search,
      // GroupedTable is not a paged table. The shared feature set still
      // registers pagination, and TanStack's default pageSize (10) would
      // silently drop every row after the first page — later groups render
      // as open headers with empty bodies.
      pagination: { pageIndex: 0, pageSize: Math.max(flatData.length, 1) },
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setSearch,
    enableRowSelection: Boolean(enableRowSelection),
    manualSorting: true,
    enableMultiSort: false,
    globalFilterFn: (row, _columnId, value) =>
      rowMatchesSearch(row.original as TData, String(value ?? ''), { searchFn, searchableColumns }),
    getRowId,
  })

  const headerGroups = table.getHeaderGroups()
  const coreRows = table.getCoreRowModel().rows
  const filteredRows = table.getFilteredRowModel().rows

  const buckets = useMemo(
    () => bucketRows(groups, coreRows, filteredRows),
    [groups, coreRows, filteredRows],
  )

  const slices = useMemo(
    () => groups.map(g => ({
      group: g,
      id: g.id,
      title: g.title,
      meta: g.meta,
      rows: sortRows(buckets.get(g.id) ?? [], sorting),
    })),
    [groups, buckets, sorting],
  )
  const visibleSlices = isSearching ? slices.filter(s => s.rows.length > 0) : slices

  // `scrollable` wraps the tables in a single min-width track inside an x-scroll
  // container, so on narrow viewports columns keep their widths and the whole
  // grid (header + every group) scrolls together instead of collapsing/clipping.
  const renderShell = (body: ReactNode, scrollable: boolean) => (
    <div className={cn('w-full', className)}>
      {enableSearch && (
        <GroupedToolbar
          search={search}
          onSearchChange={setSearch}
          placeholder={searchPlaceholder}
          debounceMs={searchDebounceMs}
          className={toolbarClassName}
        />
      )}
      <div className={cn('w-full rounded-md border', scrollable ? 'overflow-x-auto' : 'overflow-hidden')}>
        {scrollable ? <div style={{ minWidth }}>{body}</div> : body}
      </div>
    </div>
  )

  if (isLoading)
    return renderShell(<GroupedSkeleton columns={resolvedColumns.length} />, false)

  if (flatData.length === 0 || (isSearching && visibleSlices.length === 0))
    return renderShell(empty ?? null, false)

  return renderShell(
    <>
      <table className={cn('w-full table-fixed text-sm', tableClassName)}>
        {renderColGroup(resolvedColumns)}
        <TableHeader>
          {headerGroups.map(hg => (
            <TableRow key={hg.id} className={headerRowClassName}>
              {hg.headers.map(header => (
                <TableHead key={header.id} scope="col" className={headerCellClassName}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
      </table>

      {visibleSlices.map((slice, sliceIndex) => {
        const open = isSearching ? true : isOpen(slice.id)
        return (
          <Collapsible
            key={slice.id}
            open={open}
            data-slot="grouped-table-group"
            // One divider above every group after the first, open or closed.
            // Putting it here (a div) rather than the trigger avoids button
            // preflight swallowing `border-t`, and avoids stacking a closed
            // header's `border-b` against the next group's `border-t`.
            className={cn(sliceIndex > 0 && 'border-border border-t')}
            // While searching, groups are force-opened; swallow toggles so a
            // header click doesn't silently flip the stored expansion state
            // (which would surface unexpectedly once the search is cleared).
            onOpenChange={() => {
              if (!isSearching)
                toggle(slice.id)
            }}
          >
            <CollapsibleTrigger
              className={cn(
                'flex h-10 w-full items-center gap-2 bg-muted/40 px-2 text-left align-middle text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                resolveClassName(groupHeaderClassName, slice.group),
              )}
            >
              <Icon
                icon={ChevronRight}
                aria-hidden
                className={cn('size-4 shrink-0 transition-transform', open && 'rotate-90')}
              />
              <span>{slice.title}</span>
              {slice.meta != null && (
                <span className="ml-auto flex items-center gap-2 font-medium">{slice.meta}</span>
              )}
            </CollapsibleTrigger>

            {/*
              Do not use Radix CollapsibleContent. It measures
              `--radix-collapsible-content-height` on mount via
              getBoundingClientRect; later groups often measure as 0px
              (overflow-x-auto computes overflow-y to auto, so rows below
              the first paint box get a zero rect). Removing the height
              animation in 2.3.1 was not enough — the wrapper still clips.
            */}
            {open && (
              <div data-slot="grouped-table-group-content">
                <table
                  className={cn('w-full table-fixed text-sm', tableClassName)}
                  aria-label={typeof slice.title === 'string' ? slice.title : undefined}
                >
                  {renderColGroup(resolvedColumns)}
                  {/*
                    Each group is its own <table>, so it needs its own column
                    headers for screen readers to associate cells with columns
                    (header/cell association cannot cross table boundaries). This
                    header is visually hidden and non-interactive — the visible,
                    interactive header lives in the shared header table above.
                  */}
                  <TableHeader className="sr-only">
                    <TableRow>
                      {resolvedColumns.map((col, i) => (
                        <TableHead key={`group-header-${i}`} scope="col">
                          {columnTitle(col)}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody className={bodyClassName}>
                    {slice.rows.map((row: Row<DataTableFeatures, TData>, rowIndex) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() ? 'selected' : undefined}
                        className={cn(
                          rowIndex === 0 && 'border-t',
                          resolveClassName(rowClassName, row),
                        )}
                      >
                        {row.getVisibleCells().map(cell => (
                          <TableCell key={cell.id} className={resolveClassName(cellClassName, cell)}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </table>
              </div>
            )}
          </Collapsible>
        )
      })}
    </>,
    true,
  )
}
