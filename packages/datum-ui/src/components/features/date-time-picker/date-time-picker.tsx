import type { DateTimePickerProps } from './types'
import { useDeprecationWarning } from '../_shared'
import { DateTimePicker as PickerDateTimePicker } from '../picker'

/**
 * @deprecated Use `DateTimePicker` from `@datum-cloud/datum-ui/picker`
 * instead. This adapter shim ships through 0.10.x and is removed in 1.0.0.
 * See `picker-migration.mdx`.
 *
 * Notable diff: legacy `showTimezoneIndicator` (default `false`) is the
 * inverse of the new `hideTimezone` prop. The shim handles the inversion
 * and pins the trigger label / time-input UX to the legacy semantics
 * (typeable input via `timeInputMode='input'`, bare TZ name via
 * `timezoneIndicatorVariant='compact'`).
 */
export function DateTimePicker({
  value,
  onChange,
  minDate,
  maxDate,
  disabledDates: _disabledDates,
  disablePast,
  disableFuture,
  timezone,
  showTimezoneIndicator = false,
  placeholder,
  disabled,
  className,
  modal,
  sheetTitle,
  sheetDescription,
  responsive = true,
}: DateTimePickerProps) {
  useDeprecationWarning('DateTimePicker (legacy)', 'DateTimePicker')

  return (
    <PickerDateTimePicker
      value={value ?? null}
      onChange={(next) => { onChange?.(next ?? '') }}
      placeholder={placeholder ?? 'Select date and time'}
      sheetTitle={sheetTitle ?? placeholder ?? 'Select date and time'}
      sheetDescription={sheetDescription}
      responsive={responsive}
      modal={modal}
      disabled={disabled}
      className={className}
      hideTimezone={!showTimezoneIndicator}
      timezone={timezone}
      minDate={minDate}
      maxDate={maxDate}
      disablePast={disablePast}
      disableFuture={disableFuture}
      timeInputMode="input"
      timezoneIndicatorVariant="compact"
      hourCycle="24"
    />
  )
}

DateTimePicker.displayName = 'DateTimePicker'
