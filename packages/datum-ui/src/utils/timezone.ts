/**
 * Timezone-aware conversion utilities for date filters.
 *
 * Handles conversion between a user's timezone and UTC for accurate
 * time-range queries (e.g. log/metric filtering, date-based search).
 */
import { endOfDay, startOfDay } from 'date-fns'
import { fromZonedTime, toZonedTime } from 'date-fns-tz'

/**
 * Convert a date to start of day in the specified timezone, then to a UTC
 * timestamp in seconds.
 *
 * @param date - The date to convert.
 * @param timezone - The IANA timezone to interpret the date in (e.g. `'America/New_York'`).
 * @returns Unix timestamp in seconds (UTC).
 */
export function toUTCTimestampStartOfDay(date: Date, timezone: string): number {
  const zonedDate = toZonedTime(date, timezone)
  const startOfDayInTz = startOfDay(zonedDate)
  const utcDate = fromZonedTime(startOfDayInTz, timezone)
  return Math.floor(utcDate.getTime() / 1000)
}

/**
 * Convert a date to end of day in the specified timezone, then to a UTC
 * timestamp in seconds.
 *
 * @param date - The date to convert.
 * @param timezone - The IANA timezone to interpret the date in.
 * @returns Unix timestamp in seconds (UTC).
 */
export function toUTCTimestampEndOfDay(date: Date, timezone: string): number {
  const zonedDate = toZonedTime(date, timezone)
  const endOfDayInTz = endOfDay(zonedDate)
  const utcDate = fromZonedTime(endOfDayInTz, timezone)
  return Math.floor(utcDate.getTime() / 1000)
}
