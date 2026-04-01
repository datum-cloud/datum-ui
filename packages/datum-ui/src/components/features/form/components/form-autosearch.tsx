import type { FormAutocompleteProps } from '../../autocomplete/autocomplete.types'
import { FormAutocomplete } from './form-autocomplete'

/**
 * Form.Autosearch - Alias to Form.Autocomplete with search-first focus
 *
 * This is a convenience wrapper around Form.Autocomplete that emphasizes
 * the search functionality. It's functionally identical to Form.Autocomplete.
 *
 * @example Basic usage
 * ```tsx
 * <Form.Field name="search" label="Search">
 *   <Form.Autosearch
 *     options={options}
 *     placeholder="Type to search..."
 *   />
 * </Form.Field>
 * ```
 */
export function FormAutosearch<T extends { value: string, label: string }>(
  props: FormAutocompleteProps<T>,
) {
  return <FormAutocomplete {...props} />
}

FormAutosearch.displayName = 'Form.Autosearch'
