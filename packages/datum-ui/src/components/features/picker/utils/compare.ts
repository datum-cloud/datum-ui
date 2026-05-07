import type {
  DateRangeTimeValue,
  DateRangeValue,
  DatetimeRangeValue,
  TimeRangeValue,
} from '../types'

/** Strict equality of two nullable Date references by millisecond value. */
export function isSameDate(a: Date | null, b: Date | null): boolean {
  if (a === b)
    return true
  if (a === null || b === null)
    return false
  return a.getTime() === b.getTime()
}

/** Equality of two nullable date ranges. Compares from, to (by ms), and preset. */
export function isSameDateRange(a: DateRangeValue, b: DateRangeValue): boolean {
  if (a === b)
    return true
  if (a === null || b === null)
    return false
  return (
    a.from.getTime() === b.from.getTime()
    && a.to.getTime() === b.to.getTime()
    && a.preset === b.preset
  )
}

/**
 * Equality of two nullable string ranges. Used for time-of-day, time-range,
 * and datetime-range value shapes (all structurally identical).
 * Compares from, to, and optional preset.
 */
export function isSameStringRange(
  a: TimeRangeValue | DatetimeRangeValue | DateRangeTimeValue,
  b: TimeRangeValue | DatetimeRangeValue | DateRangeTimeValue,
): boolean {
  if (a === b)
    return true
  if (a === null || b === null)
    return false
  return a.from === b.from && a.to === b.to && a.preset === b.preset
}
