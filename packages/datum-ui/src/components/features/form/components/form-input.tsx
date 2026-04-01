import type { FormInputProps } from '../types'
import * as React from 'react'
import { cn } from '../../../../utils/cn'
import { Input } from '../../../base/input'
import { useFieldContext } from '../context/field-context'

/**
 * Form.Input - Text input component
 *
 * Automatically wired to the parent Form.Field context.
 *
 * @example
 * ```tsx
 * <Form.Field name="email" label="Email" required>
 *   <Form.Input type="email" placeholder="john@example.com" />
 * </Form.Field>
 * ```
 */
export function FormInput({ ref, type = 'text', className, disabled, ...props }: FormInputProps & { ref?: React.RefObject<HTMLInputElement | null> }) {
  const { id, errors, disabled: fieldDisabled, fieldState } = useFieldContext()
  const isDisabled = disabled ?? fieldDisabled
  const hasErrors = errors && errors.length > 0

  return (
    <Input
      {...props}
      ref={ref}
      id={id}
      name={fieldState?.name}
      type={type}
      value={fieldState?.value as string ?? ''}
      onChange={e => fieldState?.change(e.target.value)}
      onBlur={() => fieldState?.blur()}
      className={cn('!text-xs', className)}
      disabled={isDisabled}
      aria-invalid={hasErrors || undefined}
      aria-describedby={hasErrors ? `${id}-error` : undefined}
    />
  )
}

FormInput.displayName = 'Form.Input'
