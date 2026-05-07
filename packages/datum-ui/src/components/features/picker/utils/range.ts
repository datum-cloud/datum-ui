import { differenceInCalendarDays } from 'date-fns'

/**
 * Number of calendar days between two dates. Always non-negative.
 *
 * Uses calendar-day boundaries (not 24-hour windows), so a range from
 * 23:59 today to 00:00 tomorrow counts as 1 day, not 0.
 */
export function getDaysDifference(from: Date, to: Date): number {
  return Math.abs(differenceInCalendarDays(to, from))
}

/**
 * Validate a range against a maximum span (inclusive).
 *
 * - Returns `true` when `maxRange` is undefined.
 * - Returns `true` when the range spans at most `maxRange` days.
 */
export function isRangeValid(from: Date, to: Date, maxRange?: number): boolean {
  if (maxRange === undefined)
    return true
  return getDaysDifference(from, to) <= maxRange
}

/**
 * Clamp a range to fit within `maxRange` days.
 *
 * If the range already fits, returns the original `{from, to}`.
 * Otherwise, holds `from` and clamps `to` forward to exactly `maxRange`
 * days after `from`.
 */
export function clampRange(
  from: Date,
  to: Date,
  maxRange: number,
): { from: Date, to: Date } {
  if (isRangeValid(from, to, maxRange)) {
    return { from, to }
  }
  const clampedTo = new Date(from.getTime() + maxRange * 24 * 60 * 60 * 1000)
  return { from, to: clampedTo }
}
