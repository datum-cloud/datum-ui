import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import localFont from 'next/font/local'
import './globals.css'
import '@repo/ui/styles.css'

const ftRegola = localFont({
  src: [
    {
      path: './fonts/FTRegolaNeueTrial-Regular.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/FTRegolaNeueTrial-Medium.woff',
      weight: '500',
      style: 'medium',
    },
    {
      path: './fonts/FTRegolaNeueTrial-Semibold.woff',
      weight: '600',
      style: 'semibold',
    },
  ],
})

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
        className={`${ftRegola.className} w-full h-full dark:text-white dark:bg-peat-900 bg-blackberry-50 text-peat-900`}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
