'use client'

import type { RowData } from '@tanstack/react-table'
import type { ListPanelProps } from '../types'
import { Search } from 'lucide-react'
import { cn } from '../../../../utils/cn'
import { Input } from '../../../base/input'
import { Skeleton } from '../../../base/skeleton'
import { useDataTableRows } from '../hooks/use-selectors'
import { DataTableContent } from './content'
import { DataTableSearch } from './search'

const LOADING_SKELETON_ROWS = 8

const SEARCH_INPUT_CLASS
  = 'h-10 border-0 bg-transparent pl-9 shadow-none focus-visible:shadow-none focus-visible:ring-0'

function ListPanelSkeleton({ columnCount }: { readonly columnCount: number }) {
  const cols = Math.max(columnCount, 1)
  return (
    <div className="min-h-0 flex-1 overflow-hidden" data-slot="dt-list-panel-loading" aria-busy="true">
      <div className="border-border bg-table-header-background flex h-9 items-center border-b px-4">
        {Array.from({ length: cols }, (_, i) => (
          <div key={i} className="min-w-0 flex-1 px-2 first:pl-0 last:pr-0">
            <Skeleton className="h-2.5 w-16" />
          </div>
        ))}
      </div>
      {Array.from({ length: LOADING_SKELETON_ROWS }, (_, row) => (
        <div
          key={row}
          className="border-border flex h-8 items-center border-b px-4"
          data-slot="dt-list-panel-skeleton-row"
        >
          {Array.from({ length: cols }, (_, col) => (
            <div key={col} className="min-w-0 flex-1 px-2 first:pl-0 last:pr-0">
              <Skeleton
                className={cn('h-3', col % 3 === 0 ? 'w-3/4' : col % 3 === 1 ? 'w-1/2' : 'w-2/3')}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

/**
 * Compact "list table" card: search row + dense sticky-header table, matching
 * staff-portal's Figma org-list pattern. Renders inside `DataTable.Client` /
 * `DataTable.Server`, same as every other `DataTable.*` part. Pagination is
 * deliberately not included — render `DataTable.ListPagination` as a sibling,
 * below the panel.
 */
export function DataTableListPanel<TData extends RowData = Record<string, any>>({
  search = {},
  searchSlot,
  toolbar,
  emptyMessage,
  loading = false,
  onRowClick,
  className,
  panelClassName,
}: ListPanelProps<TData>) {
  const { totalColumns } = useDataTableRows<TData>()
  const showSearch = search !== false
  const isControlledSearch = showSearch && (search.value !== undefined || search.onChange !== undefined)

  return (
    <div
      className={cn(
        'bg-card text-card-foreground border-card-border flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border',
        panelClassName,
        className,
      )}
      data-slot="dt-list-panel"
    >
      {showSearch && (
        <div className="flex shrink-0 items-center gap-1 border-b pr-2">
          <div className="relative min-w-0 flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" aria-hidden="true" />
            {isControlledSearch
              ? (
                  <Input
                    placeholder={search.placeholder}
                    value={search.value}
                    onChange={e => search.onChange?.(e.target.value)}
                    className={SEARCH_INPUT_CLASS}
                  />
                )
              : (
                  <DataTableSearch placeholder={search.placeholder} className={SEARCH_INPUT_CLASS} />
                )}
          </div>
          {searchSlot}
        </div>
      )}
      {toolbar}
      {loading
        ? <ListPanelSkeleton columnCount={totalColumns} />
        : (
            <DataTableContent<TData>
              density="compact"
              emptyMessage={emptyMessage}
              onRowClick={onRowClick}
              className="min-h-0 flex-1"
            />
          )}
    </div>
  )
}
