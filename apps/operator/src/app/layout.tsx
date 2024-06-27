import type { Metadata } from 'next'
import { aime, ftRegola, karelia } from '../fonts'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from '@repo/ui/toaster'
import Providers from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | Datum | Start here, go anywhere',
    default: 'Operator Portal | Datum | Start here, go anywhere',
  },
  description: 'The open source foundation of a sustainable digital world',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <html className="h-full relative" lang="en" suppressHydrationWarning>
      <body
        className={`${karelia.variable} ${aime.variable} ${ftRegola.variable} font-sans w-full h-full bg-winter-sky-700 overscroll-none dark:bg-peat-900`}
      >
        <SessionProvider>
          <Providers>{children}</Providers>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  )
}
