import type { HourCycle, PickerMode } from '../types'
import { format as formatDateFns } from 'date-fns'
import { dateToHHmm, formatTimeLabel, parseTimeString } from './format'
import { isoToZonedDate } from './timezone'

interface FormatOptions {
  timezone?: string
  hourCycle?: HourCycle
  locale?: string
  /**
   * date-fns format pattern for the date portion of the display label.
   * When set, replaces the default `MMM dd, yyyy`-style locale rendering.
   * Examples: `'dd/MM/yyyy'`, `'EEE, MMM do'`, `'yyyy-MM-dd'`.
   */
  dateFormat?: string
  /**
   * date-fns format pattern for the time portion of the display label.
   * When set, replaces the default `HH:mm` rendering (overrides `hourCycle`).
   * Examples: `'HH:mm'`, `'hh:mm a'`, `'HH:mm:ss'`.
   */
  timeFormat?: string
}

const DATE_OPTS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
}

function safeDate(input: unknown): Date | null {
  if (input instanceof Date && !Number.isNaN(input.getTime()))
    return input
  return null
}

function safeIso(input: unknown, timezone: string): Date | null {
  if (typeof input !== 'string')
    return null
  try {
    const d = isoToZonedDate(input, timezone)
    return Number.isNaN(d.getTime()) ? null : d
  }
  catch {
    return null
  }
}

function formatDate(d: Date, locale?: string, dateFormat?: string): string {
  if (dateFormat)
    return formatDateFns(d, dateFormat)
  return d.toLocaleDateString(locale, DATE_OPTS)
}

/** Renders `HH:mm` from a Date whose wall-clock fields are already in the target timezone. */
function formatZonedTimeOfDay(d: Date, hourCycle: HourCycle, timeFormat?: string): string {
  if (timeFormat)
    return formatDateFns(d, timeFormat)
  return formatTimeLabel(dateToHHmm(d), hourCycle)
}

/**
 * Renders a `"HH:mm"` time-of-day string. Honors `timeFormat` (date-fns pattern)
 * by lifting the value into a Date and formatting; falls back to `formatTimeLabel`
 * (hourCycle-aware) otherwise.
 */
function formatTimeOfDayString(value: string, hourCycle: HourCycle, timeFormat?: string): string {
  if (!timeFormat)
    return formatTimeLabel(value, hourCycle)
  const parsed = parseTimeString(value)
  if (!parsed)
    return ''
  const d = new Date()
  d.setHours(parsed.h, parsed.m, 0, 0)
  return formatDateFns(d, timeFormat)
}

function isSameZonedDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate()
  )
}

/**
 * Renders a human-readable trigger label for any picker mode.
 * Returns the empty string when the value is null/undefined or unparseable.
 */
export function formatPickerValue(
  value: unknown,
  mode: PickerMode,
  opts: FormatOptions = {},
): string {
  if (value === null || value === undefined)
    return ''

  const timezone = opts.timezone ?? 'UTC'
  const hourCycle: HourCycle = opts.hourCycle ?? '24'
  const locale = opts.locale
  const dateFormat = opts.dateFormat
  const timeFormat = opts.timeFormat

  if (mode === 'date') {
    const d = safeDate(value)
    return d ? formatDate(d, locale, dateFormat) : ''
  }

  if (mode === 'date-range') {
    const v = value as { from?: unknown, to?: unknown }
    const from = safeDate(v?.from)
    const to = safeDate(v?.to)
    if (!from || !to)
      return ''
    return `${formatDate(from, locale, dateFormat)} - ${formatDate(to, locale, dateFormat)}`
  }

  if (mode === 'time') {
    return typeof value === 'string' ? formatTimeOfDayString(value, hourCycle, timeFormat) : ''
  }

  if (mode === 'time-range') {
    const v = value as { from?: unknown, to?: unknown }
    if (typeof v?.from !== 'string' || typeof v?.to !== 'string')
      return ''
    return `${formatTimeOfDayString(v.from, hourCycle, timeFormat)} - ${formatTimeOfDayString(v.to, hourCycle, timeFormat)}`
  }

  if (mode === 'datetime') {
    const d = safeIso(value, timezone)
    return d ? `${formatDate(d, locale, dateFormat)} ${formatZonedTimeOfDay(d, hourCycle, timeFormat)}` : ''
  }

  if (mode === 'datetime-range') {
    const v = value as { from?: unknown, to?: unknown }
    const from = safeIso(v?.from, timezone)
    const to = safeIso(v?.to, timezone)
    if (!from || !to)
      return ''
    const sameDay = isSameZonedDay(from, to)
    if (sameDay) {
      return `${formatDate(from, locale, dateFormat)} ${formatZonedTimeOfDay(from, hourCycle, timeFormat)} - ${formatZonedTimeOfDay(to, hourCycle, timeFormat)}`
    }
    return `${formatDate(from, locale, dateFormat)} ${formatZonedTimeOfDay(from, hourCycle, timeFormat)} - ${formatDate(to, locale, dateFormat)} ${formatZonedTimeOfDay(to, hourCycle, timeFormat)}`
  }

  if (mode === 'date-range-time') {
    const v = value as { from?: unknown, to?: unknown }
    const from = safeIso(v?.from, timezone)
    const to = safeIso(v?.to, timezone)
    if (!from || !to)
      return ''
    return `${formatDate(from, locale, dateFormat)} - ${formatDate(to, locale, dateFormat)} (${formatZonedTimeOfDay(from, hourCycle, timeFormat)})`
  }

  return ''
}
