import { describe, expect, it } from 'vitest'
import {
  dateToYYYYMMDD,
  formatTimeLabel,
  isValidTimeString,
  parseTimeString,
} from '../../utils/format'

describe('dateToYYYYMMDD', () => {
  it('formats a date to YYYY-MM-DD using local components', () => {
    expect(dateToYYYYMMDD(new Date(2026, 0, 15))).toBe('2026-01-15')
    expect(dateToYYYYMMDD(new Date(2026, 11, 5))).toBe('2026-12-05')
  })

  it('zero-pads single-digit month and day', () => {
    expect(dateToYYYYMMDD(new Date(2026, 2, 7))).toBe('2026-03-07')
  })
})

describe('isValidTimeString', () => {
  it('accepts well-formed HH:mm', () => {
    expect(isValidTimeString('00:00')).toBe(true)
    expect(isValidTimeString('14:30')).toBe(true)
    expect(isValidTimeString('23:59')).toBe(true)
  })

  it('rejects out-of-range values', () => {
    expect(isValidTimeString('24:00')).toBe(false)
    expect(isValidTimeString('14:60')).toBe(false)
    expect(isValidTimeString('-1:00')).toBe(false)
  })

  it('rejects malformed strings', () => {
    expect(isValidTimeString('1:00')).toBe(false) // single-digit hour
    expect(isValidTimeString('14:5')).toBe(false) // single-digit min
    expect(isValidTimeString('14.30')).toBe(false)
    expect(isValidTimeString('')).toBe(false)
    expect(isValidTimeString('abc')).toBe(false)
  })
})

describe('parseTimeString', () => {
  it('parses valid times into hours and minutes', () => {
    expect(parseTimeString('00:00')).toEqual({ h: 0, m: 0 })
    expect(parseTimeString('14:30')).toEqual({ h: 14, m: 30 })
    expect(parseTimeString('23:59')).toEqual({ h: 23, m: 59 })
  })

  it('returns null for invalid strings', () => {
    expect(parseTimeString('24:00')).toBeNull()
    expect(parseTimeString('abc')).toBeNull()
    expect(parseTimeString('')).toBeNull()
  })
})

describe('formatTimeLabel', () => {
  it('formats 24-hour cycle as input', () => {
    expect(formatTimeLabel('00:00', '24')).toBe('00:00')
    expect(formatTimeLabel('14:30', '24')).toBe('14:30')
    expect(formatTimeLabel('23:45', '24')).toBe('23:45')
  })

  it('formats 12-hour cycle with AM/PM', () => {
    expect(formatTimeLabel('00:00', '12')).toBe('12:00 AM')
    expect(formatTimeLabel('00:30', '12')).toBe('12:30 AM')
    expect(formatTimeLabel('11:59', '12')).toBe('11:59 AM')
    expect(formatTimeLabel('12:00', '12')).toBe('12:00 PM')
    expect(formatTimeLabel('14:30', '12')).toBe('2:30 PM')
    expect(formatTimeLabel('23:59', '12')).toBe('11:59 PM')
  })

  it('returns empty string for invalid input', () => {
    expect(formatTimeLabel('25:00', '24')).toBe('')
    expect(formatTimeLabel('abc', '12')).toBe('')
  })
})
