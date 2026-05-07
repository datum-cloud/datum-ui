import { useEffect } from 'react'

// Minimal local declaration so the library type-checks without `@types/node`.
// Bundlers (tsdown/Vite/webpack) substitute `process.env.NODE_ENV` at build time.
declare const process: { env: { NODE_ENV?: string } }

const warned = new Set<string>()

/**
 * Logs a one-time `console.warn` in development warning that the legacy
 * component is deprecated and pointing the consumer at the replacement.
 *
 * No-op in `test` and `production` builds. Deduplicated by `legacyName`
 * across the entire session.
 */
export function useDeprecationWarning(legacyName: string, replacement: string): void {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development')
      return
    if (warned.has(legacyName))
      return
    warned.add(legacyName)

    console.warn(
      `[datum-ui] ${legacyName} is deprecated. Use ${replacement} from '@datum-cloud/datum-ui/picker' instead. See picker-migration.mdx.`,
    )
  }, [legacyName, replacement])
}
