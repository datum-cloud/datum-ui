import type { Breakpoint } from '../../constants/grid.constants'
import { describe, expect, it } from 'vitest'
import { getGutter, isResponsiveGutter } from '../responsive'

// A "tablet" screen state: md matches (and everything up to md), but the larger
// breakpoints (lg/xl/xxl) do not. This is the state Row derives from matchMedia.
const tabletScreens: Partial<Record<Breakpoint, boolean>> = {
  xs: false,
  sm: true,
  md: true,
  lg: false,
  xl: false,
  xxl: false,
}

describe('isResponsiveGutter', () => {
  it('is false for a plain number gutter', () => {
    expect(isResponsiveGutter(16)).toBe(false)
  })

  it('is false for an array of plain numbers', () => {
    expect(isResponsiveGutter([16, 8])).toBe(false)
  })

  it('is true for an object-form responsive gutter', () => {
    expect(isResponsiveGutter({ md: 16 })).toBe(true)
  })

  it('is true for an array-form gutter containing a responsive object', () => {
    expect(isResponsiveGutter([{ md: 16 }, 8])).toBe(true)
    expect(isResponsiveGutter([8, { md: 16 }])).toBe(true)
  })
})

describe('getGutter', () => {
  it('resolves an object-form responsive gutter against the active breakpoint', () => {
    // Not the largest (xxl: 40) — the active md value.
    expect(getGutter({ md: 16, xxl: 40 }, tabletScreens)).toEqual([16, 0])
  })

  it('resolves an ARRAY-form responsive gutter against the active breakpoint (BUG-084)', () => {
    // Horizontal is responsive, vertical is a fixed number. The horizontal
    // gutter must resolve to md (16), NOT the largest breakpoint xxl (40).
    expect(getGutter([{ md: 16, xxl: 40 }, 8], tabletScreens)).toEqual([16, 8])
  })

  it('resolves both axes of an array-form responsive gutter independently', () => {
    expect(
      getGutter([{ md: 16, xxl: 40 }, { md: 4, xxl: 20 }], tabletScreens),
    ).toEqual([16, 4])
  })

  it('falls back to a larger defined breakpoint when the active one is unset', () => {
    // Only xxl defined; with the RESPONSIVE_ARRAY (largest-first) scan and all
    // screens true, the largest match wins — matching Ant Design semantics.
    const allTrue: Partial<Record<Breakpoint, boolean>> = {
      xs: true,
      sm: true,
      md: true,
      lg: true,
      xl: true,
      xxl: true,
    }
    expect(getGutter([{ xxl: 40 }, 0], allTrue)).toEqual([40, 0])
  })
})
