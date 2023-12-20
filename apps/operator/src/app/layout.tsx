import './globals.css'
import '@repo/ui/styles.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Operator Portal | Datum | Start here, go anywhere',
  description: 'The open source foundation of a sustainable digital world',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <html className="h-full relative" lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
