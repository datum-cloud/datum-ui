import type { CalendarDatePickerProps } from './types'
import { useDeprecationWarning } from '../_shared'
import { DateRangePicker } from '../picker'

/**
 * @deprecated Use `DateRangePicker` (or `DatePicker`) from
 * `@datum-cloud/datum-ui/picker` instead. This adapter shim ships through
 * 0.10.x and is removed in 1.0.0. See `picker-migration.mdx`.
 */
export function CalendarDatePicker({
  date,
  onDateSelect,
  closeOnSelect,
  numberOfMonths = 2,
  placeholder,
  excludePresets,
  customPresets,
  minDate,
  maxDate,
  disableFuture,
  disablePast,
  className,
  triggerClassName,
  popoverClassName,
  disabled,
  modal,
  responsive = true,
  sheetTitle,
  id,
}: CalendarDatePickerProps) {
  useDeprecationWarning('CalendarDatePicker', 'DateRangePicker')

  // A from-only value (valid per CalendarDatePickerProps, e.g. single-date
  // usage with numberOfMonths={1}) is rendered as a same-day range so the
  // selected date is shown instead of the empty placeholder (BUG-140).
  const value = date?.from
    ? { from: date.from, to: date.to ?? date.from }
    : null

  return (
    <DateRangePicker
      value={value}
      onChange={(next) => {
        if (next === null) {
          onDateSelect(undefined)
        }
        else {
          onDateSelect({ from: next.from, to: next.to })
        }
      }}
      placeholder={placeholder ?? 'Pick a date'}
      sheetTitle={sheetTitle ?? placeholder ?? 'Pick a date'}
      responsive={responsive}
      modal={modal}
      disabled={disabled}
      className={className}
      triggerClassName={triggerClassName}
      popoverClassName={popoverClassName}
      id={id}
      numberOfMonths={numberOfMonths}
      excludePresets={excludePresets}
      presets={customPresets?.map(p => ({
        key: p.key,
        label: p.label,
        getRange: () => ({ from: p.start, to: p.end }),
      }))}
      minDate={minDate}
      maxDate={maxDate}
      disableFuture={disableFuture}
      disablePast={disablePast}
      commit={closeOnSelect ? 'immediate' : undefined}
    />
  )
}

CalendarDatePicker.displayName = 'CalendarDatePicker'
