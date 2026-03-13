'use client'

import type { RowActionsProps } from '../types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/shadcn/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '../../../base/button'

export function DataTableRowActions<TData>({
  row,
  actions,
  isLoading = false,
  className,
}: RowActionsProps<TData>) {
  const data = row.original
  const visibleActions = actions.filter((action) => {
    if (action.hidden === undefined)
      return true
    return typeof action.hidden === 'function' ? !action.hidden(data) : !action.hidden
  })

  if (visibleActions.length === 0)
    return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          theme="borderless"
          size="small"
          className={className}
          disabled={isLoading}
          data-slot="dt-row-actions"
        >
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {visibleActions.map((action) => {
          const isDisabled
            = typeof action.disabled === 'function'
              ? action.disabled(data)
              : action.disabled ?? false

          return (
            <DropdownMenuItem
              key={action.label}
              disabled={isDisabled}
              onClick={() => action.onClick(data)}
              className={action.variant === 'destructive' ? 'text-destructive' : undefined}
            >
              {action.icon && <action.icon className="mr-2 size-4" />}
              {action.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
