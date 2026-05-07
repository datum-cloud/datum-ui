import { describe, expect, it } from 'vitest'
import {
  formatInTimezone,
  formatTimezoneLabel,
  getBrowserTimezone,
  getTimezoneOffset,
  isoToZonedDate,
  zonedDateToIso,
} from '../../utils/timezone'

describe('getBrowserTimezone', () => {
  it('returns a non-empty IANA-like string', () => {
    const tz = getBrowserTimezone()
    expect(typeof tz).toBe('string')
    expect(tz.length).toBeGreaterThan(0)
  })
})

describe('getTimezoneOffset', () => {
  it('returns +00:00 for UTC', () => {
    expect(getTimezoneOffset('UTC')).toBe('+00:00')
  })

  it('returns +07:00 for Asia/Jakarta', () => {
    expect(getTimezoneOffset('Asia/Jakarta')).toBe('+07:00')
  })

  it('returns +00:00 for an invalid timezone', () => {
    expect(getTimezoneOffset('Not/A_Real_Zone')).toBe('+00:00')
  })
})

describe('formatTimezoneLabel', () => {
  it('formats with city and offset', () => {
    expect(formatTimezoneLabel('Asia/Jakarta')).toBe('Asia/Jakarta (UTC+07:00)')
    expect(formatTimezoneLabel('UTC')).toBe('UTC (UTC+00:00)')
  })

  it('replaces underscores with spaces', () => {
    expect(formatTimezoneLabel('America/New_York')).toMatch(/America\/New York/)
  })
})

describe('round-trip isoToZonedDate / zonedDateToIso', () => {
  it('preserves the instant for UTC', () => {
    const iso = '2026-01-15T14:30:00.000Z'
    const zoned = isoToZonedDate(iso, 'UTC')
    const back = zonedDateToIso(zoned, 'UTC')
    expect(back).toBe(iso)
  })

  it('preserves the instant for Asia/Jakarta (UTC+7)', () => {
    const iso = '2026-01-15T07:30:00.000Z'
    const zoned = isoToZonedDate(iso, 'Asia/Jakarta')
    const back = zonedDateToIso(zoned, 'Asia/Jakarta')
    expect(back).toBe(iso)
  })

  it('preserves the instant for America/New_York (across EST/EDT)', () => {
    const winterIso = '2026-01-15T14:30:00.000Z'
    const summerIso = '2026-07-15T14:30:00.000Z'
    expect(zonedDateToIso(isoToZonedDate(winterIso, 'America/New_York'), 'America/New_York')).toBe(winterIso)
    expect(zonedDateToIso(isoToZonedDate(summerIso, 'America/New_York'), 'America/New_York')).toBe(summerIso)
  })
})

describe('formatInTimezone', () => {
  it('formats UTC ISO in the target zone', () => {
    const iso = '2026-01-15T07:30:00.000Z'
    expect(formatInTimezone(iso, 'Asia/Jakarta', 'HH:mm')).toBe('14:30')
    expect(formatInTimezone(iso, 'UTC', 'HH:mm')).toBe('07:30')
  })

  it('returns empty string for invalid input', () => {
    expect(formatInTimezone('not-a-date', 'UTC', 'HH:mm')).toBe('')
  })
})
