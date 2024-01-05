'use client'

import React from 'react'
import localFont from 'next/font/local'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import arrowRight from '../../../../../public/icons/arrow-right-dark.svg'

const karelia = localFont({
  src: [
    {
      path: '../../../fonts/KareliaWeb-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../fonts/KareliaWeb-Medium.ttf',
      weight: '500',
      style: 'medium',
    },
  ],
})

const DashboardLanding: React.FC = () => {
  const session = useSession()

  return (
    <section className="h-full rounded-md flex flex-col items-center justify-center relative">
      <h1
        className={`text-4xl leading-10 mb-4 text-left w-full font-bold ${karelia.className}`}
      >
        <span className="capitalize">{session.data?.user?.name}</span>, welcome
        back!
      </h1>
      <div className="w-full h-full grid grid-cols-2 gap-4">
        <div className="col-span-1 flex flex-col items-start justify-center rounded border border-blackberry-400 dark:border-peat-700 px-6 py-4 bg-white dark:bg-peat-800">
          <div className="flex items-center w-full mb-4">
            <h2 className="text-lg">My Assets</h2>
            <Link
              href="#"
              className="flex items-center ml-auto rounded px-2 py-1 border border-blackberry-400 dark:border-peat-700 font-light text-sm hover:bg-blackberry-400 hover:dark:bg-peat-700"
            >
              view all
              <Image
                src={arrowRight}
                alt="view all assets icon"
                className="w-3 ml-2"
              />
            </Link>
          </div>

          <div className="bg-blackberry-100 dark:bg-peat-700 rounded w-full flex-1 animate-pulse"></div>
        </div>
        <div className="col-span-1 flex flex-col items-start justify-center rounded border border-blackberry-400 dark:border-peat-700 px-6 py-4 bg-white dark:bg-peat-800">
          <div className="flex items-center w-full mb-4">
            <h2 className="text-lg">Groups &amp; Users</h2>
            <Link
              href="#"
              className="flex items-center ml-auto rounded px-2 py-1 border border-blackberry-400 dark:border-peat-700 font-light text-sm hover:bg-blackberry-400 hover:dark:bg-peat-700"
            >
              view all
              <Image
                src={arrowRight}
                alt="view all assets icon"
                className="w-3 ml-2"
              />
            </Link>
          </div>
          <div className="bg-blackberry-100 dark:bg-peat-700 rounded w-full flex-1 animate-pulse"></div>
        </div>
        <div className="col-span-1 flex flex-col items-start justify-center rounded border border-blackberry-400 dark:border-peat-700 px-6 py-4 bg-white dark:bg-peat-800">
          <div className="flex items-center w-full mb-4">
            <h2 className="text-lg">Connected Integrations</h2>
            <Link
              href="#"
              className="flex items-center ml-auto rounded px-2 py-1 border border-blackberry-400 dark:border-peat-700 font-light text-sm hover:bg-blackberry-400 hover:dark:bg-peat-700"
            >
              view all
              <Image
                src={arrowRight}
                alt="view all assets icon"
                className="w-3 ml-2"
              />
            </Link>
          </div>
          <div className="bg-blackberry-100 dark:bg-peat-700 rounded w-full flex-1 animate-pulse"></div>
        </div>
        <div className="col-span-1 flex flex-col items-start justify-center rounded border border-blackberry-400 dark:border-peat-700 px-6 py-4 bg-white dark:bg-peat-800">
          <div className="flex items-center w-full mb-4">
            <h2 className="text-lg">Top Active Sessions</h2>
            <Link
              href="#"
              className="flex items-center ml-auto rounded px-2 py-1 border border-blackberry-400 dark:border-peat-700 font-light text-sm hover:bg-blackberry-400 hover:dark:bg-peat-700"
            >
              view all
              <Image
                src={arrowRight}
                alt="view all assets icon"
                className="w-3 ml-2"
              />
            </Link>
          </div>
          <Link
            href="#"
            className="flex items-center mb-4 underline underline-offset-2 text-blue-400 dark:text-blue-200"
          >
            Add Integration
          </Link>
          <div className="bg-blackberry-100 dark:bg-peat-700 rounded w-full flex-1 animate-pulse"></div>
        </div>
        <div className="col-span-1 flex flex-col items-start justify-center rounded border border-blackberry-400 dark:border-peat-700 px-6 py-4 bg-white dark:bg-peat-800">
          <div className="flex items-center w-full mb-4">
            <h2 className="text-lg">My Tasks</h2>
            <Link
              href="#"
              className="flex items-center ml-auto rounded px-2 py-1 border border-blackberry-400 dark:border-peat-700 font-light text-sm hover:bg-blackberry-400 hover:dark:bg-peat-700"
            >
              view all
              <Image
                src={arrowRight}
                alt="view all assets icon"
                className="w-3 ml-2"
              />
            </Link>
          </div>
          <div className="bg-blackberry-100 dark:bg-peat-700 rounded w-full flex-1 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}

export default DashboardLanding
