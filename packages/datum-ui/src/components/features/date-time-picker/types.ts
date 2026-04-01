export interface DateTimePickerProps {
  /**
   * Current value (UTC ISO string)
   * @example "2024-01-15T14:30:00Z"
   */
  value?: string

  /**
   * Called when value changes
   */
  onChange?: (value: string) => void

  /**
   * Minimum selectable date
   */
  minDate?: Date

  /**
   * Maximum selectable date
   */
  maxDate?: Date

  /**
   * Dates that should be disabled
   */
  disabledDates?: Date[] | ((date: Date) => boolean)

  /**
   * Timezone for display (defaults to browser timezone)
   * @example "America/New_York"
   */
  timezone?: string

  /**
   * Show timezone indicator below input
   * @default false
   */
  showTimezoneIndicator?: boolean

  /**
   * Input placeholder text
   */
  placeholder?: string

  /**
   * Disable the input
   */
  disabled?: boolean

  /**
   * Additional CSS class
   */
  className?: string

  /**
   * Whether the popover is modal (prevents interaction with elements outside)
   * Required when using inside a Dialog/Modal component
   * @default true
   */
  modal?: boolean
}

/**
 * Internal state for date + time selection
 */
export interface DateTimeState {
  date: Date | undefined
  time: string // HH:mm format
}
