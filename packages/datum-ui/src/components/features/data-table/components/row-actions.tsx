'use client'

import type { RowActionsProps } from '../types'
import { MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../../base/button'
import { ResponsiveDropdown } from '../../../base/responsive-dropdown'
import { ActionRow } from '../../more-actions/action-row'

export function DataTableRowActions<TData>({
  row,
  actions,
  isLoading = false,
  className,
  responsive = true,
  sheetTitle = 'Actions',
}: RowActionsProps<TData>) {
  const [open, setOpen] = useState(false)
  const data = row.original

  const visibleActions = actions.filter((action) => {
    if (action.hidden === undefined)
      return true
    return typeof action.hidden === 'function' ? !action.hidden(data) : !action.hidden
  })

  if (visibleActions.length === 0)
    return null

  const trigger = (
    <Button
      theme="borderless"
      size="small"
      className={className}
      disabled={isLoading}
      data-slot="dt-row-actions"
      onClick={() => setOpen(!open)}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">Open menu</span>
    </Button>
  )

  return (
    <ResponsiveDropdown
      open={open}
      onOpenChange={setOpen}
      trigger={trigger}
      sheetTitle={sheetTitle}
      align="end"
      responsive={responsive}
    >
      {visibleActions.map(action => (
        <ActionRow
          key={action.label}
          action={action}
          data={data}
          onSelect={() => setOpen(false)}
        />
      ))}
    </ResponsiveDropdown>
  )
}
