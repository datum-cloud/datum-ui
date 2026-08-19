import { describe, expect, it } from 'vitest'
import {
  formatLocalTimestamp,
  formatLogTimestamp,
  formatRelativeTimestamp,
  formatUtcTimestamp,
} from '../utils/format-timestamp'
import { filtersAreActive, lastThirtyMinutes } from '../utils/time-range'

describe('format timestamps', () => {
  const date = new Date('2026-08-13T11:35:28.300Z')

  it('formats table, utc, local, and relative timestamps', () => {
    expect(formatLogTimestamp(date)).toMatch(/AUG 13 \d{2}:\d{2}:\d{2}\.\d{2}/)
    expect(formatUtcTimestamp(date)).toContain('2026-08-13 11:35:28.300')
    expect(formatUtcTimestamp(date)).toContain('UTC')
    expect(formatLocalTimestamp(date)).toMatch(/GMT[+-]\d{2}:\d{2}/)
    expect(formatRelativeTimestamp(date, new Date('2026-08-13T11:40:28.300Z'))).toContain('ago')
  })
})

describe('time range helpers', () => {
  it('returns a 30 minute window', () => {
    const now = new Date('2026-08-13T12:00:00.000Z')
    expect(lastThirtyMinutes(now)).toEqual({
      from: '2026-08-13T11:30:00.000Z',
      to: '2026-08-13T12:00:00.000Z',
    })
  })

  it('detects active filters', () => {
    expect(filtersAreActive({})).toBe(false)
    expect(filtersAreActive({ severity: [] })).toBe(false)
    expect(filtersAreActive({ severity: ['ERROR'] })).toBe(true)
  })
})
