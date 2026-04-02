import type { ComboboxGroup, ComboboxOption } from '../../combobox'
import * as React from 'react'
import { cn } from '../../../../utils/cn'
import { Combobox } from '../../combobox'
import { useFieldContext } from '../context/field-context'

/**
 * Form.Combobox - Single-select dropdown with search for forms
 *
 * Automatically wired to the parent Form.Field context.
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
export interface FormComboboxProps {
  /**
   * Available options (flat or grouped)
   */
  'options': ComboboxOption[] | ComboboxGroup[]

  /**
   * Placeholder for trigger button
   */
  'placeholder'?: string

  /**
   * Placeholder for search input
   */
  'searchPlaceholder'?: string

  /**
   * Message shown when no options match
   */
  'emptyMessage'?: string

  /**
   * Disable the combobox
   */
  'disabled'?: boolean

  /**
   * Additional CSS classes
   */
  'className'?: string

  /**
   * Additional CSS classes for trigger button
   */
  'triggerClassName'?: string

  /**
   * Additional CSS classes for popover content
   */
  'contentClassName'?: string

  /**
   * Enable search functionality
   * @default true
   */
  'searchable'?: boolean

  /**
   * Show dropdown arrow icon
   * @default true
   */
  'showDropdownArrow'?: boolean

  /**
   * Allow clearing the selection
   * @default false
   */
  'clearable'?: boolean

  /**
   * Test ID
   */
  'data-testid'?: string

  /**
   * Whether the popover is modal (required when using inside a Dialog/Modal)
   */
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
  showDropdownArrow = true,
  clearable = false,
  'data-testid': testId,
  modal,
}: FormComboboxProps) {
  const { id, errors, disabled: fieldDisabled, fieldState } = useFieldContext()
  const isDisabled = disabled ?? fieldDisabled
  const hasErrors = errors && errors.length > 0

  const handleChange = React.useCallback(
    (value: string | undefined) => {
      fieldState?.change(value ?? '')
      fieldState?.blur()
    },
    [fieldState],
  )

  return (
    <Combobox
      id={id}
      options={options}
      value={(fieldState?.value as string) ?? ''}
      onChange={handleChange}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      emptyMessage={emptyMessage}
      disabled={isDisabled}
      searchable={searchable}
      showDropdownArrow={showDropdownArrow}
      clearable={clearable}
      modal={modal}
      className={className}
      triggerClassName={cn(hasErrors && 'border-destructive', triggerClassName)}
      contentClassName={contentClassName}
      data-testid={testId}
    />
  )
}

FormCombobox.displayName = 'Form.Combobox'
