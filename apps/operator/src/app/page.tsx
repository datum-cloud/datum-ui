'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import logoReversed from '../../public/logos/logo_orange_icon.svg'

const Landing = () => {
  const router = useRouter()

  useEffect(() => {
    router.push('/dashboard')
  }, [router])

  return (
    <main className="flex items-center justify-center h-screen relative bg-winter-sky-900 dark:bg-peat-900">
      <div className="w-full relative z-3 px-4">
        <Image
          alt="datum imagery background"
          className="mx-auto animate-pulse"
          priority
          src={logoReversed as string}
          width={385}
        />
        <h1 className="text-2xl text-center mt-4">loading your platform...</h1>
      </div>
    </main>
  )
}

export default Landing
