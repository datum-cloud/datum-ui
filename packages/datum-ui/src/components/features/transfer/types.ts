export interface TransferProps<T = any> {
  /**
   * All available items
   */
  items: T[]

  /**
   * Currently selected item keys
   */
  value: string[]

  /**
   * Called when selection changes
   */
  onChange: (value: string[]) => void

  /**
   * Extract unique key from item
   */
  itemKey: keyof T | ((item: T) => string)

  /**
   * Extract display label from item
   */
  itemLabel: keyof T | ((item: T) => string)

  /**
   * Extract group name from item (optional)
   */
  itemGroup?: keyof T | ((item: T) => string | undefined)

  /**
   * Enable search functionality
   * @default true
   */
  searchable?: boolean

  /**
   * Search input placeholder
   */
  searchPlaceholder?: string

  /**
   * Source panel title
   * @default "Available"
   */
  sourceTitle?: string

  /**
   * Target panel title
   * @default "Selected"
   */
  targetTitle?: string

  /**
   * Show select-all button
   * @default true
   */
  enableSelectAll?: boolean

  /**
   * Disable the component
   */
  disabled?: boolean

  /**
   * Additional CSS class
   */
  className?: string
}

export interface TransferItem<T = any> {
  key: string
  label: string
  group?: string
  data: T
}

export interface TransferPanelData<T = any> {
  items: TransferItem<T>[]
  groups: string[]
}
