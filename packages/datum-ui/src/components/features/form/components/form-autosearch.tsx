import type { FormAutosearchProps } from '../../autosearch/autosearch.types'
import { cn } from '../../../../utils/cn'
import { Autosearch } from '../../autosearch'
import { useFieldContext } from '../context/field-context'

/**
 * Form.Autosearch - Search-first input with dropdown results
 *
 * Automatically wired to the parent Form.Field context.
 * Shows a text input that triggers search and displays results in a popover.
 * Different from Form.Autocomplete which shows all options upfront.
 *
 * @example Basic usage
 * ```tsx
 * <Form.Field name="userId" label="User" required>
 *   <Form.Autosearch
 *     options={users}
 *     onSearch={handleSearch}
 *     loading={isSearching}
 *     placeholder="Search users..."
 *   />
 * </Form.Field>
 * ```
 *
 * @example With debounce control
 * ```tsx
 * <Form.Field name="email" label="Email">
 *   <Form.Autosearch
 *     options={searchResults}
 *     onSearch={debouncedSearch}
 *     searchDebounceMs={500}
 *     placeholder="Type email to search..."
 *   />
 * </Form.Field>
 * ```
 */
export function FormAutosearch({
  disabled,
  className,
  inputClassName,
  ...props
}: FormAutosearchProps) {
  const { id, errors, disabled: fieldDisabled, fieldState } = useFieldContext()
  const isDisabled = disabled ?? fieldDisabled
  const hasErrors = errors && errors.length > 0

  const value = fieldState?.value != null ? String(fieldState.value) : ''

  return (
    <Autosearch
      {...props}
      name={fieldState?.name}
      id={id}
      value={value}
      onValueChange={(val) => {
        fieldState?.change(val)
        fieldState?.blur()
      }}
      disabled={isDisabled}
      inputClassName={cn(hasErrors && 'border-destructive', inputClassName)}
      className={className}
    />
  )
}

FormAutosearch.displayName = 'Form.Autosearch'
