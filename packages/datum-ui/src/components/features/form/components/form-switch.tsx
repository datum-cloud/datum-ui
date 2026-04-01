import type { FormSwitchProps } from '../types'
import * as React from 'react'
import { cn } from '../../../../utils/cn'
import { Label } from '../../../base/label'
import { Switch } from '../../../base/switch'
import { useFieldContext } from '../context/field-context'

/**
 * Form.Switch - Toggle switch component
 *
 * Automatically wired to the parent Form.Field context.
 *
 * @example
 * ```tsx
 * <Form.Field name="notifications">
 *   <Form.Switch label="Enable email notifications" />
 * </Form.Field>
 * ```
 */
export function FormSwitch({ label, disabled, className }: FormSwitchProps) {
  const { id, errors, disabled: fieldDisabled, fieldState } = useFieldContext()
  const isDisabled = disabled ?? fieldDisabled
  const hasErrors = errors && errors.length > 0

  // Native boolean from adapter (no string conversion needed)
  const checked = Boolean(fieldState?.value)

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={value => fieldState?.change(Boolean(value))}
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

FormSwitch.displayName = 'Form.Switch'
