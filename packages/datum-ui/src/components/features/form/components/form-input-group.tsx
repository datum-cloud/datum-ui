import type { InputWithAddonsProps } from '../../input-with-addons'
import * as React from 'react'
import { cn } from '../../../../utils/cn'
import { InputWithAddons } from '../../input-with-addons'
import { useFieldContext } from '../context/field-context'

/**
 * Form.InputGroup - Input with leading/trailing addons
 *
 * Automatically wired to the parent Form.Field context.
 *
 * @example
 * ```tsx
 * <Form.Field name="website" label="Website" required>
 *   <Form.InputGroup leading="https://" placeholder="example.com" />
 * </Form.Field>
 * ```
 */
export function FormInputGroup({ ref, className, disabled, ...props }: Omit<InputWithAddonsProps, 'name'> & { ref?: React.RefObject<HTMLInputElement | null> }) {
  const { id, errors, disabled: fieldDisabled, fieldState } = useFieldContext()
  const isDisabled = disabled ?? fieldDisabled
  const hasErrors = errors && errors.length > 0

  return (
    <InputWithAddons
      {...props}
      ref={ref}
      id={id}
      name={fieldState?.name}
      value={fieldState?.value as string ?? ''}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => fieldState?.change(e.target.value)}
      onBlur={() => fieldState?.blur()}
      className={cn('text-xs!', className)}
      disabled={isDisabled}
      aria-invalid={hasErrors || undefined}
      aria-describedby={hasErrors ? `${id}-error` : undefined}
    />
  )
}

FormInputGroup.displayName = 'Form.InputGroup'
