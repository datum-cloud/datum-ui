import type { Breakpoint } from '../constants/grid.constants'
import type { Gutter } from '../types/grid.types'
import { RESPONSIVE_ARRAY } from '../constants/grid.constants'

export interface MediaQueryCallback {
  match: () => void
  unmatch: () => void
}

export function registerMediaQuery(query: string, callback: MediaQueryCallback): () => void {
  const mediaQuery = window.matchMedia(query)

  const handleChange = (event: MediaQueryListEvent) => {
    if (event.matches) {
      callback.match()
    }
    else {
      callback.unmatch()
    }
  }

  // Initial check
  if (mediaQuery.matches) {
    callback.match()
  }
  else {
    callback.unmatch()
  }

  // Add listener
  mediaQuery.addEventListener('change', handleChange)

  // Return cleanup function
  return () => {
    mediaQuery.removeEventListener('change', handleChange)
  }
}

/**
 * Whether a gutter needs viewport tracking (i.e. it contains a responsive
 * breakpoint object). True for the object form (`{ md: 16 }`) AND for the array
 * form (`[{ md: 16 }, 8]`). Row uses this to decide whether to register media
 * queries; without it, array-form responsive gutters never track the viewport
 * and `getGutter` resolves them against the all-true initial `screens`, i.e. the
 * largest breakpoint (BUG-084).
 */
export function isResponsiveGutter(gutter: Gutter | [Gutter, Gutter]): boolean {
  const parts = Array.isArray(gutter) ? gutter : [gutter]
  return parts.some(part => typeof part === 'object' && part !== null)
}

export function getGutter(
  gutter: Gutter | [Gutter, Gutter] = 0,
  screens: Partial<Record<Breakpoint, boolean>>,
): [number, number] {
  const results: [number, number] = [0, 0]
  const normalizedGutter = Array.isArray(gutter) ? gutter.slice(0, 2) : [gutter, 0]

  normalizedGutter.forEach((g, index) => {
    if (typeof g === 'object') {
      for (let i = 0; i < RESPONSIVE_ARRAY.length; i++) {
        const breakpoint = RESPONSIVE_ARRAY[i]!
        if (screens[breakpoint] && g[breakpoint] !== undefined) {
          results[index] = g[breakpoint]!
          break
        }
      }
    }
    else {
      results[index] = g || 0
    }
  })

  return results
}

export function getResponsiveValue<T>(
  value: T | Partial<Record<Breakpoint, T>>,
  screens: Partial<Record<Breakpoint, boolean>>,
): T | undefined {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const responsiveValue = value as Partial<Record<Breakpoint, T>>
    for (let i = 0; i < RESPONSIVE_ARRAY.length; i++) {
      const breakpoint = RESPONSIVE_ARRAY[i]!
      if (screens[breakpoint] && responsiveValue[breakpoint] !== undefined) {
        return responsiveValue[breakpoint]
      }
    }
    return undefined
  }
  return value as T
}
