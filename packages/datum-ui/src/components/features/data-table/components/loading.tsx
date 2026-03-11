'use client'

import type { LoadingProps } from '../types'
import { Skeleton } from '@repo/shadcn/ui/skeleton'
import { DEFAULT_LOADING_ROWS } from '../constants'

export function DataTableLoading({
  rows = DEFAULT_LOADING_ROWS,
  columns = 4,
  className,
}: LoadingProps) {
  return (
    <div className={className} data-slot="dt-loading">
      <div className="rounded-md border">
        <div className="border-b">
          <div className="flex gap-4 p-4">
            {Array.from({ length: columns }, (_, i) => (
              <Skeleton key={i} className="h-4 flex-1" />
            ))}
          </div>
        </div>
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div key={rowIndex} className="flex gap-4 border-b p-4 last:border-b-0">
            {Array.from({ length: columns }, (_, colIndex) => (
              <Skeleton key={colIndex} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
