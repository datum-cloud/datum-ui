import type { FormSelectItemProps, FormSelectProps } from '../types'
import * as React from 'react'
import { cn } from '../../../../utils/cn'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../base/select'
import { useFieldContext } from '../context/field-context'

/**
 * Form.Select - Select dropdown component
 *
 * Automatically wired to the parent Form.Field context.
 *
 * @example
 * ```tsx
 * <Form.Field name="country" label="Country" required>
 *   <Form.Select placeholder="Select a country">
 *     <Form.SelectItem value="us">United States</Form.SelectItem>
 *     <Form.SelectItem value="uk">United Kingdom</Form.SelectItem>
 *     <Form.SelectItem value="ca">Canada</Form.SelectItem>
 *   </Form.Select>
 * </Form.Field>
 * ```
 */
export function FormSelect({ placeholder, disabled, className, children }: FormSelectProps) {
  const { id, errors, disabled: fieldDisabled, fieldState } = useFieldContext()
  const isDisabled = disabled ?? fieldDisabled
  const hasErrors = errors && errors.length > 0

  const value = fieldState?.value != null ? String(fieldState.value) : undefined

  return (
    <Select
      value={value}
      onValueChange={val => fieldState?.change(val)}
      disabled={isDisabled}
    >
      <SelectTrigger
        id={id}
        className={cn(className)}
        aria-invalid={hasErrors || undefined}
        aria-describedby={hasErrors ? `${id}-error` : undefined}
        onBlur={() => fieldState?.blur()}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {children}
      </SelectContent>
    </Select>
  )
}

FormSelect.displayName = 'Form.Select'

/**
 * Form.SelectItem - Individual select option
 *
 * @example
 * ```tsx
 * <Form.SelectItem value="option1">Option 1</Form.SelectItem>
 * ```
 */
export function FormSelectItem({ value, children, disabled }: FormSelectItemProps) {
  return (
    <SelectItem value={value} disabled={disabled}>
      {children}
    </SelectItem>
  )
}

FormSelectItem.displayName = 'Form.SelectItem'
