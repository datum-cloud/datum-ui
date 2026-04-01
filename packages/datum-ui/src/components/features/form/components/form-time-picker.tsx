import type { TimePickerProps } from '../../time-picker/types'
import * as React from 'react'
import { cn } from '../../../../utils/cn'
import { TimePicker } from '../../time-picker'
import { useFieldContext } from '../context/field-context'

/**
 * Form.TimePicker - Simple time input component for forms
 *
 * Automatically wired to the parent Form.Field context.
 * Value format: "HH:mm" (e.g., "14:30")
 *
 * @example
 * ```tsx
 * <Form.Field name="time" label="Time">
 *   <Form.TimePicker />
 * </Form.Field>
 * ```
 */
export interface FormTimePickerProps extends Omit<TimePickerProps, 'value' | 'onChange' | 'id' | 'aria-invalid' | 'aria-describedby'> {
  // All props inherited from TimePickerProps except value/onChange (managed by form)
}

export function FormTimePicker({
  min,
  max,
  step,
  placeholder,
  disabled,
  className,
}: FormTimePickerProps) {
  const { id, errors, disabled: fieldDisabled, fieldState } = useFieldContext()
  const isDisabled = disabled ?? fieldDisabled
  const hasErrors = errors && errors.length > 0

  // Get current value (should be string in HH:mm format)
  const currentValue = (fieldState?.value as string) ?? ''

  // Handle time change
  const handleChange = React.useCallback(
    (value: string) => {
      fieldState?.change(value || undefined)
    },
    [fieldState],
  )

  return (
    <TimePicker
      id={id}
      value={currentValue}
      onChange={handleChange}
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
      disabled={isDisabled}
      className={cn(className)}
      aria-invalid={hasErrors || undefined}
      aria-describedby={hasErrors ? `${id}-error` : undefined}
    />
  )
}

FormTimePicker.displayName = 'Form.TimePicker'
