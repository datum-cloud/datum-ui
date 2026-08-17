import { resetViewport, setViewport } from '@test/viewport'
import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { useBreakpoint } from '../use-breakpoint'

describe('useBreakpoint', () => {
  afterEach(() => {
    resetViewport()
  })

  it('returns "mobile" below 768px', () => {
    setViewport(500)
    const { result } = renderHook(() => useBreakpoint())
    expect(result.current).toBe('mobile')
  })

  it('returns "tablet" between 768px and 1023px', () => {
    setViewport(900)
    const { result } = renderHook(() => useBreakpoint())
    expect(result.current).toBe('tablet')
  })

  it('returns "desktop" at 1024px and above', () => {
    setViewport(1440)
    const { result } = renderHook(() => useBreakpoint())
    expect(result.current).toBe('desktop')
  })
})
