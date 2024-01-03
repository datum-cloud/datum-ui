'use client'

import React from 'react'
import localFont from 'next/font/local'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import tagline from '../../../../../public/backgrounds/blinking_cursor_tagline.gif'

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
    <section className="rounded-md flex flex-col items-center justify-center relative">
      <h1
        className={`text-4xl leading-10 mb-4 text-left w-full font-bold ${karelia.className}`}
      >
        <span className="capitalize">{session.data?.user?.name}</span>, welcome
        back!
      </h1>
      <Image
        alt="start here go anywhere with blinking cursor"
        className="rounded-md w-full"
        src={tagline}
      />
    </section>
  )
}

export default DashboardLanding
