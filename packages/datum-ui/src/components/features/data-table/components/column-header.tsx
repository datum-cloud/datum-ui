'use client'

import type { RowData } from '@tanstack/react-table'
import type { ColumnHeaderProps } from '../types'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { cn } from '../../../../utils/cn'

/** Figma `Datum App UI/Tables/Header/Dropdown` — two carets, one dimmed to show sort direction. */
function CompactSortIcon({ sorted }: { readonly sorted: false | 'asc' | 'desc' }) {
  return (
    <span className="text-muted-foreground relative h-[15px] w-[5px] shrink-0" aria-hidden="true">
      <svg
        viewBox="0 0 5.28572 3.25"
        fill="none"
        className={cn(
          'absolute inset-[26.66%_6.67%_58.34%_7.62%] overflow-visible',
          sorted === 'desc' ? 'opacity-35' : 'opacity-100',
        )}
      >
        <path d="M0.5 2.75L2.64286 0.5L4.78571 2.75" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg
        viewBox="0 0 5.28572 3.25"
        fill="none"
        className={cn(
          'absolute inset-[61.66%_6.67%_23.34%_7.62%] overflow-visible',
          sorted === 'asc' ? 'opacity-35' : 'opacity-100',
        )}
      >
        <path d="M0.5 0.5L2.64286 2.75L4.78571 0.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

export function DataTableColumnHeader<TData extends RowData, TValue>({
  column,
  title,
  className,
  density = 'default',
}: ColumnHeaderProps<TData, TValue>) {
  const isCompact = density === 'compact'

  if (!column.getCanSort()) {
    return (
      <div
        className={cn(isCompact && 'text-xs leading-4 font-normal tracking-normal text-inherit uppercase', className)}
        data-slot="dt-column-header"
      >
        {title}
      </div>
    )
  }

  const sorted = column.getIsSorted()
  const sortLabel = `Sort by ${title}${sorted === 'asc' ? ', sorted ascending' : sorted === 'desc' ? ', sorted descending' : ''}`

  if (isCompact) {
    return (
      <div className={cn('flex items-center', className)} data-slot="dt-column-header">
        <button
          type="button"
          className="hover:text-foreground inline-flex h-9 cursor-pointer items-center gap-2 text-xs leading-4 font-normal tracking-normal text-inherit uppercase"
          onClick={column.getToggleSortingHandler()}
          aria-label={sortLabel}
        >
          <span>{title}</span>
          <CompactSortIcon sorted={sorted} />
        </button>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-2', className)} data-slot="dt-column-header">
      <button
        type="button"
        className="flex items-center gap-1 hover:text-foreground -ml-3 h-8 px-3 cursor-pointer"
        onClick={column.getToggleSortingHandler()}
        aria-label={sortLabel}
      >
        <span>{title}</span>
        {sorted === 'desc'
          ? <ArrowDown className="size-4" />
          : sorted === 'asc'
            ? <ArrowUp className="size-4" />
            : <ArrowUpDown className="size-4" />}
      </button>
    </div>
  )
}
