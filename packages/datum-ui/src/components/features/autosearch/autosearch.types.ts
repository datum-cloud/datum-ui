import type * as React from 'react'
import type { AutocompleteOption } from '../autocomplete/autocomplete.types'

// ============================================================================
// Default Extractor
// ============================================================================

/**
 * Default function to extract searchable text from an option.
 * Combines label, description, and value for comprehensive searching.
 */
export function defaultAutosearchValue(option: AutocompleteOption) {
  return [option.label, option.description, option.value].filter(Boolean).join(' ')
}

// ============================================================================
// Primitive Props
// ============================================================================

export interface AutosearchProps {
  // Data
  /** Options to display in search results */
  options: AutocompleteOption[]

  // Controlled value
  /** Currently selected option value */
  value?: string
  /** Called when selection changes */
  onValueChange?: (value: string) => void

  // Search
  /** Callback when search query changes (debounced) */
  onSearch?: (query: string) => void
  /** Debounce delay in ms (default: 300) */
  searchDebounceMs?: number
  /** Extract searchable text from option for Command filtering */
  getValue?: (option: AutocompleteOption) => string

  // Rendering
  /** Placeholder text for search input */
  placeholder?: string
  /** Message shown when no results found */
  emptyMessage?: string
  /** Content shown when no options match after search */
  emptyContent?: React.ReactNode

  // Behavior
  /** External loading state */
  loading?: boolean
  /** Popover modal mode */
  modal?: boolean

  // State
  /** Disable the component */
  disabled?: boolean
  /** HTML name attribute for hidden input */
  name?: string
  /** HTML id attribute */
  id?: string

  // Styling
  /** Additional CSS classes for the root wrapper */
  className?: string
  /** Additional CSS classes for the input */
  inputClassName?: string
  /** Additional CSS classes for the popover content */
  contentClassName?: string
  /** Additional CSS classes for the selected value card */
  selectedClassName?: string
}

// ============================================================================
// Form Component Props
// ============================================================================

/**
 * Props for Form.Autosearch - same as the primitive but without
 * value/onValueChange/name/id which come from FieldContext.
 */
export type FormAutosearchProps = Omit<
  AutosearchProps,
  'value' | 'onValueChange' | 'name' | 'id'
>
