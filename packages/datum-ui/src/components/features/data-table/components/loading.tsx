'use client'

import type { LoadingProps } from '../types'
import { Skeleton } from '../../../base/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../base/table'
import { DEFAULT_LOADING_ROWS } from '../constants'

export function DataTableLoading({
  rows = DEFAULT_LOADING_ROWS,
  columns = 4,
  className,
}: LoadingProps) {
  return (
    <div className={className} data-slot="dt-loading" style={{ overflowX: 'auto' }}>
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: columns }, (_, i) => (
              <TableHead key={i}>
                <Skeleton className="h-4 w-24" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }, (_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columns }, (_, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
