'use client'

import type { ComponentProps } from 'react'
import { MapTileLayer as BaseMapTileLayer } from '@repo/shadcn/ui/map'
import { useTheme } from '../../themes'

/**
 * Map tile layer that follows the datum `ThemeProvider`.
 *
 * The light or dark tiles come from the provider's resolved theme, the same
 * value `CodeEditor` and `ThemedLogo` read. An explicit `theme` prop wins, and
 * without a provider the layer falls back to detecting the theme from `<html>`.
 */
export function MapTileLayer({ theme, ...props }: ComponentProps<typeof BaseMapTileLayer>) {
  const { resolvedTheme } = useTheme()
  const providerTheme = resolvedTheme === 'dark' || resolvedTheme === 'light' ? resolvedTheme : undefined

  return <BaseMapTileLayer theme={theme ?? providerTheme} {...props} />
}
