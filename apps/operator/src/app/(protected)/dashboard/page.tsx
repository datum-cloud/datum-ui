'use client'

import React from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import arrowRight from '../../../../public/icons/arrow-right-dark.svg'
import PageTitle from '../../../components/page-title'

const DashboardLanding: React.FC = () => {
  const session = useSession()

  return (
    <section className="rounded-md flex flex-col items-center justify-center relative">
      <PageTitle
        title={
          <>
            <span className="capitalize">{session.data?.user?.name}</span>,
            welcome back!
          </>
        }
      />
      <div className="w-full mt-8 h-full grid lg:grid-cols-2 gap-4">
        <div className="col-span-1 min-h-[294px] flex flex-col items-start justify-center rounded border border-blackberry-100 dark:border-winter-sky-900 px-6 py-4 bg-white dark:bg-white">
          <div className="flex flex-col items-start xl:flex-row xl:items-center w-full mb-4">
            <h2 className="text-lg">My Assets</h2>
            <Link
              className="flex items-center xl:ml-auto rounded px-2 py-1 border border-blackberry-400 dark:border-winter-sky-900 font-light text-sm hover:bg-white hover:dark:bg-white"
              href="#"
            >
              view all
              <Image
                alt="view all assets icon"
                className="w-3 ml-2"
                src={arrowRight}
              />
            </Link>
          </div>

          <div className="bg-white dark:bg-white rounded w-full flex-1 animate-pulse" />
        </div>
        <div className="col-span-1 min-h-[294px] flex flex-col items-start justify-center rounded border border-blackberry-100 dark:border-winter-sky-900 px-6 py-4 bg-white dark:bg-white">
          <div className="flex flex-col items-start xl:flex-row xl:items-center w-full mb-4">
            <h2 className="text-base xl:text-lg">Groups &amp; Users</h2>
            <Link
              className="flex items-center xl:ml-auto rounded px-2 py-1 border border-blackberry-400 dark:border-winter-sky-900 font-light text-sm hover:bg-white hover:dark:bg-white"
              href="#"
            >
              view all
              <Image
                alt="view all assets icon"
                className="w-3 ml-2"
                src={arrowRight}
              />
            </Link>
          </div>
          <div className="bg-white dark:bg-white rounded w-full flex-1 animate-pulse" />
        </div>
        <div className="col-span-1 min-h-[294px] flex flex-col items-start justify-center rounded border border-blackberry-100 dark:border-winter-sky-900 px-6 py-4 bg-white dark:bg-white">
          <div className="flex flex-col items-start xl:flex-row xl:items-center w-full mb-4">
            <h2 className="text-lg">Connected Integrations</h2>
            <Link
              className="flex items-center xl:ml-auto rounded px-2 py-1 border border-blackberry-400 dark:border-winter-sky-900 font-light text-sm hover:bg-white hover:dark:bg-white"
              href="#"
            >
              view all
              <Image
                alt="view all assets icon"
                className="w-3 ml-2"
                src={arrowRight}
              />
            </Link>
          </div>
          <div className="bg-white dark:bg-white rounded w-full flex-1 animate-pulse" />
        </div>
        <div className="col-span-1 min-h-[294px] flex flex-col items-start justify-center rounded border border-blackberry-100 dark:border-winter-sky-900 px-6 py-4 bg-white dark:bg-white">
          <div className="flex flex-col items-start xl:flex-row xl:items-center w-full mb-4">
            <h2 className="text-lg">Top Active Sessions</h2>
            <Link
              className="flex items-center xl:ml-auto rounded px-2 py-1 border border-blackberry-400 dark:border-winter-sky-900 font-light text-sm hover:bg-white hover:dark:bg-white"
              href="#"
            >
              view all
              <Image
                alt="view all assets icon"
                className="w-3 ml-2"
                src={arrowRight}
              />
            </Link>
          </div>
          <Link
            className="flex items-center mb-4 underline underline-offset-2 text-blue-400 dark:text-blue-200"
            href="#"
          >
            Add Integration
          </Link>
          <div className="bg-white dark:bg-white rounded w-full flex-1 animate-pulse" />
        </div>
        <div className="col-span-1 min-h-[294px] flex flex-col items-start justify-center rounded border border-blackberry-100 dark:border-winter-sky-900 px-6 py-4 bg-white dark:bg-white">
          <div className="flex flex-col items-start xl:flex-row xl:items-center w-full mb-4">
            <h2 className="text-lg">My Tasks</h2>
            <Link
              className="flex items-center xl:ml-auto rounded px-2 py-1 border border-blackberry-400 dark:border-winter-sky-900 font-light text-sm hover:bg-white hover:dark:bg-white"
              href="#"
            >
              view all
              <Image
                alt="view all assets icon"
                className="w-3 ml-2"
                src={arrowRight}
              />
            </Link>
          </div>
          <div className="bg-white dark:bg-white rounded w-full flex-1 animate-pulse" />
        </div>
      </div>
    </section>
  )
}

export default DashboardLanding
