import type { ComponentType, ReactNode } from 'react'
import type { ActionItem } from './types'
import { useRef, useState } from 'react'
import { cn } from '../../../utils/cn'
import { ConfirmActionDialog } from './confirm-action-dialog'

interface ActionRowProps<TData> {
  action: ActionItem<TData>
  data: TData
  onSelect: () => void
}

export function ActionRow<TData,>({
  action,
  data,
  onSelect,
}: ActionRowProps<TData>) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const isDisabled
    = typeof action.disabled === 'function'
      ? action.disabled(data)
      : action.disabled ?? false

  // Support both ComponentType and ReactNode for icon
  const IconComponent
    = typeof action.icon === 'function'
      ? (action.icon as ComponentType<{ className?: string }>)
      : null
  const iconNode = IconComponent
    ? (<IconComponent className="size-4" />)
    : (action.icon as ReactNode)

  const row = (
    <button
      ref={buttonRef}
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        if (action.confirm) {
          // The menu stays open under the dialog so this row stays mounted and
          // takes focus back if the user cancels.
          setIsConfirmOpen(true)
          return
        }
        action.onClick(data)
        onSelect()
      }}
      disabled={isDisabled}
      className={cn(
        'hover:bg-accent hover:text-accent-foreground flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-xs disabled:pointer-events-none disabled:opacity-50',
        '[&_svg]:size-4 [&_svg]:shrink-0',
        action.variant === 'destructive'
        && 'text-destructive [&_svg]:!text-destructive hover:!text-destructive hover:[&_svg]:!text-destructive',
        action.className,
      )}
    >
      {iconNode}
      <span>{action.label}</span>
    </button>
  )

  if (!action.confirm)
    return row

  return (
    <>
      {row}
      <ConfirmActionDialog
        action={action}
        confirm={action.confirm}
        data={data}
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirmed={onSelect}
        returnFocusRef={buttonRef}
      />
    </>
  )
}
