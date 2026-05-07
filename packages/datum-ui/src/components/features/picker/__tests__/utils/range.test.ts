import { describe, expect, it } from 'vitest'
import { clampRange, getDaysDifference, isRangeValid } from '../../utils/range'

describe('getDaysDifference', () => {
  it('returns 0 for identical timestamps', () => {
    const t = new Date(2026, 0, 15, 12, 0, 0)
    expect(getDaysDifference(t, t)).toBe(0)
  })

  it('returns 0 for the same calendar day with different times', () => {
    const a = new Date(2026, 0, 15, 0, 0, 0)
    const b = new Date(2026, 0, 15, 23, 59, 59)
    expect(getDaysDifference(a, b)).toBe(0)
  })

  it('returns 1 for consecutive calendar days', () => {
    const a = new Date(2026, 0, 15, 23, 59, 59)
    const b = new Date(2026, 0, 16, 0, 0, 0)
    expect(getDaysDifference(a, b)).toBe(1)
  })

  it('handles a 7-day span', () => {
    const a = new Date(2026, 0, 1)
    const b = new Date(2026, 0, 8)
    expect(getDaysDifference(a, b)).toBe(7)
  })

  it('is direction-agnostic (always positive)', () => {
    const a = new Date(2026, 0, 1)
    const b = new Date(2026, 0, 8)
    expect(getDaysDifference(b, a)).toBe(7)
  })
})

describe('isRangeValid', () => {
  it('returns true when no maxRange is given', () => {
    const a = new Date(2026, 0, 1)
    const b = new Date(2026, 11, 31)
    expect(isRangeValid(a, b)).toBe(true)
  })

  it('returns true when within maxRange', () => {
    const a = new Date(2026, 0, 1)
    const b = new Date(2026, 0, 5)
    expect(isRangeValid(a, b, 7)).toBe(true)
  })

  it('returns true at the maxRange boundary', () => {
    const a = new Date(2026, 0, 1)
    const b = new Date(2026, 0, 8)
    expect(isRangeValid(a, b, 7)).toBe(true)
  })

  it('returns false when exceeding maxRange', () => {
    const a = new Date(2026, 0, 1)
    const b = new Date(2026, 0, 10)
    expect(isRangeValid(a, b, 7)).toBe(false)
  })
})

describe('clampRange', () => {
  it('returns the original range when already within maxRange', () => {
    const from = new Date(2026, 0, 1)
    const to = new Date(2026, 0, 5)
    const result = clampRange(from, to, 7)
    expect(result.from.getTime()).toBe(from.getTime())
    expect(result.to.getTime()).toBe(to.getTime())
  })

  it('clamps `to` forward to maxRange days from `from`', () => {
    const from = new Date(2026, 0, 1)
    const to = new Date(2026, 0, 20)
    const result = clampRange(from, to, 7)
    expect(result.from.getTime()).toBe(from.getTime())
    expect(getDaysDifference(result.from, result.to)).toBe(7)
  })
})
