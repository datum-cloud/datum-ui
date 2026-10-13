import type { ColorScheme, Motion, Palette, Radius, RadiusScale, SemanticColors, Spacing, Typography } from '@datum-cloud/datum-ui-tokens'
import type { ReactNode } from 'react'
import type { DatumFonts } from './fonts'
import { colors, motion, palette, radius, radiusScale, spacing, typography } from '@datum-cloud/datum-ui-tokens'
import { createContext, use, useMemo } from 'react'
import { useColorScheme } from 'react-native'
import { platformFonts } from './fonts'

export type { ColorScheme }
export type ColorSchemePreference = ColorScheme | 'system'

export interface DatumTheme {
  scheme: ColorScheme
  colors: SemanticColors
  palette: Palette
  spacing: Spacing
  radius: Radius
  radiusScale: RadiusScale
  typography: Typography
  fonts: DatumFonts
  motion: Motion
}

function createTheme(scheme: ColorScheme): DatumTheme {
  return {
    scheme,
    colors: colors[scheme],
    palette,
    spacing,
    radius,
    radiusScale,
    typography,
    fonts: platformFonts,
    motion,
  }
}

/** Prebuilt light and dark themes. */
export const datumThemes: Record<ColorScheme, DatumTheme> = {
  light: createTheme('light'),
  dark: createTheme('dark'),
}

const DatumThemeContext = createContext<DatumTheme | null>(null)

export interface DatumThemeProviderProps {
  children?: ReactNode
  /** `'system'` (default) follows the OS appearance via `useColorScheme()`. */
  scheme?: ColorSchemePreference
}

export function DatumThemeProvider({ children, scheme = 'system' }: DatumThemeProviderProps) {
  const system = useColorScheme()
  const resolved: ColorScheme = scheme === 'system' ? (system === 'dark' ? 'dark' : 'light') : scheme
  const theme = useMemo(() => datumThemes[resolved], [resolved])
  return <DatumThemeContext value={theme}>{children}</DatumThemeContext>
}

/**
 * The active Datum theme. Outside a `DatumThemeProvider` it follows the OS
 * appearance, so components also work without a provider.
 */
export function useDatumTheme(): DatumTheme {
  const theme = use(DatumThemeContext)
  const system = useColorScheme()
  return theme ?? datumThemes[system === 'dark' ? 'dark' : 'light']
}
