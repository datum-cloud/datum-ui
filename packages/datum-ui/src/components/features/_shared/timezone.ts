import { fromZonedTime, toZonedTime } from 'date-fns-tz'

/**
 * Start of the calendar day (00:00:00.000) for `date`, interpreted in
 * `timezone`, returned as a real UTC instant.
 *
 * Shared canonical implementation — preset engines (picker + legacy
 * time-range-picker) build tz-aware day boundaries on top of this.
 */
export function startOfDayInTz(date: Date, timezone: string): Date {
  const zoned = toZonedTime(date, timezone)
  zoned.setHours(0, 0, 0, 0)
  return fromZonedTime(zoned, timezone)
}

/**
 * End of the calendar day (23:59:59.999) for `date`, interpreted in
 * `timezone`, returned as a real UTC instant.
 */
export function endOfDayInTz(date: Date, timezone: string): Date {
  const zoned = toZonedTime(date, timezone)
  zoned.setHours(23, 59, 59, 999)
  return fromZonedTime(zoned, timezone)
}
