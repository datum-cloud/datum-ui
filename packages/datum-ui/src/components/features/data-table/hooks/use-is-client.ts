'use client'

import { useEffect, useState } from 'react'

/**
 * Returns `false` during SSR and `true` after hydration.
 * Used to gate components that depend on client-only APIs
 * (e.g. TanStack Table's internal useSyncExternalStore call
 * which omits the getServerSnapshot argument).
 */
export function useIsClient(): boolean {
  const [isClient, setIsClient] = useState(false)
  // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect -- intentional: triggers re-render to detect client
  useEffect(() => setIsClient(true), [])
  return isClient
}
