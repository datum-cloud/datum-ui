import type { PickerPreset } from '../../picker/types'
import type { LogTimeRange } from '../types'
import { format, isSameDay } from 'date-fns'

const MINUTE_MS = 60 * 1000
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS

function relativePreset(key: string, label: string, durationMs: number, shortcut?: string): PickerPreset {
  return {
    key,
    label,
    shortcut,
    getRange: () => {
      const now = new Date()
      return { from: new Date(now.getTime() - durationMs), to: now }
    },
  }
}

/**
 * Relative "Last N" windows offered by `Logs.Filters`. Keys are persisted on
 * `LogTimeRange.preset` so hosts can slide the window forward with
 * `resolveLogTimeRange` on refresh or while live tailing.
 *
 * Shortcuts follow the `picker` datetime presets (`1` / `2` / `H` / `W`) that
 * the logs picker is built on. Keys that mean something else in the pickers
 * (`3` is "Last 30 minutes" in `time-range-picker`, `D` is "Today") are not
 * reused, so muscle memory carries over between the two.
 */
export const LOG_TIME_PRESETS: readonly PickerPreset[] = [
  relativePreset('last-15m', 'Last 15 minutes', 15 * MINUTE_MS, '1'),
  relativePreset('last-30m', 'Last 30 minutes', 30 * MINUTE_MS, '2'),
  relativePreset('last-1h', 'Last hour', HOUR_MS, 'H'),
  relativePreset('last-3h', 'Last 3 hours', 3 * HOUR_MS),
  relativePreset('last-6h', 'Last 6 hours', 6 * HOUR_MS, '6'),
  relativePreset('last-12h', 'Last 12 hours', 12 * HOUR_MS),
  relativePreset('last-24h', 'Last 24 hours', DAY_MS),
  relativePreset('last-7d', 'Last 7 days', 7 * DAY_MS, 'W'),
]

export function lastThirtyMinutes(now = new Date()): LogTimeRange {
  return {
    from: new Date(now.getTime() - 30 * MINUTE_MS).toISOString(),
    to: now.toISOString(),
    preset: 'last-30m',
  }
}

/**
 * Re-anchor a preset range to `now`. Absolute ranges (no `preset`, or an
 * unknown key) are returned unchanged.
 */
export function resolveLogTimeRange(range: LogTimeRange, now = new Date()): LogTimeRange {
  if (!range.preset)
    return range
  const preset = LOG_TIME_PRESETS.find(item => item.key === range.preset)
  if (!preset)
    return range
  const { from, to } = preset.getRange('UTC')
  const shift = now.getTime() - to.getTime()
  return {
    from: new Date(from.getTime() + shift).toISOString(),
    to: now.toISOString(),
    preset: range.preset,
  }
}

/** Human label for the time-range trigger: preset name, or a compact absolute range. */
export function logTimeRangeLabel(range: LogTimeRange): string {
  const preset = range.preset
    ? LOG_TIME_PRESETS.find(item => item.key === range.preset)
    : undefined
  if (preset)
    return preset.label

  const from = new Date(range.from)
  const to = new Date(range.to)
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()))
    return 'Select range'
  if (isSameDay(from, to))
    return `${format(from, 'MMM d, HH:mm')} – ${format(to, 'HH:mm')}`
  return `${format(from, 'MMM d, HH:mm')} – ${format(to, 'MMM d, HH:mm')}`
}

export function filtersAreActive(filters: Record<string, string[]>): boolean {
  return Object.values(filters).some(values => values.length > 0)
}
