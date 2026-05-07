import type { CalendarDatePickerProps } from './types'
import { useDeprecationWarning } from '../picker/internal/use-deprecation-warning'
import { DateRangePicker } from '../picker/wrappers/date-range-picker'

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

  const value = date && date.from && date.to
    ? { from: date.from, to: date.to }
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
