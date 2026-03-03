import type { FormInputProps } from '../types'
import { getInputProps } from '@conform-to/react'
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
  const { fieldMeta, disabled: fieldDisabled, errors } = useFieldContext()

  const inputProps = getInputProps(fieldMeta, { type })
  const isDisabled = disabled ?? fieldDisabled
  const hasErrors = errors && errors.length > 0

  return (
    <Input
      ref={ref}
      {...inputProps}
      {...props}
      type={type}
      disabled={isDisabled}
      aria-invalid={hasErrors || undefined}
      aria-describedby={hasErrors ? `${fieldMeta.id}-error` : undefined}
      className={cn('!text-xs', className)}
    />
  )
}

FormInput.displayName = 'Form.Input'
