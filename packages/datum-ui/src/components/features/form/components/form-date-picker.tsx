import type { DateRange } from 'react-day-picker'
import * as React from 'react'
import { cn } from '../../../../utils/cn'
import { CalendarDatePicker } from '../../../features/calendar-date-picker'
import { useFieldContext } from '../context/field-context'

/**
 * Form.DatePicker - Date picker component for forms
 *
 * Automatically wired to the parent Form.Field context.
 * Extracts minDate/maxDate constraints from Zod schema.
 *
 * @example
 * ```tsx
 * <Form.Field name="startDate" label="Start Date" required>
 *   <Form.DatePicker />
 * </Form.Field>
 * ```
 */
export interface FormDatePickerProps {
  /** Placeholder text */
  placeholder?: string
  /** Disable the picker */
  disabled?: boolean
  /** Additional CSS classes */
  className?: string
  /** Custom trigger button className */
  triggerClassName?: string
  /** Number of months to display (1 = single date, 2 = date range) */
  numberOfMonths?: 1 | 2
  /** Minimum selectable date (overrides schema) */
  minDate?: Date
  /** Maximum selectable date (overrides schema) */
  maxDate?: Date
  /** Disable future dates */
  disableFuture?: boolean
  /** Disable past dates */
  disablePast?: boolean
  /** Whether the popover is modal (required when using inside a Dialog/Modal) */
  modal?: boolean
}

export function FormDatePicker({
  placeholder,
  disabled,
  className,
  triggerClassName,
  numberOfMonths = 1,
  minDate: minDateProp,
  maxDate: maxDateProp,
  disableFuture,
  disablePast,
  modal,
}: FormDatePickerProps) {
  const { id, errors, disabled: fieldDisabled, fieldState } = useFieldContext()
  const isDisabled = disabled ?? fieldDisabled
  const hasErrors = errors && errors.length > 0

  // Get current value - convert string to Date if needed
  const currentValue = React.useMemo(() => {
    const val = fieldState?.value
    if (!val) {
      return { from: undefined, to: undefined }
    }

    // Handle Date object
    if (val instanceof Date) {
      return { from: val, to: val }
    }

    // Handle ISO string
    if (typeof val === 'string') {
      const date = new Date(val)
      return { from: date, to: date }
    }

    // Handle DateRange object
    if (typeof val === 'object' && 'from' in val) {
      return val as DateRange
    }

    return { from: undefined, to: undefined }
  }, [fieldState?.value])

  // Extract constraints from schema
  // Note: In a full implementation, we'd use getFieldConstraintsSingle on the field's schema
  // For now, we'll use props-based constraints
  const minDate = minDateProp
  const maxDate = maxDateProp

  // Handle date selection
  const handleDateSelect = React.useCallback(
    (range: { from: Date, to: Date } | undefined) => {
      if (!range) {
        fieldState?.change(undefined)
        fieldState?.blur()
        return
      }

      // For single date picker, store the from date as ISO string
      if (numberOfMonths === 1) {
        fieldState?.change(range.from.toISOString())
      }
      else {
        // For range picker, store the range object with ISO strings
        fieldState?.change({
          from: range.from.toISOString(),
          to: range.to?.toISOString(),
        })
      }
      fieldState?.blur()
    },
    [fieldState, numberOfMonths],
  )

  return (
    <CalendarDatePicker
      id={id}
      date={currentValue}
      onDateSelect={handleDateSelect}
      numberOfMonths={numberOfMonths}
      placeholder={placeholder}
      disabled={isDisabled}
      minDate={minDate}
      maxDate={maxDate}
      disableFuture={disableFuture}
      disablePast={disablePast}
      variant="outline"
      modal={modal}
      className={cn(className)}
      triggerClassName={cn(triggerClassName)}
      aria-invalid={hasErrors || undefined}
      aria-describedby={hasErrors ? `${id}-error` : undefined}
    />
  )
}

FormDatePicker.displayName = 'Form.DatePicker'
