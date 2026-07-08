// app/modules/datum-ui/components/time-range-picker/utils/timezone.ts
//
// Consolidated onto the canonical picker timezone module (STRUCT-011). The
// offset/label/browser helpers and the ISO<->zoned conversions are re-used
// from `picker/utils/timezone`; only the `TimezoneOption`-shaped helpers and
// the `datetime-local` input-string helpers (unique to this deprecated shim)
// live here.
import type { TimezoneOption } from '../types'
import { format, parse } from 'date-fns'
import { fromZonedTime, toZonedTime } from 'date-fns-tz'
import {
  formatTimezoneLabel,
  getBrowserTimezone,
  getTimezoneOffset,
  isoToZonedDate,
  zonedDateToIso,
} from '../../picker/utils/timezone'

export { formatTimezoneLabel, getBrowserTimezone, getTimezoneOffset }

/**
 * Create a TimezoneOption from a timezone string
 */
export function createTimezoneOption(timezone: string): TimezoneOption {
  return {
    value: timezone,
    label: formatTimezoneLabel(timezone),
    offset: getTimezoneOffset(timezone),
  }
}

/**
 * Get default timezone options (user's timezone + UTC)
 */
export function getDefaultTimezoneOptions(userTimezone?: string): TimezoneOption[] {
  const options: TimezoneOption[] = []

  // Add user's timezone first
  if (userTimezone && userTimezone !== 'UTC') {
    options.push(createTimezoneOption(userTimezone))
  }

  // Always include UTC
  options.push({
    value: 'UTC',
    label: 'UTC (+00:00)',
    offset: '+00:00',
  })

  return options
}

/**
 * Get short offset display (e.g., "UTC+7")
 */
export function getShortTimezoneDisplay(timezone: string): string {
  const offset = getTimezoneOffset(timezone)
  // Convert "+07:00" to "+7" or "-05:30" to "-5:30"
  const match = offset.match(/([+-])(\d+):(\d+)/)
  if (match) {
    const sign = match[1]!
    const hours = Number.parseInt(match[2]!, 10)
    const minutes = match[3]!
    if (minutes === '00') {
      return `UTC${sign}${hours}`
    }
    return `UTC${sign}${hours}:${minutes}`
  }
  return `UTC${offset}`
}

/**
 * Convert a UTC Date to a local datetime-local input string in the given timezone
 * @example utcToLocalInputString(new Date('2026-01-16T04:00:00Z'), 'Asia/Jakarta') => '2026-01-16T11:00'
 */
export function utcToLocalInputString(utcDate: Date, timezone: string): string {
  const zonedDate = toZonedTime(utcDate, timezone)
  return format(zonedDate, 'yyyy-MM-dd\'T\'HH:mm')
}

/**
 * Convert a local datetime-local input string to a UTC Date
 * @example localInputStringToUtc('2026-01-16T11:00', 'Asia/Jakarta') => Date('2026-01-16T04:00:00Z')
 */
export function localInputStringToUtc(localString: string, timezone: string): Date {
  // Parse the local string as a date (without timezone info)
  const parsed = parse(localString, 'yyyy-MM-dd\'T\'HH:mm', new Date())
  // Convert from local timezone to UTC
  return fromZonedTime(parsed, timezone)
}

/**
 * Convert a UTC ISO string to a Date for display in user's timezone
 */
export function utcStringToZonedDate(utcString: string, timezone: string): Date {
  return isoToZonedDate(utcString, timezone)
}

/**
 * Convert a zoned Date to UTC ISO string
 */
export function zonedDateToUtcString(zonedDate: Date, timezone: string): string {
  return zonedDateToIso(zonedDate, timezone)
}

/**
 * Format a UTC ISO string for display in user's timezone
 * @example formatUtcForDisplay('2026-01-16T04:00:00Z', 'Asia/Jakarta') => 'Jan 16, 2026 11:00'
 */
export function formatUtcForDisplay(
  utcString: string,
  timezone: string,
  formatString: string = 'MMM d, yyyy HH:mm',
): string {
  const zonedDate = utcStringToZonedDate(utcString, timezone)
  return format(zonedDate, formatString)
}
