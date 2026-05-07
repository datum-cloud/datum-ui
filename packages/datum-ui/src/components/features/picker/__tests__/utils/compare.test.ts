import { describe, expect, it } from 'vitest'
import {
  isSameDate,
  isSameDateRange,
  isSameStringRange,
} from '../../utils/compare'

describe('isSameDate', () => {
  it('handles null on both sides', () => {
    expect(isSameDate(null, null)).toBe(true)
    expect(isSameDate(null, new Date())).toBe(false)
    expect(isSameDate(new Date(), null)).toBe(false)
  })

  it('compares by milliseconds', () => {
    const a = new Date(2026, 0, 15, 14, 30, 0)
    const b = new Date(2026, 0, 15, 14, 30, 0)
    const c = new Date(2026, 0, 15, 14, 30, 1)
    expect(isSameDate(a, b)).toBe(true)
    expect(isSameDate(a, c)).toBe(false)
  })
})

describe('isSameDateRange', () => {
  it('handles null on both sides', () => {
    expect(isSameDateRange(null, null)).toBe(true)
    expect(isSameDateRange(null, { from: new Date(), to: new Date() })).toBe(false)
  })

  it('compares from and to and preset', () => {
    const a = { from: new Date(2026, 0, 1), to: new Date(2026, 0, 5), preset: 'last-7-days' }
    const b = { from: new Date(2026, 0, 1), to: new Date(2026, 0, 5), preset: 'last-7-days' }
    const c = { from: new Date(2026, 0, 1), to: new Date(2026, 0, 5), preset: undefined }
    const d = { from: new Date(2026, 0, 2), to: new Date(2026, 0, 5), preset: 'last-7-days' }
    expect(isSameDateRange(a, b)).toBe(true)
    expect(isSameDateRange(a, c)).toBe(false)
    expect(isSameDateRange(a, d)).toBe(false)
  })
})

describe('isSameStringRange', () => {
  it('handles null on both sides', () => {
    expect(isSameStringRange(null, null)).toBe(true)
    expect(isSameStringRange(null, { from: '09:00', to: '17:00' })).toBe(false)
  })

  it('compares from, to, and optional preset', () => {
    const a = { from: '09:00', to: '17:00' }
    const b = { from: '09:00', to: '17:00' }
    const c = { from: '09:00', to: '18:00' }
    const d = { from: '09:00', to: '17:00', preset: 'morning' }
    expect(isSameStringRange(a, b)).toBe(true)
    expect(isSameStringRange(a, c)).toBe(false)
    expect(isSameStringRange(a, d)).toBe(false)
  })
})
