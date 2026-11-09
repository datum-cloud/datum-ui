import type { ComponentProps, ReactNode } from 'react'
import { Button } from '@repo/shadcn/ui/button'
import { CalendarIcon, X } from 'lucide-react'
import { cn } from '../../../../utils/cn'
import { fieldIconClassName, fieldPlaceholderClassName, fieldTriggerClassName } from '../../../../utils/field-styles'
import { Icon } from '../../../icons/icon-wrapper'
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
  <Icon icon={CalendarIcon} className={fieldIconClassName} aria-hidden="true" />
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
      // Restyle the shadcn outline Button as a field so it lines up with
      // Input/Select/Autocomplete/MultiSelect: same tokens, padding and weight,
      // and no hover fill (fields don't change colour on hover).
      className={cn(
        fieldTriggerClassName,
        'h-10 justify-between hover:bg-input-background/50 hover:text-input-foreground',
        triggerClassName,
        className,
      )}
      {...slotProps}
    >
      <span className="flex flex-1 items-center gap-2 truncate">
        {renderedIcon}
        <span className={cn('truncate', !hasValue && fieldPlaceholderClassName)}>
          {hasValue ? (children ? children(state.pendingValue) : String(state.pendingValue)) : placeholder}
        </span>
      </span>
      {clearable && hasValue && (
        // Not a <button>: the trigger is one, and a nested button is invalid
        // HTML. The server-rendered page then closes the trigger early and
        // drops the X below it until React hydrates. A role="button" span
        // with a tab stop and Enter/Space keeps it operable, as MultiSelect's
        // chip actions do.
        <span
          role="button"
          tabIndex={0}
          aria-label="Clear"
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            actions.clear()
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation()
              e.preventDefault()
              actions.clear()
            }
          }}
          // -m-0.5 p-0.5 widens the hit area without pushing the icon off the
          // 12px right edge every other trigger's chevron sits on.
          className="text-muted-foreground hover:text-destructive focus-visible:ring-ring -m-0.5 inline-flex shrink-0 cursor-pointer rounded-sm p-0.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          {/* `!` beats the base Button's `[&_svg]:size-4`, which would otherwise win on specificity. */}
          <Icon icon={X} size={14} className="size-3.5! shrink-0" aria-hidden="true" />
        </span>
      )}
    </Button>
  )
}

PickerTrigger.displayName = 'Picker.Trigger'
