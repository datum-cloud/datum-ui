import type { DateRange } from 'react-day-picker'
import { Calendar } from '../../../base/calendar'
import { useDateConstraints } from '../../../base/date-picker'
import { isDateBearingMode } from '../types'
import { isoToZonedDate, zonedDateToIso } from '../utils/timezone'
import { usePickerContext } from './context'

/**
 * Override the base Calendar's default `w-fit` root so the calendar fills the
 * mobile sheet width (cells flex via the underlying day-picker) and reverts to
 * intrinsic width on `md` and above.
 */
const CALENDAR_RESPONSIVE_CLASSNAMES = { root: 'w-full md:w-fit' }

/**
 * react-day-picker hands back the clicked day cell at midnight, discarding any
 * time-of-day the user already chose via the time input. Re-apply the previous
 * wall-clock time (read from the pending ISO in the display timezone) onto the
 * newly clicked day so selecting a different date keeps the time (BUG-033).
 */
function mergeTimeFromIso(day: Date, prevIso: unknown, timezone: string): Date {
  const merged = new Date(day)
  if (typeof prevIso === 'string') {
    const prev = isoToZonedDate(prevIso, timezone)
    if (!Number.isNaN(prev.getTime())) {
      merged.setHours(prev.getHours(), prev.getMinutes(), prev.getSeconds(), prev.getMilliseconds())
    }
  }
  return merged
}

interface PickerCalendarProps {
  numberOfMonths?: 1 | 2
  className?: string
  minDate?: Date
  maxDate?: Date
  disablePast?: boolean
  disableFuture?: boolean
}

export function PickerCalendar({
  numberOfMonths = 1,
  className,
  minDate,
  maxDate,
  disablePast,
  disableFuture,
}: PickerCalendarProps) {
  const { mode, timezone, state, actions } = usePickerContext()

  const { effectiveMinDate, effectiveMaxDate, isDateDisabled } = useDateConstraints({
    minDate,
    maxDate,
    disablePast,
    disableFuture,
  })

  if (!isDateBearingMode(mode)) {
    return null
  }

  const month = state.monthFrom ?? (() => {
    if (mode === 'date' && state.pendingValue instanceof Date)
      return state.pendingValue
    if (mode === 'datetime' && typeof state.pendingValue === 'string')
      return isoToZonedDate(state.pendingValue, timezone)
    return undefined
  })()

  if (mode === 'date-range' || mode === 'date-range-time' || mode === 'datetime-range') {
    const v = state.pendingValue as { from: Date | string, to: Date | string } | null
    const selected: DateRange | undefined = v
      ? mode === 'date-range'
        ? { from: v.from as Date, to: v.to as Date }
        : { from: isoToZonedDate(v.from as string, timezone), to: isoToZonedDate(v.to as string, timezone) }
      : undefined
    return (
      <Calendar
        mode="range"
        selected={selected}
        onSelect={(range) => {
          if (!range?.from || !range?.to)
            return
          if (mode === 'date-range') {
            actions.setRange({ from: range.from, to: range.to })
          }
          else {
            const prev = v as { from?: unknown, to?: unknown } | null
            actions.setDatetimeRange({
              from: zonedDateToIso(mergeTimeFromIso(range.from, prev?.from, timezone), timezone),
              to: zonedDateToIso(mergeTimeFromIso(range.to, prev?.to, timezone), timezone),
            })
          }
        }}
        defaultMonth={month}
        month={month}
        onMonthChange={actions.setMonthFrom}
        numberOfMonths={numberOfMonths}
        disabled={isDateDisabled}
        startMonth={effectiveMinDate}
        endMonth={effectiveMaxDate}
        className={className}
        classNames={CALENDAR_RESPONSIVE_CLASSNAMES}
      />
    )
  }

  // Single-date and single-datetime
  const selected = state.pendingValue instanceof Date
    ? state.pendingValue
    : (mode === 'datetime' && typeof state.pendingValue === 'string'
        ? isoToZonedDate(state.pendingValue, timezone)
        : undefined)

  return (
    <Calendar
      mode="single"
      selected={selected}
      onSelect={(d) => {
        if (!d)
          return
        if (mode === 'date') {
          actions.setSingleDate(d)
        }
        else if (mode === 'datetime') {
          const merged = mergeTimeFromIso(d, state.pendingValue, timezone)
          actions.setSingleDatetime(zonedDateToIso(merged, timezone))
        }
      }}
      defaultMonth={month}
      month={month}
      onMonthChange={actions.setMonthFrom}
      disabled={isDateDisabled}
      startMonth={effectiveMinDate}
      endMonth={effectiveMaxDate}
      className={className}
      classNames={CALENDAR_RESPONSIVE_CLASSNAMES}
    />
  )
}

PickerCalendar.displayName = 'Picker.Calendar'
