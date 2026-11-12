import type { RefObject } from 'react'
import { useLayoutEffect, useRef } from 'react'

/**
 * Keeps a ref pointing at the latest value of a prop or callback.
 *
 * Read `ref.current` from effects, timers and event handlers that must call
 * the current callback without listing it as a dependency. The ref is updated
 * in a layout effect, so it is current before any passive effect or timer runs.
 * Do not read it during render.
 */
export function useLatestRef<T>(value: T): RefObject<T> {
  const ref = useRef(value)
  useLayoutEffect(() => {
    ref.current = value
  })
  return ref
}
