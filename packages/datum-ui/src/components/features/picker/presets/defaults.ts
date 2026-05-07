import type { PickerMode, PickerPreset } from '../types'
import {
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subHours,
  subMinutes,
} from 'date-fns'
import { fromZonedTime, toZonedTime } from 'date-fns-tz'

function startOfDayInTz(d: Date, tz: string): Date {
  const zoned = toZonedTime(d, tz)
  zoned.setHours(0, 0, 0, 0)
  return fromZonedTime(zoned, tz)
}

function endOfDayInTz(d: Date, tz: string): Date {
  const zoned = toZonedTime(d, tz)
  zoned.setHours(23, 59, 59, 999)
  return fromZonedTime(zoned, tz)
}

/**
 * Date-bearing presets. Operate on calendar days; ignore time-of-day.
 */
export const DATE_PRESETS: readonly PickerPreset[] = [
  {
    key: 'today',
    label: 'Today',
    shortcut: 'D',
    getRange: tz => ({
      from: startOfDayInTz(new Date(), tz),
      to: endOfDayInTz(new Date(), tz),
    }),
  },
  {
    key: 'yesterday',
    label: 'Yesterday',
    shortcut: 'Y',
    getRange: (tz) => {
      const y = subDays(new Date(), 1)
      return { from: startOfDayInTz(y, tz), to: endOfDayInTz(y, tz) }
    },
  },
  {
    key: 'this-week',
    label: 'This Week',
    getRange: () => {
      const now = new Date()
      return {
        from: startOfWeek(now, { weekStartsOn: 1 }),
        to: endOfWeek(now, { weekStartsOn: 1 }),
      }
    },
  },
  {
    key: 'last-7-days',
    label: 'Last 7 Days',
    shortcut: 'W',
    getRange: tz => ({
      from: startOfDayInTz(subDays(new Date(), 6), tz),
      to: endOfDayInTz(new Date(), tz),
    }),
  },
  {
    key: 'this-month',
    label: 'This Month',
    getRange: () => {
      const now = new Date()
      return { from: startOfMonth(now), to: endOfMonth(now) }
    },
  },
  {
    key: 'last-30-days',
    label: 'Last 30 Days',
    shortcut: 'M',
    getRange: tz => ({
      from: startOfDayInTz(subDays(new Date(), 29), tz),
      to: endOfDayInTz(new Date(), tz),
    }),
  },
  {
    key: 'this-year',
    label: 'This Year',
    getRange: () => {
      const now = new Date()
      return { from: startOfYear(now), to: endOfYear(now) }
    },
  },
] as const

/**
 * Datetime-bearing presets. Use "now" as the upper bound for past windows
 * (so the picker doesn't propose future timestamps).
 */
export const DATETIME_PRESETS: readonly PickerPreset[] = [
  {
    key: 'last-15m',
    label: 'Last 15 minutes',
    shortcut: '1',
    getRange: () => {
      const now = new Date()
      return { from: subMinutes(now, 15), to: now }
    },
  },
  {
    key: 'last-1h',
    label: 'Last hour',
    shortcut: 'H',
    getRange: () => {
      const now = new Date()
      return { from: subHours(now, 1), to: now }
    },
  },
  {
    key: 'last-24h',
    label: 'Last 24 hours',
    getRange: () => {
      const now = new Date()
      return { from: subHours(now, 24), to: now }
    },
  },
  {
    key: 'today',
    label: 'Today',
    shortcut: 'D',
    getRange: tz => ({
      from: startOfDayInTz(new Date(), tz),
      to: new Date(),
    }),
  },
  {
    key: 'last-7-days',
    label: 'Last 7 days',
    shortcut: 'W',
    getRange: () => {
      const now = new Date()
      return { from: subDays(now, 7), to: now }
    },
  },
  {
    key: 'last-30-days',
    label: 'Last 30 days',
    shortcut: 'M',
    getRange: () => {
      const now = new Date()
      return { from: subDays(now, 30), to: now }
    },
  },
] as const

const EMPTY: readonly PickerPreset[] = []

/**
 * Default preset set for a given mode. Time-only modes return empty —
 * presets rarely make sense for picking a wall-clock time.
 */
export function getDefaultPresets(mode: PickerMode): readonly PickerPreset[] {
  switch (mode) {
    case 'date':
    case 'date-range':
      return DATE_PRESETS
    case 'datetime':
    case 'datetime-range':
    case 'date-range-time':
      return DATETIME_PRESETS
    case 'time':
    case 'time-range':
    default:
      return EMPTY
  }
}
