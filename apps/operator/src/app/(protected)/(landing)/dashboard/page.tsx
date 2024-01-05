'use client'

import React from 'react'
import localFont from 'next/font/local'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

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
        <div className="col-span-1 flex flex-col items-start justify-center rounded shadow px-6 py-4 bg-white dark:bg-peat-700">
          <h2 className="text-lg mb-2">Assets</h2>
          <div className="bg-gray-300 rounded flex-1"></div>
        </div>
        <div className="col-span-1 flex flex-col items-start justify-center rounded shadow px-6 py-4 bg-white dark:bg-peat-700">
          <h2 className="text-lg mb-2">Groups &amp; Users</h2>
          <div className="bg-gray-300 rounded flex-1"></div>
        </div>
        <div className="col-span-1 flex flex-col items-start justify-center rounded shadow px-6 py-4">
          <h2 className="text-lg mb-2">Connected Integrations</h2>
          <Link
            href="#"
            className="mb-4 underline underline-offset-2 text-blue-200"
          >
            Add Integration
          </Link>
          <div className="bg-gray-300 rounded flex-1"></div>
        </div>
        <div className="col-span-1 flex flex-col items-start justify-center rounded shadow px-6 py-4">
          <h2 className="text-lg mb-2">Active Sessions</h2>
          <div className="bg-gray-300 rounded flex-1"></div>
        </div>
        <div className="col-span-1 flex flex-col items-start justify-center rounded shadow px-6 py-4">
          <h2 className="text-lg mb-2">My Tasks</h2>
          <div className="bg-gray-300 rounded flex-1"></div>
        </div>
      </div>
    </section>
  )
}

export default DashboardLanding
