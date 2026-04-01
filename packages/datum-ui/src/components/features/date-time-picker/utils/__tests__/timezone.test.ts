import { describe, expect, it } from 'vitest'
import {
  getBrowserTimezone,
  localDateTimeToUtc,
  utcToLocalDateTime,
} from '../timezone'

describe('timezone utilities', () => {
  it('converts local date+time to UTC ISO string', () => {
    const date = new Date(2024, 0, 15) // Jan 15, 2024
    const time = '14:30'
    const timezone = 'America/New_York' // UTC-5

    const result = localDateTimeToUtc(date, time, timezone)

    // 14:30 EST = 19:30 UTC
    expect(result).toBe('2024-01-15T19:30:00.000Z')
  })

  it('converts UTC ISO string to local date+time', () => {
    const utcString = '2024-01-15T19:30:00.000Z'
    const timezone = 'America/New_York' // UTC-5

    const result = utcToLocalDateTime(utcString, timezone)

    expect(result.date.getFullYear()).toBe(2024)
    expect(result.date.getMonth()).toBe(0) // January
    expect(result.date.getDate()).toBe(15)
    expect(result.time).toBe('14:30')
  })

  it('gets browser timezone', () => {
    const tz = getBrowserTimezone()

    expect(typeof tz).toBe('string')
    expect(tz.length).toBeGreaterThan(0)
  })

  it('handles midnight correctly', () => {
    const date = new Date(2024, 0, 15)
    const time = '00:00'
    const timezone = 'UTC'

    const result = localDateTimeToUtc(date, time, timezone)

    expect(result).toBe('2024-01-15T00:00:00.000Z')
  })
})
