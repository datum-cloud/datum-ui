import { describe, expect, it } from 'vitest'
import { toUTCTimestampEndOfDay, toUTCTimestampStartOfDay } from '../timezone'

describe('toUTCTimestampStartOfDay', () => {
  it('returns the UTC timestamp (seconds) at 00:00 local time in the given timezone', () => {
    // 2025-10-09 00:00 in America/Los_Angeles (UTC-7 DST) == 2025-10-09T07:00:00Z
    const date = new Date('2025-10-09T15:30:00Z')
    const timezone = 'America/Los_Angeles'

    const result = toUTCTimestampStartOfDay(date, timezone)

    expect(result).toBe(Math.floor(Date.UTC(2025, 9, 9, 7, 0, 0) / 1000))
  })

  it('returns an integer number of seconds (no fractional millis)', () => {
    const result = toUTCTimestampStartOfDay(new Date('2025-10-09T15:30:00Z'), 'UTC')

    expect(Number.isInteger(result)).toBe(true)
  })
})

describe('toUTCTimestampEndOfDay', () => {
  it('returns the UTC timestamp (seconds) at 23:59:59.999 local time in the given timezone', () => {
    // 2025-10-09 23:59:59.999 in America/Los_Angeles (UTC-7 DST) == 2025-10-10T06:59:59.999Z
    const date = new Date('2025-10-09T15:30:00Z')
    const timezone = 'America/Los_Angeles'

    const result = toUTCTimestampEndOfDay(date, timezone)

    // Math.floor(…/1000) truncates the 999ms, so expected seconds = epoch of 06:59:59 UTC
    expect(result).toBe(Math.floor(Date.UTC(2025, 9, 10, 6, 59, 59, 999) / 1000))
  })

  it('is always greater than the matching start-of-day value', () => {
    const date = new Date('2025-10-09T00:00:00Z')
    const tz = 'UTC'

    expect(toUTCTimestampEndOfDay(date, tz)).toBeGreaterThan(
      toUTCTimestampStartOfDay(date, tz),
    )
  })
})
