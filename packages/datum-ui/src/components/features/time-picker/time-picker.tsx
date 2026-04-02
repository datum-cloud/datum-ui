import type { TimePickerProps } from './types'
import * as React from 'react'
import { cn } from '../../../utils/cn'
import { Input } from '../../base/input'

/**
 * TimePicker - Simple time input component
 *
 * Provides a native HTML time input for selecting hours and minutes.
 * Value format: "HH:mm" (e.g., "14:30")
 *
 * @example
 * ```tsx
 * <TimePicker
 *   value="14:30"
 *   onChange={(time) => console.log(time)}
 *   min="09:00"
 *   max="17:00"
 * />
 * ```
 */
export function TimePicker({
  value,
  onChange,
  min,
  max,
  step,
  placeholder,
  disabled,
  className,
  id,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
}: TimePickerProps) {
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value)
    },
    [onChange],
  )

  return (
    <Input
      id={id}
      type="time"
      value={value || ''}
      onChange={handleChange}
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
      disabled={disabled}
      className={cn(className)}
      aria-invalid={ariaInvalid}
      aria-describedby={ariaDescribedBy}
    />
  )
}

TimePicker.displayName = 'TimePicker'
