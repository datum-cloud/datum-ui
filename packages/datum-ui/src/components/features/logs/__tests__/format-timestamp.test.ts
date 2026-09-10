import { describe, expect, it } from 'vitest'
import {
  formatLocalTimestamp,
  formatLogTimestamp,
  formatLogTimestampParts,
  formatRelativeTimestamp,
  formatUtcTimestamp,
} from '../utils/format-timestamp'
import {
  filtersAreActive,
  lastThirtyMinutes,
  LOG_TIME_PRESETS,
  logTimeRangeLabel,
  resolveLogTimeRange,
} from '../utils/time-range'

describe('format timestamps', () => {
  const date = new Date('2026-08-13T11:35:28.300Z')

  it('formats table, utc, local, and relative timestamps', () => {
    expect(formatLogTimestamp(date)).toMatch(/AUG 13 \d{2}:\d{2}:\d{2}\.\d{2}/)
    expect(formatLogTimestampParts(date)).toEqual({
      date: 'AUG 13',
      time: expect.stringMatching(/^\d{2}:\d{2}:\d{2}\.\d{2}$/),
    })
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
      preset: 'last-30m',
    })
  })

  it('re-anchors preset ranges to now and leaves absolute ranges alone', () => {
    const now = new Date('2026-08-13T13:00:00.000Z')
    const stale = lastThirtyMinutes(new Date('2026-08-13T12:00:00.000Z'))
    expect(resolveLogTimeRange(stale, now)).toEqual({
      from: '2026-08-13T12:30:00.000Z',
      to: '2026-08-13T13:00:00.000Z',
      preset: 'last-30m',
    })

    const absolute = { from: '2026-08-13T10:00:00.000Z', to: '2026-08-13T11:00:00.000Z' }
    expect(resolveLogTimeRange(absolute, now)).toBe(absolute)

    const unknown = { ...absolute, preset: 'nope' }
    expect(resolveLogTimeRange(unknown, now)).toBe(unknown)
  })

  it('labels presets by name and absolute ranges compactly', () => {
    expect(logTimeRangeLabel(lastThirtyMinutes())).toBe('Last 30 minutes')
    expect(LOG_TIME_PRESETS.map(preset => preset.key)).toContain('last-7d')
    expect(logTimeRangeLabel({ from: '2026-08-13T10:00:00.000Z', to: '2026-08-13T11:00:00.000Z' }))
      .toMatch(/^Aug 13, \d{2}:\d{2} – \d{2}:\d{2}$/)
    expect(logTimeRangeLabel({ from: '2026-08-12T10:00:00.000Z', to: '2026-08-13T11:00:00.000Z' }))
      .toMatch(/^Aug 12, \d{2}:\d{2} – Aug 13, \d{2}:\d{2}$/)
    expect(logTimeRangeLabel({ from: 'nope', to: 'nope' })).toBe('Select range')
  })

  it('detects active filters', () => {
    expect(filtersAreActive({})).toBe(false)
    expect(filtersAreActive({ severity: [] })).toBe(false)
    expect(filtersAreActive({ severity: ['ERROR'] })).toBe(true)
  })
})
