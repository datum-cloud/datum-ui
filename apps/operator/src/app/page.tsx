'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import logoReversed from '../../public/logos/full_reversed.svg'
import bg00 from '../../public/backgrounds/bg_01.svg'

const Landing = () => {
  const router = useRouter()

  useEffect(() => {
    router.push('/dashboard')
  }, [router])

  return (
    <main className="flex items-center justify-center h-screen relative bg-surface-0 dark:bg-dk-surface-0">
      <Image
        alt="sdasd"
        className="absolute top-0 left-0 -z-0"
        fill
        objectFit="cover"
        objectPosition="top left"
        quality={100}
        src={bg00 as string}
      />
      <div className="w-full relative z-3">
        <Image
          alt="datum imagery background"
          className="mx-auto animate-pulse"
          priority
          src={logoReversed as string}
          width={385}
        />
      </div>
    </main>
  )
}

export default Landing
