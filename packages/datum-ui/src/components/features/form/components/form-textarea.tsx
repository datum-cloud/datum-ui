import type { FormTextareaProps } from '../types'
import { getTextareaProps } from '@conform-to/react'
import * as React from 'react'
import { cn } from '../../../../utils/cn'
import { Textarea } from '../../../base/textarea'
import { useFieldContext } from '../context/field-context'

/**
 * Form.Textarea - Multi-line text input component
 *
 * Automatically wired to the parent Form.Field context.
 *
 * @example
 * ```tsx
 * <Form.Field name="bio" label="Bio">
 *   <Form.Textarea rows={4} placeholder="Tell us about yourself..." />
 * </Form.Field>
 * ```
 */
export function FormTextarea({ ref, className, disabled, rows = 3, ...props }: FormTextareaProps & { ref?: React.RefObject<HTMLTextAreaElement | null> }) {
  const { fieldMeta, disabled: fieldDisabled, errors } = useFieldContext()

  const textareaProps = getTextareaProps(fieldMeta)
  const isDisabled = disabled ?? fieldDisabled
  const hasErrors = errors && errors.length > 0

  return (
    <Textarea
      ref={ref}
      {...textareaProps}
      {...props}
      rows={rows}
      disabled={isDisabled}
      aria-invalid={hasErrors || undefined}
      aria-describedby={hasErrors ? `${fieldMeta.id}-error` : undefined}
      className={cn(className)}
    />
  )
}

FormTextarea.displayName = 'Form.Textarea'
