/**
 * TimePicker - Scrollable time-slot dropdown
 *
 * Renders a ResponsivePopover with selectable time slots generated
 * from min/max/step. Value format: "HH:mm" (e.g., "14:30").
 *
 * @deprecated Use `TimePickerProps` from `@datum-cloud/datum-ui/picker`
 * instead. Kept for the legacy `@datum-cloud/datum-ui/time-picker` shim,
 * which ships through 0.10.x and is removed in 1.0.0. See
 * `picker-migration.mdx`.
 */

export interface TimePickerProps {
  /** Current time value in HH:mm format (e.g., "14:30") */
  value?: string
  /** Called when time changes */
  onChange?: (value: string) => void
  /** Minimum selectable time in HH:mm format */
  min?: string
  /** Maximum selectable time in HH:mm format */
  max?: string
  /** Step interval in minutes (default: 15) */
  step?: number
  /** Placeholder text */
  placeholder?: string
  /** Disable the picker */
  disabled?: boolean
  /** Additional CSS classes */
  className?: string
  /** Input ID */
  id?: string
  /** HTML name attribute for hidden input */
  name?: string
  /** Force desktop popover even on mobile. Default: true. */
  responsive?: boolean
  /** Title shown in the mobile sheet header. */
  sheetTitle?: string
}
