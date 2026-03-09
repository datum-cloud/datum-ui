'use client'

import type { ReactNode } from 'react'

import { ThemeProvider } from '@datum-cloud/datum-ui/theme'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  )
}
