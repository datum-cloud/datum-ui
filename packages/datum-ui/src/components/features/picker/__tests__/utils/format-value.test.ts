import { describe, expect, it } from 'vitest'
import { formatPickerValue } from '../../utils/format-value'

describe('formatPickerValue', () => {
  it('returns empty string for null', () => {
    expect(formatPickerValue(null, 'date')).toBe('')
  })

  it('formats a single date in date mode', () => {
    expect(formatPickerValue(new Date(2026, 0, 15), 'date')).toMatch(/Jan/)
    expect(formatPickerValue(new Date(2026, 0, 15), 'date')).toMatch(/15/)
    expect(formatPickerValue(new Date(2026, 0, 15), 'date')).toMatch(/2026/)
  })

  it('formats a date range in date-range mode', () => {
    const range = { from: new Date(2026, 0, 15), to: new Date(2026, 0, 20) }
    const out = formatPickerValue(range, 'date-range')
    expect(out).toMatch(/Jan 15/)
    expect(out).toMatch(/Jan 20/)
    expect(out).toMatch(/2026/)
  })

  it('formats time string in time mode using 24-hour cycle by default', () => {
    expect(formatPickerValue('14:30', 'time')).toBe('14:30')
  })

  it('formats time string in time mode using 12-hour cycle when requested', () => {
    expect(formatPickerValue('14:30', 'time', { hourCycle: '12' })).toMatch(/2:30 PM/i)
  })

  it('formats a time range in time-range mode', () => {
    const range = { from: '09:00', to: '17:00' }
    const out = formatPickerValue(range, 'time-range')
    expect(out).toContain('09:00')
    expect(out).toContain('17:00')
  })

  it('formats datetime in datetime mode in the declared timezone', () => {
    const out = formatPickerValue('2026-01-15T07:00:00.000Z', 'datetime', {
      timezone: 'UTC',
      hourCycle: '24',
    })
    expect(out).toMatch(/Jan/)
    expect(out).toMatch(/15/)
    expect(out).toMatch(/07:00/)
  })

  it('formats datetime range in datetime-range mode', () => {
    const range = { from: '2026-01-15T07:00:00.000Z', to: '2026-01-15T17:00:00.000Z' }
    const out = formatPickerValue(range, 'datetime-range', { timezone: 'UTC', hourCycle: '24' })
    expect(out).toContain('07:00')
    expect(out).toContain('17:00')
  })

  it('formats datetime range across two days in datetime-range mode', () => {
    const range = { from: '2026-01-15T07:00:00.000Z', to: '2026-01-16T17:00:00.000Z' }
    const out = formatPickerValue(range, 'datetime-range', { timezone: 'UTC', hourCycle: '24' })
    expect(out).toMatch(/Jan 15/)
    expect(out).toMatch(/Jan 16/)
    expect(out).toContain('07:00')
    expect(out).toContain('17:00')
  })

  it('formats date-range-time as range plus single time-of-day', () => {
    const range = { from: '2026-01-15T09:00:00.000Z', to: '2026-01-20T17:00:00.000Z' }
    const out = formatPickerValue(range, 'date-range-time', { timezone: 'UTC', hourCycle: '24' })
    expect(out).toMatch(/Jan 15/)
    expect(out).toMatch(/Jan 20/)
    expect(out).toContain('09:00')
  })

  it('returns empty string for invalid input', () => {
    expect(formatPickerValue('not-a-date', 'datetime', { timezone: 'UTC' })).toBe('')
  })

  describe('custom dateFormat / timeFormat', () => {
    it('dateFormat overrides the locale default in date mode', () => {
      const out = formatPickerValue(new Date(2026, 0, 15), 'date', {
        dateFormat: 'yyyy-MM-dd',
      })
      expect(out).toBe('2026-01-15')
    })

    it('dateFormat applies to both ends in date-range mode', () => {
      const range = { from: new Date(2026, 0, 1), to: new Date(2026, 0, 7) }
      const out = formatPickerValue(range, 'date-range', { dateFormat: 'dd/MM/yyyy' })
      expect(out).toBe('01/01/2026 - 07/01/2026')
    })

    it('timeFormat overrides hourCycle in time mode', () => {
      // hourCycle says 24, timeFormat asks for 12-hour clock — timeFormat wins.
      const out = formatPickerValue('14:30', 'time', {
        hourCycle: '24',
        timeFormat: 'hh:mm a',
      })
      expect(out).toMatch(/02:30 PM/i)
    })

    it('timeFormat applies to both ends in time-range mode', () => {
      const range = { from: '09:00', to: '17:00' }
      const out = formatPickerValue(range, 'time-range', { timeFormat: 'HH:mm:ss' })
      expect(out).toBe('09:00:00 - 17:00:00')
    })

    it('combined dateFormat + timeFormat in datetime mode', () => {
      const out = formatPickerValue('2026-01-15T07:00:00.000Z', 'datetime', {
        timezone: 'UTC',
        dateFormat: 'yyyy-MM-dd',
        timeFormat: 'HH:mm',
      })
      expect(out).toBe('2026-01-15 07:00')
    })

    it('combined formats in datetime-range mode (same day)', () => {
      const range = { from: '2026-01-15T07:00:00.000Z', to: '2026-01-15T17:00:00.000Z' }
      const out = formatPickerValue(range, 'datetime-range', {
        timezone: 'UTC',
        dateFormat: 'yyyy-MM-dd',
        timeFormat: 'HH:mm',
      })
      expect(out).toBe('2026-01-15 07:00 - 17:00')
    })

    it('combined formats in date-range-time mode', () => {
      const range = { from: '2026-01-15T09:00:00.000Z', to: '2026-01-20T17:00:00.000Z' }
      const out = formatPickerValue(range, 'date-range-time', {
        timezone: 'UTC',
        dateFormat: 'yyyy-MM-dd',
        timeFormat: 'HH:mm',
      })
      expect(out).toBe('2026-01-15 - 2026-01-20 (09:00)')
    })
  })
})
