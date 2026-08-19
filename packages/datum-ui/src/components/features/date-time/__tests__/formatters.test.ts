import { describe, expect, it } from 'vitest'
import {
  DEFAULT_DATE_FORMAT,
  formatAbsoluteDate,
  formatTimezoneDate,
  formatUTCDate,
  getTimestamp,
  parseDate,
} from '../formatters'

describe('date-time formatters', () => {
  const date = new Date('2026-08-13T11:35:28.300Z')

  it('parses ISO strings and Date objects', () => {
    expect(parseDate(date)).toEqual(date)
    expect(parseDate('2026-08-13T11:35:28.300Z')).toEqual(date)
    expect(parseDate('not-a-date')).toBeNull()
  })

  it('formats UTC and timezone rows used in the tooltip', () => {
    expect(formatUTCDate(date)).toBe('13 Aug 26 11:35:28')
    expect(formatTimezoneDate(date, 'UTC')).toBe('13 Aug 26 11:35:28')
    expect(formatTimezoneDate(date, 'America/New_York')).toBe('13 Aug 26 07:35:28')
  })

  it('formats absolute dates in a timezone', () => {
    expect(formatAbsoluteDate(date, {
      timezone: 'UTC',
      disableTimezone: false,
      format: DEFAULT_DATE_FORMAT,
    })).toBe('August 13th at 11:35 AM')
  })

  it('returns microseconds for the timestamp row', () => {
    expect(getTimestamp(date)).toBe('1786620928300000')
  })
})
