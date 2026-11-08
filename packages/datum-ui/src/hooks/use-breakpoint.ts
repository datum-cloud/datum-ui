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
 *
 * `initial` is the tier the server rendered with. Pass the viewport the server
 * already knows about (for example a viewport client hint) so the hydration
 * render matches; without one it defaults to 'desktop'. The client measures on
 * mount and tracks resizes after that, so the first render stays deterministic
 * on both sides.
 */
export function useBreakpoint(initial: BreakpointTier = 'desktop'): BreakpointTier {
  const [breakpoint, setBreakpoint] = useState<BreakpointTier>(initial)

  useEffect(() => {
    const update = () => {
      // eslint-disable-next-line react/set-state-in-effect -- intentional: replace the server's guess with the measured viewport after hydration
      setBreakpoint(getBreakpoint())
    }

    update()

    const mqTablet = window.matchMedia(`(min-width: ${TABLET_MIN}px)`)
    const mqDesktop = window.matchMedia(`(min-width: ${DESKTOP_MIN}px)`)

    mqTablet.addEventListener('change', update)
    mqDesktop.addEventListener('change', update)

    return () => {
      mqTablet.removeEventListener('change', update)
      mqDesktop.removeEventListener('change', update)
    }
  }, [])

  return breakpoint
}
