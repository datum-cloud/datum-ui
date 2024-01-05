'use client'

import { Fragment, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Dialog, Transition } from '@headlessui/react'
import { clsx } from 'clsx'
import logo from './assets/icon_logo.svg'

export const Drawer = ({ navigation }: any) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <Transition.Root show={sidebarOpen} as={Fragment}>
      <Dialog
        as="div"
        className="ui-relative ui-z-50 ui-lg:ui-hidden ui-ease-in-out"
        onClose={setSidebarOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ui-transition-opacity ui-ease-linear ui-duration-300"
          enterFrom="ui-opacity-0"
          enterTo="ui-opacity-100"
          leave="ui-transition-opacity ui-ease-linear ui-duration-300"
          leaveFrom="ui-opacity-100"
          leaveTo="ui-opacity-0"
        >
          <div className="ui-fixed ui-inset-0 ui-bg-gray-900/80" />
        </Transition.Child>

        <div className="ui-fixed ui-inset-0 ui-flex">
          <Transition.Child
            as={Fragment}
            enter="ui-transition ui-ease-in-out ui-duration-300 ui-transform"
            enterFrom="-ui-translate-x-full"
            enterTo="ui-translate-x-0"
            leave="ui-transition ui-ease-in-out ui-duration-300 ui-transform"
            leaveFrom="ui-translate-x-0"
            leaveTo="-ui-translate-x-full"
          >
            <Dialog.Panel className="ui-relative ui-mr-16 ui-flex ui-w-full ui-max-w-xs ui-flex-1">
              <Transition.Child
                as={Fragment}
                enter="ui-ease-in-out ui-duration-300"
                enterFrom="ui-opacity-0"
                enterTo="ui-opacity-100"
                leave="ui-ease-in-out ui-duration-300"
                leaveFrom="ui-opacity-100"
                leaveTo="ui-opacity-0"
              >
                <div className="ui-absolute ui-left-full ui-top-0 ui-flex w-16 ui-justify-center ui-pt-5">
                  <button
                    type="button"
                    className="-ui-m-2.5 ui-p-2.5"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="ui-sr-only">Close sidebar</span>❌
                  </button>
                </div>
              </Transition.Child>

              <div className="ui-flex ui-flex-col ui-w-full ui-gap-y-5 ui-overflow-y-auto dark:ui-bg-peat-800 ui-px-6 ui-pb-4 ui-ring-1 ui-ring-white/10 ease-in-out">
                <div className="ui-flex ui-items-center px-4">
                  <Image src={logo} alt="dataum logo" className="max-h-16" />
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul className="-mx-2 space-y-1">
                        {navigation.map((item: any) => (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              className={clsx(
                                item.current ? '' : '',
                                'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                              )}
                            >
                              <Image
                                alt={`${item.name} icon`}
                                aria-hidden="true"
                                className="h-6 w-6 shrink-0"
                                src={item.icon}
                              />
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default Drawer
