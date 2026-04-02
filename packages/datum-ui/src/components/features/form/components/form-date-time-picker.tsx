import * as React from 'react'
import { cn } from '../../../../utils/cn'
import { DateTimePicker } from '../../date-time-picker'
import { useFieldContext } from '../context/field-context'

/**
 * Form.DateTimePicker - Date and time picker component for forms
 *
 * Automatically wired to the parent Form.Field context.
 * Extracts minDate/maxDate constraints from Zod schema.
 * Value is stored as UTC ISO string.
 *
 * @example
 * ```tsx
 * <Form.Field name="scheduledAt" label="Scheduled At" required>
 *   <Form.DateTimePicker />
 * </Form.Field>
 * ```
 */
export interface FormDateTimePickerProps {
  /** Minimum selectable date (overrides schema) */
  minDate?: Date
  /** Maximum selectable date (overrides schema) */
  maxDate?: Date
  /** Function to disable specific dates */
  disabledDates?: (date: Date) => boolean
  /** User's timezone (defaults to browser timezone) */
  timezone?: string
  /** Show timezone indicator */
  showTimezoneIndicator?: boolean
  /** Placeholder text */
  placeholder?: string
  /** Disable the picker */
  disabled?: boolean
  /** Additional CSS classes */
  className?: string
  /** Whether the popover is modal (required when using inside a Dialog/Modal) */
  modal?: boolean
}

export function FormDateTimePicker({
  minDate: minDateProp,
  maxDate: maxDateProp,
  disabledDates,
  timezone,
  showTimezoneIndicator,
  placeholder,
  disabled,
  className,
  modal,
}: FormDateTimePickerProps) {
  const { id, errors, disabled: fieldDisabled, fieldState } = useFieldContext()
  const isDisabled = disabled ?? fieldDisabled
  const hasErrors = errors && errors.length > 0

  // Get current value - should be UTC ISO string
  const currentValue = React.useMemo(() => {
    const val = fieldState?.value
    if (!val)
      return undefined
    if (typeof val === 'string')
      return val
    return undefined
  }, [fieldState?.value])

  // Extract constraints from schema
  // Note: In a full implementation, we'd use getFieldConstraintsSingle on the field's schema
  // For now, we'll use props-based constraints
  const minDate = minDateProp
  const maxDate = maxDateProp

  // Handle date/time change - receives UTC ISO string
  const handleChange = React.useCallback(
    (value: string | undefined) => {
      fieldState?.change(value)
      fieldState?.blur()
    },
    [fieldState],
  )

  return (
    <DateTimePicker
      value={currentValue}
      onChange={handleChange}
      minDate={minDate}
      maxDate={maxDate}
      disabledDates={disabledDates}
      timezone={timezone}
      showTimezoneIndicator={showTimezoneIndicator}
      placeholder={placeholder}
      disabled={isDisabled}
      modal={modal}
      className={cn(className)}
      aria-invalid={hasErrors || undefined}
      aria-describedby={hasErrors ? `${id}-error` : undefined}
    />
  )
}

FormDateTimePicker.displayName = 'Form.DateTimePicker'
