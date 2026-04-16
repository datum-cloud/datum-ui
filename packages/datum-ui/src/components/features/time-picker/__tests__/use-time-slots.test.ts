import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useTimeSlots } from '../use-time-slots'

describe('useTimeSlots', () => {
  it('generates 15-minute slots for a full day by default', () => {
    const { result } = renderHook(() => useTimeSlots({}))
    expect(result.current).toHaveLength(96)
    expect(result.current[0]).toEqual({ value: '00:00', label: '12:00 AM' })
    expect(result.current[95]).toEqual({ value: '23:45', label: '11:45 PM' })
  })

  it('generates 30-minute slots when step=30', () => {
    const { result } = renderHook(() => useTimeSlots({ step: 30 }))
    expect(result.current).toHaveLength(48)
    expect(result.current[0]).toEqual({ value: '00:00', label: '12:00 AM' })
    expect(result.current[1]).toEqual({ value: '00:30', label: '12:30 AM' })
  })

  it('generates 1-hour slots when step=60', () => {
    const { result } = renderHook(() => useTimeSlots({ step: 60 }))
    expect(result.current).toHaveLength(24)
    expect(result.current[12]).toEqual({ value: '12:00', label: '12:00 PM' })
  })

  it('filters by min time', () => {
    const { result } = renderHook(() => useTimeSlots({ min: '09:00', step: 60 }))
    expect(result.current[0]).toEqual({ value: '09:00', label: '9:00 AM' })
    expect(result.current).toHaveLength(15)
  })

  it('filters by max time', () => {
    const { result } = renderHook(() => useTimeSlots({ max: '17:00', step: 60 }))
    expect(result.current[result.current.length - 1]).toEqual({ value: '17:00', label: '5:00 PM' })
    expect(result.current).toHaveLength(18)
  })

  it('filters by both min and max', () => {
    const { result } = renderHook(() => useTimeSlots({ min: '09:00', max: '17:00', step: 60 }))
    expect(result.current).toHaveLength(9)
    expect(result.current[0]).toEqual({ value: '09:00', label: '9:00 AM' })
    expect(result.current[8]).toEqual({ value: '17:00', label: '5:00 PM' })
  })
})
