import type { ReactNode } from 'react'

export type DateTimeVariant = 'absolute' | 'relative' | 'both' | 'detailed'

export type TooltipMode = boolean | 'auto' | 'timezone' | 'alternate' | 'detailed'

export interface DateTimeProps {
  /** Date to format — a `Date` or parseable ISO string. */
  date?: string | Date
  /**
   * `absolute` — formatted date.
   * `relative` — "X ago".
   * `both` — absolute plus relative.
   * `detailed` — absolute in the trigger; tooltip lists UTC, local, relative, and epoch.
   */
  variant?: DateTimeVariant
  /** date-fns format string for absolute dates. */
  format?: string
  /** Append "ago" (and similar) to relative dates. Defaults to true. */
  addSuffix?: boolean
  /**
   * Tooltip behavior:
   * - true/false: show or hide
   * - `auto`: opposite format, or timezone for absolute dates
   * - `timezone`: timezone name and abbreviation
   * - `alternate`: opposite of the visible variant
   * - `detailed`: UTC, local zone, relative, and epoch
   */
  tooltip?: TooltipMode
  /** IANA timezone. Defaults to the browser timezone. */
  timezone?: string
  /** Skip timezone conversion and format in the runtime local zone. */
  disableTimezone?: boolean
  className?: string
  /** Separator between absolute and relative when `variant="both"`. */
  separator?: string
  /**
   * Epoch shown on the `detailed` tooltip Timestamp row.
   * Defaults to microseconds derived from the date.
   */
  timestamp?: string
  /** Replace the formatted trigger. Must be a single element (Tooltip `asChild`). */
  children?: ReactNode
}

export interface FormatterOptions {
  timezone: string
  disableTimezone: boolean
  format?: string
  addSuffix?: boolean
}
