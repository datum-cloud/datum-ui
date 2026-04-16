import { useEffect, useState } from 'react'

export type BreakpointTier = 'mobile' | 'tablet' | 'desktop'

const TABLET_MIN = 768
const DESKTOP_MIN = 1024

function getBreakpoint(): BreakpointTier {
  if (typeof window === 'undefined') {
    return 'desktop'
  }
  const width = window.innerWidth
  if (width < TABLET_MIN) {
    return 'mobile'
  }
  if (width < DESKTOP_MIN) {
    return 'tablet'
  }
  return 'desktop'
}

/**
 * Returns the current viewport breakpoint tier.
 *
 * Breakpoints: mobile <768px, tablet 768–1023px, desktop ≥1024px.
 * SSR-safe: defaults to 'desktop' on server; client corrects on mount.
 */
export function useBreakpoint(): BreakpointTier {
  const [breakpoint, setBreakpoint] = useState<BreakpointTier>(getBreakpoint)

  useEffect(() => {
    const mqTablet = window.matchMedia(`(min-width: ${TABLET_MIN}px)`)
    const mqDesktop = window.matchMedia(`(min-width: ${DESKTOP_MIN}px)`)

    const update = () => {
      setBreakpoint(getBreakpoint())
    }

    mqTablet.addEventListener('change', update)
    mqDesktop.addEventListener('change', update)

    return () => {
      mqTablet.removeEventListener('change', update)
      mqDesktop.removeEventListener('change', update)
    }
  }, [])

  return breakpoint
}
