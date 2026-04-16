import type * as React from 'react'
import type { OptionPickerGroup, OptionPickerOption } from '../../base/option-picker'

// ============================================================================
// Option Types — aliases of engine types
// ============================================================================

export type AutocompleteOption = OptionPickerOption

export type AutocompleteGroup<T extends AutocompleteOption = AutocompleteOption> = OptionPickerGroup<T>

// ============================================================================
// Primitive Props
// ============================================================================

export interface AutocompleteProps<T extends AutocompleteOption = AutocompleteOption> {
  // Data
  /** Flat options array or grouped options. Groups auto-detected by shape. */
  options: T[] | AutocompleteGroup<T>[]

  // Controlled value
  /** Currently selected option value */
  value?: string
  /** Called when selection changes */
  onValueChange?: (value: string) => void

  // Search
  /** When provided, disables built-in filtering and delegates to consumer. */
  onSearchChange?: (value: string) => void
  /** Placeholder for the search input */
  searchPlaceholder?: string
  /** Hide the search input entirely */
  disableSearch?: boolean

  // Rendering
  /** Custom render for each option in the dropdown */
  renderOption?: (option: T, isSelected: boolean) => React.ReactNode
  /** Custom render for the selected value in the trigger */
  renderValue?: (option: T) => React.ReactNode
  /** Placeholder text when no value selected */
  placeholder?: string
  /** Content shown when no options match */
  emptyContent?: React.ReactNode
  /** Footer content below options list (e.g., "Add new..." action) */
  footer?: React.ReactNode

  // Behavior
  /** Allow custom values not in the options list */
  creatable?: boolean
  /** Custom render for the creatable item. Default: (value) => `Use "${value}"` */
  creatableLabel?: (value: string) => React.ReactNode
  /** Enable virtualization for large lists (default: false) */
  virtualize?: boolean
  /** Item height in pixels for virtualizer estimateSize (default: 36) */
  itemSize?: number
  /** External loading state */
  loading?: boolean
  /** Popover modal mode - required when using inside a Dialog/Modal component (default: true) */
  modal?: boolean
  /** Force desktop popover even on mobile. Default: true (responsive). */
  responsive?: boolean
  /** Title shown in the mobile sheet header. Default: placeholder ?? 'Search'. */
  sheetTitle?: string

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
  /** Additional CSS classes for the trigger button */
  triggerClassName?: string
  /** Additional CSS classes for the popover content */
  contentClassName?: string
  /** Additional CSS classes for the command list */
  listClassName?: string
}

// ============================================================================
// Form Component Props
// ============================================================================

/**
 * Props for Form.Autocomplete - same as the primitive but without
 * value/onValueChange/name/id which come from FieldContext + useInputControl.
 */
export type FormAutocompleteProps<T extends AutocompleteOption = AutocompleteOption> = Omit<
  AutocompleteProps<T>,
  'value' | 'onValueChange' | 'name' | 'id'
>
