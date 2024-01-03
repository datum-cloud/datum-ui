import type { Metadata } from 'next'
import Image from 'next/image'
import { clsx } from 'clsx'
import { Drawer } from '@repo/ui/drawer'
import { GlobalSearch } from '@repo/ui/global-search'
import { Avatar } from '../../components/avatar'
import logo from '../../../public/logos/logo_orange_icon.svg'
import speedometerIcon from '../../../public/icons/speedometer.svg'
import carbonIcon from '../../../public/icons/carbon_neutral.svg'
import tasksIcon from '../../../public/icons/tasks.svg'
import envelopOpenIcon from '../../../public/icons/envelope-open.svg'
import bellIcon from '../../../public/icons/bell.svg'
import bookIcon from '../../../public/icons/book.svg'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'The open source foundation of a sustainable digital world',
}

const navigation = [
  { name: 'Dashboard', href: '#', icon: speedometerIcon, current: true },
  { name: 'Carbon', href: '#', icon: carbonIcon, current: false },
  { name: 'Tasks & Mentions', href: '#', icon: tasksIcon, current: false },
  { name: 'Inbox', href: '#', icon: envelopOpenIcon, current: false },
]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <>
      <Drawer navigation={navigation} />

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:top-16 h-full lg:inset-y-0 lg:z-30 lg:flex lg:w-72 lg:flex-col bg-white border-0 border-r-2 border-gray-200">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto">
          <nav className="flex flex-1 flex-col px-6 py-4">
            <ul className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul className="-mx-2 space-y-1">
                  {navigation.map((item: any) => (
                    <li key={item.name}>
                      <a
                        className={clsx(
                          item.current
                            ? 'bg-gray-100 text-slate-800'
                            : 'text-slate-800 hover:text-slate-700 hover:bg-gray-100',
                          'group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6',
                        )}
                        href={item.href}
                      >
                        <Image
                          alt={`${item.name} icon`}
                          aria-hidden="true"
                          className="h-4 w-4 shrink-0"
                          src={item.icon}
                        />
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="fixed w-full top-0 z-40 flex items-center h-16 pr-4 bg-[#433A5B]">
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

        <button
          type="button"
          className="w-8 h-8 text-gray-400 hover:text-gray-500 mr-6"
        >
          <span className="sr-only">View notifications</span>
          <Image alt="alerts icons" src={bellIcon} />
        </button>

        <Avatar />
      </div>

      <main className="w-full h-[calc(100%-4rem)] overflow-hidden lg:fixed lg:top-16 lg:left-72 lg:w-[calc(100%-18rem)] px-7 py-8 ease-in-out">
        {children}
      </main>
    </>
  )
}
