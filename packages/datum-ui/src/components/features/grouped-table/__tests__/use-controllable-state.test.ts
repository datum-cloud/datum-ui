import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useControllableState } from '../lib/use-controllable-state'

describe('useControllableState', () => {
  it('uncontrolled: owns state and notifies', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() => useControllableState<number>(undefined, 0, onChange))
    act(() => result.current[1](5))
    expect(result.current[0]).toBe(5)
    expect(onChange).toHaveBeenCalledWith(5)
  })

  it('uncontrolled: supports updater functions', () => {
    const { result } = renderHook(() => useControllableState<number>(undefined, 1))
    act(() => result.current[1](prev => prev + 1))
    expect(result.current[0]).toBe(2)
  })

  it('controlled: reflects prop and does not self-update', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() => useControllableState<number>(10, 0, onChange))
    act(() => result.current[1](99))
    expect(onChange).toHaveBeenCalledWith(99)
    expect(result.current[0]).toBe(10) // unchanged until parent updates the prop
  })
})
