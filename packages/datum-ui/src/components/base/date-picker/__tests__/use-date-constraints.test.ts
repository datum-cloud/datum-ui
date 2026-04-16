import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useDateConstraints } from '../use-date-constraints'

describe('useDateConstraints', () => {
  it('returns undefined bounds when no constraints provided', () => {
    const { result } = renderHook(() => useDateConstraints({}))
    expect(result.current.effectiveMinDate).toBeUndefined()
    expect(result.current.effectiveMaxDate).toBeUndefined()
  })

  it('passes through minDate and maxDate directly', () => {
    const min = new Date('2025-01-01')
    const max = new Date('2025-12-31')
    const { result } = renderHook(() => useDateConstraints({ minDate: min, maxDate: max }))
    expect(result.current.effectiveMinDate).toEqual(min)
    expect(result.current.effectiveMaxDate).toEqual(max)
  })

  it('clamps minDate to today start when disablePast is true', () => {
    const pastDate = new Date('2020-01-01')
    const { result } = renderHook(() =>
      useDateConstraints({ minDate: pastDate, disablePast: true }),
    )
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    expect(result.current.effectiveMinDate!.getTime()).toBeGreaterThanOrEqual(today.getTime())
  })

  it('clamps maxDate to today end when disableFuture is true', () => {
    const futureDate = new Date('2030-12-31')
    const { result } = renderHook(() =>
      useDateConstraints({ maxDate: futureDate, disableFuture: true }),
    )
    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)
    expect(result.current.effectiveMaxDate!.getTime()).toBeLessThanOrEqual(todayEnd.getTime() + 1000)
  })

  it('isDateDisabled returns true for dates outside bounds', () => {
    const min = new Date('2025-06-01')
    const max = new Date('2025-06-30')
    const { result } = renderHook(() => useDateConstraints({ minDate: min, maxDate: max }))
    expect(result.current.isDateDisabled(new Date('2025-05-15'))).toBe(true)
    expect(result.current.isDateDisabled(new Date('2025-06-15'))).toBe(false)
    expect(result.current.isDateDisabled(new Date('2025-07-15'))).toBe(true)
  })
})
