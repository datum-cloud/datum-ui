import type { AutocompleteOption, FormAutocompleteProps } from '../../autocomplete/autocomplete.types'
import { cn } from '../../../../utils/cn'
import { Autocomplete } from '../../autocomplete'
import { useFieldContext } from '../context/field-context'

/**
 * Form.Autocomplete - Searchable select component
 *
 * Automatically wired to the parent Form.Field context.
 * Supports flat/grouped options, virtualization, custom rendering, and async search.
 *
 * @example Basic usage
 * ```tsx
 * <Form.Field name="timezone" label="Timezone" required>
 *   <Form.Autocomplete
 *     options={timezones}
 *     placeholder="Select timezone..."
 *   />
 * </Form.Field>
 * ```
 *
 * @example Async search
 * ```tsx
 * <Form.Field name="userId" label="User">
 *   <Form.Autocomplete
 *     options={users ?? []}
 *     onSearchChange={setSearch}
 *     loading={isLoading}
 *     placeholder="Search users..."
 *   />
 * </Form.Field>
 * ```
 *
 * @example Grouped options
 * ```tsx
 * <Form.Field name="role" label="Role" required>
 *   <Form.Autocomplete
 *     options={roleGroups}
 *     placeholder="Select a role..."
 *   />
 * </Form.Field>
 * ```
 */
export function FormAutocomplete<T extends AutocompleteOption = AutocompleteOption>({
  disabled,
  className,
  ...props
}: FormAutocompleteProps<T>) {
  const { id, errors, disabled: fieldDisabled, fieldState } = useFieldContext()
  const isDisabled = disabled ?? fieldDisabled
  const hasErrors = errors && errors.length > 0

  const value = fieldState?.value != null ? String(fieldState.value) : ''

  return (
    <Autocomplete<T>
      {...props}
      name={fieldState?.name}
      id={id}
      value={value}
      onValueChange={val => fieldState?.change(val)}
      disabled={isDisabled}
      triggerClassName={cn(hasErrors && 'border-destructive', props.triggerClassName)}
      className={className}
    />
  )
}

FormAutocomplete.displayName = 'Form.Autocomplete'
