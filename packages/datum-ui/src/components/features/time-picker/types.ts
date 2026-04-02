/**
 * TimePicker - Simple time input component
 *
 * Provides a native HTML time input for selecting hours and minutes.
 * Value format: "HH:mm" (e.g., "14:30")
 */

export interface TimePickerProps {
  /** Current time value in HH:mm format (e.g., "14:30") */
  'value'?: string
  /** Called when time changes */
  'onChange'?: (value: string) => void
  /** Minimum selectable time in HH:mm format */
  'min'?: string
  /** Maximum selectable time in HH:mm format */
  'max'?: string
  /** Step interval in minutes (default: 1) */
  'step'?: number
  /** Placeholder text */
  'placeholder'?: string
  /** Disable the input */
  'disabled'?: boolean
  /** Additional CSS classes */
  'className'?: string
  /** Input ID */
  'id'?: string
  /** ARIA invalid state */
  'aria-invalid'?: boolean
  /** ARIA described by */
  'aria-describedby'?: string
}
