import type { ReactNode } from 'react'

import { RootProvider } from 'fumadocs-ui/provider/next'

import { Providers } from '@/components/providers'
import './globals.css'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootProvider theme={{ enabled: false }}>
          <Providers>{children}</Providers>
        </RootProvider>
      </body>
    </html>
  )
}

export const metadata = {
  title: 'datum-ui',
  description: 'Datum Cloud Design System Documentation',
}
