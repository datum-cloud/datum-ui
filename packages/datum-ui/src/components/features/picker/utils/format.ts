/**
 * Format a Date as YYYY-MM-DD using local-time components.
 *
 * Note: this is the consumer-friendly format for date-only modes.
 * It does NOT round-trip through timezones; that's intentional —
 * a calendar day has no timezone.
 */
export function dateToYYYYMMDD(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * Extract `"HH:mm"` from a Date using its wall-clock components.
 *
 * Caller is responsible for ensuring those components reflect the
 * intended timezone (typically via `dateToZoned` / `isoToZonedDate`
 * upstream). Pads single-digit hour/minute to two characters.
 */
export function dateToHHmm(d: Date): string {
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

const TIME_REGEX = /^(\d{2}):(\d{2})$/

/**
 * Strict HH:mm validation. Rejects single-digit components,
 * out-of-range hours/minutes, and any non-numeric content.
 */
export function isValidTimeString(s: string): boolean {
  const match = TIME_REGEX.exec(s)
  if (!match)
    return false
  const h = Number(match[1])
  const m = Number(match[2])
  return h >= 0 && h <= 23 && m >= 0 && m <= 59
}

/**
 * Parse a HH:mm string. Returns null for invalid input.
 */
export function parseTimeString(s: string): { h: number, m: number } | null {
  if (!isValidTimeString(s))
    return null
  const match = TIME_REGEX.exec(s)!
  return { h: Number(match[1]), m: Number(match[2]) }
}

/**
 * Format a HH:mm string for user display, respecting hour cycle.
 *
 * - `'24'`: returns the input as-is (`"14:30"`)
 * - `'12'`: returns `"2:30 PM"` style with AM/PM and no leading zero on hour
 *
 * Returns empty string for invalid input — callers should validate first.
 */
export function formatTimeLabel(time: string, hourCycle: '12' | '24'): string {
  const parsed = parseTimeString(time)
  if (!parsed)
    return ''
  if (hourCycle === '24') {
    return time
  }
  const period = parsed.h >= 12 ? 'PM' : 'AM'
  const h12 = parsed.h === 0 ? 12 : parsed.h > 12 ? parsed.h - 12 : parsed.h
  const m = String(parsed.m).padStart(2, '0')
  return `${h12}:${m} ${period}`
}
