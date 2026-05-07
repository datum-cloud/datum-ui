import { formatInTimeZone } from 'date-fns-tz'
import { describe, expect, it } from 'vitest'
import {
  DATE_PRESETS,
  DATETIME_PRESETS,
  getDefaultPresets,
} from '../../presets/defaults'

// Compare calendar days in a specific timezone (system-TZ-independent).
function daysInTzBetween(from: Date, to: Date, tz: string): number {
  const fromDay = new Date(`${formatInTimeZone(from, tz, 'yyyy-MM-dd')}T00:00:00Z`)
  const toDay = new Date(`${formatInTimeZone(to, tz, 'yyyy-MM-dd')}T00:00:00Z`)
  return Math.round((toDay.getTime() - fromDay.getTime()) / (24 * 60 * 60 * 1000))
}

describe('dATE_PRESETS', () => {
  it('exports presets with required fields', () => {
    expect(DATE_PRESETS.length).toBeGreaterThan(0)
    for (const p of DATE_PRESETS) {
      expect(typeof p.key).toBe('string')
      expect(typeof p.label).toBe('string')
      expect(typeof p.getRange).toBe('function')
    }
  })

  it('"today" returns a same-day range in the given timezone', () => {
    const today = DATE_PRESETS.find(p => p.key === 'today')!
    const { from, to } = today.getRange('UTC')
    expect(daysInTzBetween(from, to, 'UTC')).toBe(0)
  })

  it('"last-7-days" spans 7 calendar days', () => {
    const last7 = DATE_PRESETS.find(p => p.key === 'last-7-days')!
    const { from, to } = last7.getRange('UTC')
    expect(daysInTzBetween(from, to, 'UTC')).toBeGreaterThanOrEqual(6)
    expect(daysInTzBetween(from, to, 'UTC')).toBeLessThanOrEqual(7)
  })
})

describe('dATETIME_PRESETS', () => {
  it('"last-15m" returns a 15-minute window ending now', () => {
    const last15 = DATETIME_PRESETS.find(p => p.key === 'last-15m')!
    const { from, to } = last15.getRange('UTC')
    const diffMinutes = (to.getTime() - from.getTime()) / 60000
    expect(diffMinutes).toBeCloseTo(15, 0)
  })

  it('"last-24h" returns a 24-hour window ending now', () => {
    const last24 = DATETIME_PRESETS.find(p => p.key === 'last-24h')!
    const { from, to } = last24.getRange('UTC')
    const diffHours = (to.getTime() - from.getTime()) / (60 * 60 * 1000)
    expect(diffHours).toBeCloseTo(24, 0)
  })
})

describe('getDefaultPresets', () => {
  it('returns DATE_PRESETS for date-bearing modes', () => {
    expect(getDefaultPresets('date')).toBe(DATE_PRESETS)
    expect(getDefaultPresets('date-range')).toBe(DATE_PRESETS)
  })

  it('returns DATETIME_PRESETS for datetime-bearing modes', () => {
    expect(getDefaultPresets('datetime')).toBe(DATETIME_PRESETS)
    expect(getDefaultPresets('datetime-range')).toBe(DATETIME_PRESETS)
    expect(getDefaultPresets('date-range-time')).toBe(DATETIME_PRESETS)
  })

  it('returns empty array for time-only modes', () => {
    expect(getDefaultPresets('time')).toEqual([])
    expect(getDefaultPresets('time-range')).toEqual([])
  })
})
