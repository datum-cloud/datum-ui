import { formatInTimeZone, fromZonedTime, toZonedTime } from 'date-fns-tz'

// Canonical tz-aware day-boundary helpers live in the neutral shared module so
// sibling features (legacy time-range-picker) can consume them without reaching
// into picker internals. Re-exported here for picker-internal consumers.
export { endOfDayInTz, startOfDayInTz } from '../../_shared/timezone'

/** Browser-detected IANA timezone, falling back to UTC if unavailable. */
export function getBrowserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  }
  catch {
    return 'UTC'
  }
}

/**
 * UTC offset for a timezone in `±HH:MM` format.
 * Returns `+00:00` for UTC or any timezone the runtime cannot resolve.
 */
export function getTimezoneOffset(timezone: string): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'shortOffset',
    })
    const parts = formatter.formatToParts(new Date())
    const offsetPart = parts.find(p => p.type === 'timeZoneName')
    if (!offsetPart)
      return '+00:00'

    const match = /GMT([+-])(\d+)(?::(\d+))?/.exec(offsetPart.value)
    if (match) {
      const sign = match[1]!
      const hours = match[2]!.padStart(2, '0')
      const minutes = match[3]?.padStart(2, '0') ?? '00'
      return `${sign}${hours}:${minutes}`
    }
    if (offsetPart.value === 'GMT')
      return '+00:00'
    return '+00:00'
  }
  catch {
    return '+00:00'
  }
}

/**
 * Human-readable timezone label.
 * Example: `'Asia/Jakarta'` → `'Asia/Jakarta (UTC+07:00)'`.
 */
export function formatTimezoneLabel(timezone: string): string {
  const offset = getTimezoneOffset(timezone)
  const display = timezone.replace(/_/g, ' ')
  return `${display} (UTC${offset})`
}

/**
 * Convert a UTC ISO string to a Date object whose wall-clock components
 * (year/month/day/hours/minutes) reflect the value as seen in `timezone`.
 *
 * Use this to feed Calendar / time slot UI that reads `getHours()` etc.
 *
 * Round-trips exactly outside DST transition windows:
 * `zonedDateToIso(isoToZonedDate(iso, tz), tz) === iso`. Inside a DST
 * fall-back the wall-clock hour is ambiguous (it occurs twice), so the
 * round-trip may shift the resulting instant by the DST offset. Callers that
 * must survive the ambiguous hour should key off the original ISO, not the
 * re-encoded one.
 */
export function isoToZonedDate(iso: string, timezone: string): Date {
  return toZonedTime(new Date(iso), timezone)
}

/**
 * Date-input variant of `isoToZonedDate`. Skips the ISO round-trip when the
 * caller already has a Date instance (e.g. preset `getRange(tz)` results).
 */
export function dateToZoned(date: Date, timezone: string): Date {
  return toZonedTime(date, timezone)
}

/**
 * Inverse of `isoToZonedDate`. Treat the Date's wall-clock components
 * as `timezone`-local and convert back to a UTC ISO instant.
 */
export function zonedDateToIso(date: Date, timezone: string): string {
  return fromZonedTime(date, timezone).toISOString()
}

/**
 * Format a UTC ISO string in the given timezone using a date-fns format pattern.
 * Returns empty string if the input is not a valid date.
 */
export function formatInTimezone(iso: string, timezone: string, pattern: string): string {
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime()))
      return ''
    return formatInTimeZone(d, timezone, pattern)
  }
  catch {
    return ''
  }
}
