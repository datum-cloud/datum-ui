'use client'

import type { BulkActionsProps } from '../types'
import { useDataTableSelection } from '../hooks/use-selectors'

export function DataTableBulkActions<TData>({
  children,
  className,
}: BulkActionsProps<TData>) {
  const { selectedRows } = useDataTableSelection<TData>()

  if (selectedRows.length === 0)
    return null

  return <div data-slot="dt-bulk-actions" className={className}>{children(selectedRows)}</div>
}
