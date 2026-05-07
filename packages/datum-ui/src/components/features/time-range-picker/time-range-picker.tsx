import type { PresetConfig, TimeRangeValue } from './types'
import { useDeprecationWarning } from '../picker/internal/use-deprecation-warning'
import { DateTimeRangePicker } from '../picker/wrappers/date-time-range-picker'

/**
 * @deprecated Use `DateTimeRangePickerProps` (or `TimeRangePickerProps` for
 * time-of-day-only ranges) from `@datum-cloud/datum-ui/picker` instead. Kept
 * for the legacy `@datum-cloud/datum-ui/time-range-picker` shim, which ships
 * through 0.10.x and is removed in 1.0.0. See `picker-migration.mdx`.
 */
export interface TimeRangePickerProps {
  value: TimeRangeValue | null
  onChange: (value: TimeRangeValue) => void
  onClear?: () => void
  timezone?: string
  presets?: PresetConfig[]
  disableFuture?: boolean
  maxDate?: Date
  minDate?: Date
  className?: string
  disabled?: boolean
  placeholder?: string
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'bottom'
}

/**
 * @deprecated Use `DateTimeRangePicker` from `@datum-cloud/datum-ui/picker`
 * (or `TimeRangePicker` for time-of-day-only ranges). This adapter shim ships
 * through 0.10.x and is removed in 1.0.0. See `picker-migration.mdx`.
 *
 * Notable diff: legacy `TimeRangeValue` envelope had a `type: 'preset' | 'custom'`
 * discriminator. The shim translates to/from the new wrapper's flatter
 * `{ from, to, preset? }` shape.
 */
export function TimeRangePicker({
  value,
  onChange,
  onClear: _onClear,
  timezone,
  presets,
  disableFuture,
  maxDate,
  minDate,
  className,
  disabled,
  placeholder = 'Select time range',
  align: _align,
  side: _side,
}: TimeRangePickerProps) {
  useDeprecationWarning('TimeRangePicker (legacy)', 'DateTimeRangePicker')

  const wrapperValue = value ? { from: value.from, to: value.to } : null

  return (
    <DateTimeRangePicker
      value={wrapperValue}
      onChange={(next) => {
        if (next === null) {
          onChange({ type: 'custom', from: '', to: '' })
          return
        }
        const withPreset = next as { from: string, to: string, preset?: string }
        onChange({
          type: withPreset.preset ? 'preset' : 'custom',
          preset: withPreset.preset,
          from: withPreset.from,
          to: withPreset.to,
        })
      }}
      placeholder={placeholder}
      sheetTitle={placeholder}
      timezone={timezone}
      presets={presets}
      disableFuture={disableFuture}
      maxDate={maxDate}
      minDate={minDate}
      className={className}
      disabled={disabled}
      numberOfMonths={2}
    />
  )
}

TimeRangePicker.displayName = 'TimeRangePicker'
