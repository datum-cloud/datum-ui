import type { ActionItem } from './types'
import { Ellipsis } from 'lucide-react'
import { useState } from 'react'
import { Button, Tooltip } from '../..'
import { cn } from '../../../utils/cn'
import { ResponsiveDropdown } from '../../base/responsive-dropdown'
import { ActionRow } from './action-row'

export type { ActionItem }

export interface MoreActionsComponentProps<TData> {
  row?: TData
  actions: ActionItem<TData>[]
  className?: string
  disabled?: boolean
  iconClassName?: string
  responsive?: boolean
  sheetTitle?: string
}

export function MoreActions<TData,>({
  row,
  actions,
  className,
  disabled = false,
  iconClassName,
  responsive = true,
  sheetTitle = 'Actions',
}: MoreActionsComponentProps<TData>) {
  const [open, setOpen] = useState<boolean>(false)

  // Filter visible actions
  const visibleActions = actions.filter((action) => {
    if (action.hidden === undefined)
      return true
    return typeof action.hidden === 'function'
      ? !action.hidden(row as TData)
      : !action.hidden
  })

  // Hide if no visible actions remain
  if (visibleActions.length === 0) {
    return null
  }

  const trigger = (
    <Button
      onClick={() => setOpen(!open)}
      type="quaternary"
      theme="borderless"
      size="icon"
      disabled={disabled}
      className={cn(
        'data-[state=open]:bg-accent size-7 p-0 focus-visible:ring-0 focus-visible:ring-offset-0',
        className,
      )}
    >
      <Ellipsis className={cn('size-5', iconClassName)} />
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
      {visibleActions.map((action, index) => {
        const key = action.key ?? action.label ?? String(index)

        // Generate tooltip text from action config or fallback to label
        const tooltipText
          = typeof action.tooltip === 'function'
            ? action.tooltip(row as TData)
            : (action.tooltip ?? action.label)

        const rowEl = (
          <ActionRow
            key={key}
            action={action}
            data={row as TData}
            onSelect={() => setOpen(false)}
          />
        )

        // Wrap with tooltip if tooltip text differs from label (shows additional context)
        if (tooltipText && tooltipText !== action.label) {
          return (
            <Tooltip key={key} message={tooltipText}>
              {rowEl}
            </Tooltip>
          )
        }

        return <div key={key}>{rowEl}</div>
      })}
    </ResponsiveDropdown>
  )
}
