'use client'

import { signOut, useSession } from 'next-auth/react'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import Link from 'next/link'

export const Avatar = () => {
  const session = useSession()

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center w-8 h-8">
        <span className="sr-only">Open user menu</span>
        <div className="ui-flex items-center justify-center h-8 w-8 rounded-md bg-orange-300 uppercase font-bold text-lg text-white">
          <span className="text-white uppercase leading-8">
            {session.data?.user?.name?.substring(0, 2)}
          </span>
        </div>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white dark:bg-peat-900 py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
          <Menu.Item>
            <Link
              className="hover:dark:bg-peat-800 hover:bg-blackberry-100 group flex items-center gap-x-3 rounded-t-md p-2 text-sm leading-6"
              href="/profile"
            >
              My Profile
            </Link>
          </Menu.Item>
          <Menu.Item>
            <button
              type="button"
              className="hover:dark:bg-peat-800 hover:bg-blackberry-100 group flex items-center gap-x-3 rounded-b-md p-2 text-sm leading-6 w-full"
              onClick={() => {
                signOut()
              }}
            >
              Logout
            </button>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default Avatar
