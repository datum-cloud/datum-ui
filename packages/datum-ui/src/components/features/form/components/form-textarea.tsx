import type { FormTextareaProps } from '../types'
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
  const { id, errors, disabled: fieldDisabled, fieldState } = useFieldContext()
  const isDisabled = disabled ?? fieldDisabled
  const hasErrors = errors && errors.length > 0

  return (
    <Textarea
      {...props}
      ref={ref}
      id={id}
      name={fieldState?.name}
      value={fieldState?.value as string ?? ''}
      onChange={e => fieldState?.change(e.target.value)}
      onBlur={() => fieldState?.blur()}
      rows={rows}
      className={cn(className)}
      disabled={isDisabled}
      aria-invalid={hasErrors || undefined}
      aria-describedby={hasErrors ? `${id}-error` : undefined}
    />
  )
}

FormTextarea.displayName = 'Form.Textarea'
