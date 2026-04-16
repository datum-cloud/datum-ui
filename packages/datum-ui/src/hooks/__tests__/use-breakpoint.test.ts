import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useBreakpoint } from '../use-breakpoint'

const originalInnerWidth = window.innerWidth
const originalMatchMedia = window.matchMedia

function setViewport(width: number) {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: width,
  })
  // Override the global setup.ts matchMedia stub so MQL evaluates against `width`
  window.matchMedia = vi.fn().mockImplementation((query: string) => {
    const match = query.match(/min-width:\s*(\d+)px/)
    const min = match ? Number(match[1]) : 0
    const matches = width >= min
    return {
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList
  })
}

describe('useBreakpoint', () => {
  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: originalInnerWidth,
    })
    window.matchMedia = originalMatchMedia
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
