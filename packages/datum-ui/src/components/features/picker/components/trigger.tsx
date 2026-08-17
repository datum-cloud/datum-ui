import type { ComponentProps, ReactNode } from 'react'
import { Button } from '@repo/shadcn/ui/button'
import { CalendarIcon, X } from 'lucide-react'
import { cn } from '../../../../utils/cn'
import { usePickerContext } from './context'

interface PickerTriggerProps extends Omit<ComponentProps<typeof Button>, 'children'> {
  placeholder?: string
  clearable?: boolean
  disabled?: boolean
  /** Custom render override — receives `pendingValue` and returns JSX. */
  children?: (value: unknown) => ReactNode
  className?: string
  triggerClassName?: string
  id?: string
  /**
   * Trigger leading icon. Pass a ReactNode to override the default calendar
   * icon, or `false` to hide it entirely.
   */
  icon?: ReactNode | false
}

const DEFAULT_ICON = (
  <CalendarIcon className="text-muted-foreground size-4 shrink-0" />
)

export function PickerTrigger({
  placeholder = 'Pick a date',
  clearable = false,
  disabled = false,
  children,
  className,
  triggerClassName,
  id,
  icon,
  onClick,
  ...slotProps
}: PickerTriggerProps) {
  const { state, actions } = usePickerContext()
  const hasValue = state.pendingValue !== null && state.pendingValue !== undefined
  const renderedIcon = icon === false ? null : (icon ?? DEFAULT_ICON)

  return (
    <Button
      id={id}
      type="button"
      variant="outline"
      role="combobox"
      // Only label with the placeholder when empty. When a value is selected,
      // omit aria-label so the accessible name falls through to the rendered
      // value text — otherwise the placeholder masks the selection for screen
      // readers (BUG-091).
      aria-label={hasValue ? undefined : placeholder}
      aria-expanded={state.open}
      disabled={disabled}
      onClick={(e) => {
        onClick?.(e)
        if (state.open)
          actions.close()
        else actions.open()
      }}
      className={cn('w-full justify-between gap-2 font-normal', triggerClassName, className)}
      {...slotProps}
    >
      <span className="flex flex-1 items-center gap-2 truncate">
        {renderedIcon}
        <span className={cn('truncate', !hasValue && 'text-muted-foreground')}>
          {hasValue ? (children ? children(state.pendingValue) : String(state.pendingValue)) : placeholder}
        </span>
      </span>
      {clearable && hasValue && (
        <button
          type="button"
          aria-label="Clear"
          onClick={(e) => {
            e.stopPropagation()
            actions.clear()
          }}
          className="text-muted-foreground hover:text-destructive shrink-0 rounded-sm p-0.5 transition-colors"
        >
          <X className="size-3.5" />
        </button>
      )}
    </Button>
  )
}

PickerTrigger.displayName = 'Picker.Trigger'
