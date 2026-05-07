import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useTimeSlots } from '../../hooks/use-time-slots'

describe('useTimeSlots', () => {
  it('generates slots from 00:00 to 23:45 with 15-minute step by default', () => {
    const { result } = renderHook(() => useTimeSlots({}))
    expect(result.current[0]).toEqual({ value: '00:00', label: '00:00' })
    expect(result.current.at(-1)).toEqual({ value: '23:45', label: '23:45' })
    expect(result.current.length).toBe(96) // 24 hours × 4 slots
  })

  it('respects min and max bounds', () => {
    const { result } = renderHook(() => useTimeSlots({ min: '09:00', max: '17:00', step: 60 }))
    expect(result.current[0]?.value).toBe('09:00')
    expect(result.current.at(-1)?.value).toBe('17:00')
    expect(result.current.length).toBe(9)
  })

  it('respects custom step', () => {
    const { result } = renderHook(() => useTimeSlots({ step: 30 }))
    expect(result.current.length).toBe(48)
    expect(result.current[1]?.value).toBe('00:30')
  })

  it('formats label with 12-hour cycle', () => {
    const { result } = renderHook(() => useTimeSlots({ step: 60, hourCycle: '12' }))
    expect(result.current[0]).toEqual({ value: '00:00', label: '12:00 AM' })
    expect(result.current[14]).toEqual({ value: '14:00', label: '2:00 PM' })
  })

  it('does not loop or generate beyond 23:59 even when max exceeds it', () => {
    const { result } = renderHook(() => useTimeSlots({ min: '23:00', max: '24:00', step: 15 }))
    const lastValue = result.current.at(-1)?.value
    expect(lastValue).toBeDefined()
    expect(lastValue! < '24:00').toBe(true)
  })
})
