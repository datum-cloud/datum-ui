'use client'

import type { ListPaginationProps } from '../types'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../../../utils/cn'
import { Button } from '../../../base/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../base/select'
import { useDataTablePagination } from '../hooks/use-selectors'

const DEFAULT_LIST_PAGE_SIZES = [10, 20, 50, 100] as const

const DEFAULT_LABELS = {
  rowsPerPage: 'Rows per page',
  of: 'of',
  previousPage: 'Previous page',
  nextPage: 'Next page',
} as const

/**
 * Compact list-page footer: `[pageSize ▾] Rows per page … 1-100 of N [resource]`
 * + joined prev/next buttons. Pass `labels` to localize — this package ships no
 * i18n of its own.
 */
export function DataTableListPagination({
  pageSizes = DEFAULT_LIST_PAGE_SIZES,
  resourceLabel,
  hideWhenSinglePage = false,
  labels,
  className,
}: ListPaginationProps) {
  const {
    canNextPage,
    canPrevPage,
    nextPage,
    prevPage,
    pageIndex,
    pageCount,
    pageSize,
    setPageSize,
    totalRows,
  } = useDataTablePagination()

  const t = { ...DEFAULT_LABELS, ...labels }

  if (hideWhenSinglePage && pageCount <= 1)
    return null

  const startRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows)

  return (
    <div
      className={cn('flex h-7 w-full items-center justify-between gap-3', className)}
      data-slot="dt-list-pagination"
    >
      <div className="flex items-center gap-3">
        <Select value={String(pageSize)} onValueChange={value => setPageSize(Number(value))}>
          <SelectTrigger
            className={cn(
              'border-border text-muted-foreground h-7 w-[4.5rem] gap-1.5 rounded-md px-2.5 py-0',
              'min-h-0 text-xs font-normal shadow-none',
            )}
          >
            <SelectValue placeholder={String(pageSize)} />
          </SelectTrigger>
          <SelectContent side="top">
            {pageSizes.map(size => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-muted-foreground text-xs leading-4 whitespace-nowrap">
          {t.rowsPerPage}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-muted-foreground text-xs leading-4 whitespace-nowrap tabular-nums">
          {`${startRow}-${endRow} ${t.of} ${totalRows}${resourceLabel ? ` ${resourceLabel}` : ''}`}
        </span>
        <div className="border-border flex items-center overflow-hidden rounded-md border">
          <Button
            theme="outline"
            size="icon"
            className="border-border size-7 rounded-none border-0 border-r shadow-none"
            onClick={prevPage}
            disabled={!canPrevPage}
            aria-label={t.previousPage}
          >
            <ChevronLeft className="size-3.5" />
          </Button>
          <Button
            theme="outline"
            size="icon"
            className="size-7 rounded-none border-0 shadow-none"
            onClick={nextPage}
            disabled={!canNextPage}
            aria-label={t.nextPage}
          >
            <ChevronRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
