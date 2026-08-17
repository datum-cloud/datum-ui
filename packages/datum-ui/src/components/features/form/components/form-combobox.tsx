import type { AutocompleteGroup, AutocompleteOption } from '../../autocomplete'
import * as React from 'react'
import { cn } from '../../../../utils/cn'
import { Autocomplete } from '../../autocomplete'
import { useFieldContext } from '../context/field-context'

/**
 * Form.Combobox - Single-select dropdown with search for forms
 *
 * Automatically wired to the parent Form.Field context.
 * Internally delegates to Autocomplete.
 *
 * @example
 * ```tsx
 * const options = [
 *   { value: '1', label: 'Option 1' },
 *   { value: '2', label: 'Option 2' },
 * ]
 *
 * <Form.Field name="country" label="Country" required>
 *   <Form.Combobox options={options} placeholder="Select a country" />
 * </Form.Field>
 * ```
 */

/** @deprecated Use `AutocompleteOption` from `@datum-cloud/datum-ui/autocomplete`. */
export type ComboboxOption = AutocompleteOption
/** @deprecated Use `AutocompleteGroup` from `@datum-cloud/datum-ui/autocomplete`. */
export type ComboboxGroup = AutocompleteGroup

export interface FormComboboxProps {
  'options': ComboboxOption[] | ComboboxGroup[]
  'placeholder'?: string
  'searchPlaceholder'?: string
  'emptyMessage'?: string
  'disabled'?: boolean
  'className'?: string
  'triggerClassName'?: string
  'contentClassName'?: string
  'searchable'?: boolean
  'showDropdownArrow'?: boolean
  'clearable'?: boolean
  'data-testid'?: string
  'modal'?: boolean
}

export function FormCombobox({
  options,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  disabled,
  className,
  triggerClassName,
  contentClassName,
  searchable = true,
  'data-testid': _testId,
  modal,
}: FormComboboxProps) {
  const { id, errors, disabled: fieldDisabled, fieldState } = useFieldContext()
  const isDisabled = disabled ?? fieldDisabled
  const hasErrors = errors && errors.length > 0

  const handleChange = React.useCallback(
    (value: string) => {
      fieldState?.change(value ?? '')
      fieldState?.blur()
    },
    [fieldState],
  )

  return (
    <Autocomplete
      id={id}
      options={options}
      value={(fieldState?.value as string) ?? ''}
      onValueChange={handleChange}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      emptyContent={emptyMessage}
      disabled={isDisabled}
      disableSearch={!searchable}
      modal={modal}
      className={className}
      triggerClassName={cn(hasErrors && 'border-destructive', triggerClassName)}
      contentClassName={contentClassName}
    />
  )
}

FormCombobox.displayName = 'Form.Combobox'
