import type { Metadata } from 'next'
import Image from 'next/image'
import { Drawer } from '@repo/ui/drawer'
import { GlobalSearch } from '@repo/ui/global-search'
import { Alerts } from '@repo/ui/alerts'
import routes from '../../routes'
import { Avatar } from '../../components/avatar'
import logo from '../../../public/logos/logo_orange_icon.svg'
import bookIcon from '../../../public/icons/book.svg'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'The open source foundation of a sustainable digital world',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <>
      <Drawer routes={routes} />

      <div className="fixed w-full top-0 z-40 flex items-center h-16 pr-4 bg-blackberry-800 dark:bg-peat-800 border-0 border-b border-blackberry-100 dark:border-peat-700">
        <div className="flex items-center px-4">
          <Image alt="dataum logo" className="max-h-16" src={logo} />
        </div>

        <GlobalSearch />

        <a
          className="flex items-center hover:bg-indigo-400/50 h-10 rounded px-4 py-2 ease-in-out mr-6"
          href="https://docs.datum.net/overview/datum"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Image alt="Datum documentation link" src={bookIcon} />
          <span className="text-white ml-3">Docs</span>
        </a>

        <Alerts />
        <Avatar />
      </div>

      <main className="w-full h-[calc(100%-4rem)] fixed top-16 overflow-hidden lg:left-16 lg:w-[calc(100%-4rem)] 2xl:left-72 2xl:w-[calc(100%-18rem)] px-7 py-8 ease-in-out">
        {children}
      </main>
    </>
  )
}
