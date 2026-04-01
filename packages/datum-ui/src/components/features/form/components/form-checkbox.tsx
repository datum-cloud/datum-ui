import type { FormCheckboxProps } from '../types'
import * as React from 'react'
import { cn } from '../../../../utils/cn'
import { Checkbox } from '../../../base/checkbox'
import { Label } from '../../../base/label'
import { useFieldContext } from '../context/field-context'

/**
 * Form.Checkbox - Checkbox input component
 *
 * Automatically wired to the parent Form.Field context.
 *
 * @example
 * ```tsx
 * <Form.Field name="terms">
 *   <Form.Checkbox label="I agree to the terms and conditions" />
 * </Form.Field>
 * ```
 */
export function FormCheckbox({ label, disabled, className }: FormCheckboxProps) {
  const { id, errors, disabled: fieldDisabled, fieldState } = useFieldContext()
  const isDisabled = disabled ?? fieldDisabled
  const hasErrors = errors && errors.length > 0

  // Native boolean from adapter (no string conversion needed)
  const checked = Boolean(fieldState?.value)

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(value) => {
          fieldState?.change(Boolean(value))
          fieldState?.blur()
        }}
        disabled={isDisabled}
        aria-invalid={hasErrors || undefined}
        aria-describedby={hasErrors ? `${id}-error` : undefined}
      />
      {label && (
        <Label
          htmlFor={id}
          className={cn(
            'cursor-pointer text-sm font-normal',
            isDisabled && 'cursor-not-allowed opacity-70',
          )}
        >
          {label}
        </Label>
      )}
    </div>
  )
}

FormCheckbox.displayName = 'Form.Checkbox'
