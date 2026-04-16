import type { ComponentType, ReactNode } from 'react'
import type { ActionItem } from './types'
import { cn } from '../../../utils/cn'

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

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
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
}
