'use client'

import React from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import tagline from '../../../../public/backgrounds/blinking_cursor_tagline.gif'

const DashboardLanding: React.FC = () => {
  const session = useSession()

  return (
    <section className="rounded-md h-[600px] flex flex-col items-center justify-center relative">
      <h1 className="text-3xl capitalize mb-4">
        Welcome, {session.data?.user?.name}
      </h1>
      <Image
        alt="start here go anywhere with blinking cursor"
        className="rounded-md mx-auto"
        src={tagline}
      />
    </section>
  )
}

export default DashboardLanding
