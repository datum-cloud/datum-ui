export interface ComboboxOption {
  value: string
  label: string
  disabled?: boolean
}

export interface ComboboxGroup {
  label: string
  options: ComboboxOption[]
}

export interface ComboboxProps {
  /**
   * Available options (flat or grouped)
   */
  'options': ComboboxOption[] | ComboboxGroup[]

  /**
   * Selected value
   */
  'value'?: string

  /**
   * Called when selection changes
   */
  'onChange'?: (value: string | undefined) => void

  /**
   * Placeholder for trigger button
   * @default "Select option..."
   */
  'placeholder'?: string

  /**
   * Placeholder for search input
   * @default "Search..."
   */
  'searchPlaceholder'?: string

  /**
   * Message shown when no options match
   * @default "No options found."
   */
  'emptyMessage'?: string

  /**
   * Disable the combobox
   */
  'disabled'?: boolean

  /**
   * Additional CSS classes for container
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
   * ID for the combobox
   */
  'id'?: string

  /**
   * Test ID
   */
  'data-testid'?: string
}
