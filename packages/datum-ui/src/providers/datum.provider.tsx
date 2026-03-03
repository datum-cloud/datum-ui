'use client'

import type { ReactNode } from 'react'
import type { Theme, ThemeStyle } from '../components/themes/types'
import { ThemeProvider } from '../components/themes/theme.provider'

// Auto-load all styles when DatumProvider is imported
import '../styles/root.css'

export interface DatumProviderProps {
  children: ReactNode
  /** Theme mode: light, dark, or follow system preference */
  defaultTheme?: Theme
  /** Visual style variant applied to the design system */
  themeStyle?: ThemeStyle
  /** Force a specific theme, overriding user preference */
  forcedTheme?: Theme
  /** localStorage key for theme persistence */
  storageKey?: string
  /** Disable CSS transitions during theme switches */
  disableTransitionOnChange?: boolean
  /** CSP nonce for inline script */
  nonce?: string
}

const THEME_STYLE_MAP: Record<ThemeStyle, Record<'light' | 'dark', string>> = {
  alpha: { light: 'theme-alpha', dark: 'theme-alpha dark' },
  default: { light: 'theme-default', dark: 'theme-default dark' },
  experimental: { light: 'theme-experimental', dark: 'theme-experimental dark' },
}

export function DatumProvider({
  children,
  defaultTheme = 'system',
  themeStyle = 'alpha',
  storageKey = 'datum-theme',
  ...props
}: DatumProviderProps) {
  const styleMap = THEME_STYLE_MAP[themeStyle]

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={defaultTheme}
      storageKey={storageKey}
      enableSystem
      enableColorScheme
      value={{ light: styleMap.light, dark: styleMap.dark }}
      {...props}
    >
      {children}
    </ThemeProvider>
  )
}
