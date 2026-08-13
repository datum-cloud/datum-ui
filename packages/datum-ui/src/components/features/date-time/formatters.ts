import type { FormatterOptions } from './types'
import { format as dateFormat, formatDistanceToNowStrict } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'
import { enUS } from 'date-fns/locale/en-US'

/** e.g. "June 12th at 11:30 AM" — used for absolute / table dates. */
export const DEFAULT_DATE_FORMAT = 'MMMM do \'at\' h:mm a'

export function getBrowserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  }
  catch {
    return 'UTC'
  }
}

export function parseDate(date: string | Date): Date | null {
  const parsedDate = date instanceof Date ? date : new Date(date)

  if (!date || Number.isNaN(parsedDate.getTime())) {
    return null
  }

  return parsedDate
}

export function formatAbsoluteDate(date: Date, options: FormatterOptions): string {
  const formatString = options.format || DEFAULT_DATE_FORMAT

  if (options.disableTimezone) {
    return dateFormat(date, formatString, { locale: enUS })
  }

  return formatInTimeZone(date, options.timezone, formatString, { locale: enUS })
}

export function formatRelativeDate(date: Date, options: FormatterOptions): string {
  return formatDistanceToNowStrict(date, {
    addSuffix: options.addSuffix ?? true,
  })
}

export function getTimezoneAbbreviation(date: Date, timezone: string): string {
  return formatInTimeZone(date, timezone, 'zzz', { locale: enUS })
}

export function formatCombinedDate(
  date: Date,
  options: FormatterOptions,
  separator: string = ' ',
): string {
  const absolute = formatAbsoluteDate(date, options)
  const relative = formatRelativeDate(date, options)

  return `${absolute}${separator}(${relative})`
}

export function formatUTCDate(date: Date, format: string = 'dd MMM yy HH:mm:ss'): string {
  return formatInTimeZone(date, 'UTC', format, { locale: enUS })
}

export function formatTimezoneDate(
  date: Date,
  timezone: string,
  format: string = 'dd MMM yy HH:mm:ss',
): string {
  return formatInTimeZone(date, timezone, format, { locale: enUS })
}

/** Microseconds since epoch, matching the Datum DateTime tooltip. */
export function getTimestamp(date: Date): string {
  return (date.getTime() * 1000).toString()
}
