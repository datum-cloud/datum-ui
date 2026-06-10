import type { ColumnDef, Row } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import type { GroupedTableProps } from './types'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ChevronRight } from 'lucide-react'
import { useMemo } from 'react'
import { cn } from '../../../utils/cn'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../base/collapsible'
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../base/table'
import { Icon } from '../../icons/icon-wrapper'
import { rowMatchesSearch } from '../data-table'
import { GroupedSkeleton } from './components/grouped-skeleton'
import { GroupedToolbar } from './components/grouped-toolbar'
import { bucketRows } from './lib/bucket-rows'
import { composeColumns } from './lib/compose-columns'
import { sortRows } from './lib/sort-rows'
import { useControllableState } from './lib/use-controllable-state'
import { useGroupedExpansion } from './use-grouped-expansion'

/** Floor width for unsized (flex) columns so they keep their share instead of collapsing on narrow viewports. */
const MIN_FLEX_COLUMN_WIDTH = 120

function columnWidth<TData>(col: ColumnDef<TData, unknown>): string {
  return typeof col.size === 'number' ? `${col.size}px` : 'auto'
}

/** Minimum width the table track needs so every column keeps a usable size; below this the area scrolls horizontally. */
function trackMinWidth<TData>(resolvedColumns: ColumnDef<TData, unknown>[]): number {
  return resolvedColumns.reduce(
    (total, col) => total + (typeof col.size === 'number' ? col.size : MIN_FLEX_COLUMN_WIDTH),
    0,
  )
}

function renderColGroup<TData>(resolvedColumns: ColumnDef<TData, unknown>[]): ReactNode {
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

export function GroupedTable<TData>(props: GroupedTableProps<TData>) {
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

  const table = useReactTable({
    data: flatData,
    columns: resolvedColumns,
    state: { sorting, rowSelection, globalFilter: search },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setSearch,
    enableRowSelection: Boolean(enableRowSelection),
    manualSorting: true,
    enableMultiSort: false,
    globalFilterFn: (row, _columnId, value) =>
      rowMatchesSearch(row.original as TData, String(value ?? ''), { searchFn, searchableColumns }),
    getRowId,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const headerGroups = table.getHeaderGroups()
  const coreRows = table.getCoreRowModel().rows
  const filteredRows = table.getRowModel().rows

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

      {visibleSlices.map((slice) => {
        const open = isSearching ? true : isOpen(slice.id)
        return (
          <Collapsible key={slice.id} open={open} onOpenChange={() => toggle(slice.id)}>
            <CollapsibleTrigger
              className={cn(
                'flex h-10 w-full items-center gap-2 border-b bg-muted/40 px-2 text-left align-middle text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
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

            <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
              <table
                className={cn('w-full table-fixed text-sm', tableClassName)}
                aria-label={typeof slice.title === 'string' ? slice.title : undefined}
              >
                {renderColGroup(resolvedColumns)}
                <TableBody className={bodyClassName}>
                  {slice.rows.map((row: Row<TData>) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() ? 'selected' : undefined}
                      className={resolveClassName(rowClassName, row)}
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
            </CollapsibleContent>
          </Collapsible>
        )
      })}
    </>,
    true,
  )
}
