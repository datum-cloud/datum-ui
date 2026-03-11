'use client'

import type { PaginationProps } from '../types'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo } from 'react'
import { cn } from '../../../../utils/cn'
import { Button } from '../../../base/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../base/select'
import { DEFAULT_PAGE_SIZES } from '../constants'
import { useDataTablePagination } from '../hooks/use-selectors'

/**
 * Generates page numbers with ellipsis for large page counts.
 * Shows up to 7 items: first, last, current +/- 1 neighbor, and ellipsis gaps.
 */
function getPageNumbers(currentPage: number, totalPages: number): readonly (number | '...')[] {
  const maxVisible = 7

  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages: (number | '...')[] = [1]
  const current = currentPage + 1 // convert to 1-based

  if (current <= 4) {
    // Near the start: 1, 2, 3, 4, 5, ..., last
    for (let i = 2; i <= 5; i++) pages.push(i)
    pages.push('...')
    pages.push(totalPages)
  }
  else if (current >= totalPages - 3) {
    // Near the end: 1, ..., n-4, n-3, n-2, n-1, n
    pages.push('...')
    for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i)
  }
  else {
    // In the middle: 1, ..., c-1, c, c+1, ..., last
    pages.push('...')
    for (let i = current - 1; i <= current + 1; i++) pages.push(i)
    pages.push('...')
    pages.push(totalPages)
  }

  return pages
}

export function DataTablePagination({
  pageSizes = DEFAULT_PAGE_SIZES,
  className,
}: PaginationProps) {
  const {
    canNextPage,
    canPrevPage,
    nextPage,
    prevPage,
    pageIndex,
    pageCount,
    setPageIndex,
    pageSize,
    setPageSize,
    totalRows,
  } = useDataTablePagination()

  // pageCount > 0 means client mode (TanStack returns -1 for manual/server pagination)
  const isClientMode = pageCount > 0

  const startRow = pageIndex * pageSize + 1
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows)

  const pageNumbers = useMemo(
    () => getPageNumbers(pageIndex, pageCount),
    [pageIndex, pageCount],
  )

  return (
    <div className={cn('flex flex-col-reverse items-center justify-between gap-4 px-2 py-4 sm:flex-row', className)} data-slot="dt-pagination">
      {/* Left side: row info + rows per page */}
      <div className="flex items-center gap-4">
        {isClientMode && totalRows > 0 && (
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Showing
            {' '}
            {startRow}
            {' '}
            to
            {' '}
            {endRow}
            {' '}
            of
            {' '}
            {totalRows}
            {' '}
            rows
          </span>
        )}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Rows per page</span>
          <Select
            value={String(pageSize)}
            onValueChange={value => setPageSize(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
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
        </div>
      </div>

      {/* Right side: page navigation */}
      <div className="flex items-center gap-1">
        <Button
          theme="outline"
          size="icon"
          className="size-8"
          onClick={prevPage}
          disabled={!canPrevPage}
        >
          <ChevronLeft className="size-4" />
        </Button>

        {isClientMode && pageCount > 1
          ? pageNumbers.map((page, index) => {
              if (page === '...') {
                return (
                  <span key={`ellipsis-${index}`} className="px-2 text-sm text-muted-foreground">
                    ...
                  </span>
                )
              }
              const isActive = page === pageIndex + 1
              return (
                <Button
                  key={page}
                  theme={isActive ? 'solid' : 'outline'}
                  size="small"
                  className={cn('h-8 min-w-8 px-2', isActive && 'font-semibold')}
                  onClick={() => setPageIndex(page - 1)}
                  disabled={isActive}
                >
                  {page}
                </Button>
              )
            })
          : !isClientMode && (
              <span className="px-2 text-sm text-muted-foreground">
                Page
                {' '}
                {pageIndex + 1}
              </span>
            )}

        <Button
          theme="outline"
          size="icon"
          className="size-8"
          onClick={nextPage}
          disabled={!canNextPage}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
