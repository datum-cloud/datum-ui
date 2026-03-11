'use client'

import type { ColumnHeaderProps } from '../types'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { cn } from '../../../../utils/cn'

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: ColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)} data-slot="dt-column-header">{title}</div>
  }

  const sorted = column.getIsSorted()

  return (
    <div className={cn('flex items-center gap-2', className)} data-slot="dt-column-header">
      <button
        type="button"
        className="flex items-center gap-1 hover:text-foreground -ml-3 h-8 px-3 cursor-pointer"
        onClick={column.getToggleSortingHandler()}
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
