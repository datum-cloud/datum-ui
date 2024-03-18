import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import './globals.css'
import '@repo/ui/styles.css'
import { aime, ftRegola, karelia } from './fonts/fonts'


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
    <html className="h-full relative" lang="en">
      <body
        className={` ${karelia.variable} ${aime.variable} ${ftRegola.variable} font-sans  w-full h-full dark:text-white dark:bg-blackberry-800  text-peat-800 dark-mode`}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
