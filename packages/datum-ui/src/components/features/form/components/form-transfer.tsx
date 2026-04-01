import type { TransferProps } from '../../transfer/types'
import * as React from 'react'
import { Transfer } from '../../transfer/transfer'
import { useFieldContext } from '../context/field-context'

export interface FormTransferProps<T> extends Omit<TransferProps<T>, 'value' | 'onChange'> {
  /**
   * Minimum number of items that must be selected (for display purposes).
   * Extracted automatically from schema but can be overridden.
   */
  minItems?: number
  /**
   * Maximum number of items that can be selected (for display purposes).
   * Extracted automatically from schema but can be overridden.
   */
  maxItems?: number
}

/**
 * Form.Transfer - Transfer list component for selecting multiple items
 *
 * Automatically wired to the parent Form.Field context.
 * Displays minItems/maxItems constraints when provided.
 *
 * @example
 * ```tsx
 * <Form.Field name="teams" label="Select Teams">
 *   <Form.Transfer
 *     items={teams}
 *     itemKey="id"
 *     itemLabel="name"
 *     minItems={2}
 *     maxItems={5}
 *   />
 * </Form.Field>
 * ```
 */
export function FormTransfer<T>({ disabled, minItems, maxItems, ...props }: FormTransferProps<T>) {
  const { id, errors, disabled: fieldDisabled, fieldState } = useFieldContext()
  const isDisabled = disabled ?? fieldDisabled
  const hasErrors = errors && errors.length > 0

  const value = Array.isArray(fieldState?.value) ? fieldState.value : []

  const handleChange = React.useCallback((newValue: string[]) => {
    fieldState?.change(newValue)
  }, [fieldState])

  return (
    <>
      <div
        aria-invalid={hasErrors || undefined}
        aria-describedby={hasErrors ? `${id}-error` : undefined}
      >
        <Transfer
          {...props}
          value={value}
          onChange={handleChange}
          disabled={isDisabled}
        />
      </div>
      {(minItems != null || maxItems != null) && (
        <p className="text-sm text-muted-foreground mt-2">
          {minItems != null && maxItems != null
            ? `Select between ${minItems} and ${maxItems} items`
            : minItems != null
              ? `Select at least ${minItems} items`
              : `Select up to ${maxItems} items`}
        </p>
      )}
    </>
  )
}

FormTransfer.displayName = 'Form.Transfer'
