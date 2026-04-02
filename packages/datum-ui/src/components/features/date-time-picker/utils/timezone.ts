import { formatInTimeZone, fromZonedTime, toZonedTime } from 'date-fns-tz'

/**
 * Get the browser's timezone
 */
export function getBrowserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

/**
 * Convert local date + time to UTC ISO string
 * @param date - Date object (date part)
 * @param time - Time string in HH:mm format
 * @param timezone - IANA timezone (e.g., "America/New_York")
 * @returns UTC ISO string
 */
export function localDateTimeToUtc(
  date: Date,
  time: string,
  timezone: string,
): string {
  try {
    // Parse time (HH:mm)
    const [hours, minutes] = time.split(':').map(Number)

    // Create a date string in the format YYYY-MM-DD HH:mm
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateTimeString = `${year}-${month}-${day} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`

    // Parse this as a date in the specified timezone and convert to UTC
    const utcDate = fromZonedTime(dateTimeString, timezone)

    return utcDate.toISOString()
  }
  catch {
    // Invalid timezone — fall back to UTC
    // Fallback to UTC: combine date and time, convert to ISO string
    const [hours = 0, minutes = 0] = time.split(':').map(Number)
    const combined = new Date(date)
    combined.setUTCHours(hours, minutes, 0, 0)
    return combined.toISOString()
  }
}

/**
 * Convert UTC ISO string to local date + time
 * @param utcString - UTC ISO string
 * @param timezone - IANA timezone
 * @returns Object with date and time (HH:mm)
 */
export function utcToLocalDateTime(
  utcString: string,
  timezone: string,
): { date: Date, time: string } {
  try {
    const utcDate = new Date(utcString)

    // Format the UTC date in the target timezone
    const time = formatInTimeZone(utcDate, timezone, 'HH:mm')

    // Get the zoned date for the date part
    const zonedDate = toZonedTime(utcDate, timezone)

    return {
      date: zonedDate,
      time,
    }
  }
  catch {
    // Invalid timezone — fall back to UTC
    // Fallback to UTC: use the UTC date directly
    const utcDate = new Date(utcString)
    const hours = utcDate.getUTCHours()
    const minutes = utcDate.getUTCMinutes()
    const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`

    return {
      date: utcDate,
      time,
    }
  }
}
