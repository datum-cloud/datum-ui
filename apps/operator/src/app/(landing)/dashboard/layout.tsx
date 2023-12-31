import type { Metadata } from 'next'

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
    <main className="w-full h-screen overflow-hidden relative grid grid-cols-6">
      <div className="col-span-1 h-full bg-surface-0 dark:bg-dk-surface-0" />
      <div className="col-span-5 p-2">{children}</div>
    </main>
  )
}
