import React from 'react'
import Image from 'next/image'
import logoReversed from '../../public/logos/full_reversed.svg'
import Link from 'next/link'

const Landing: React.FC = () => {
  return (
    <main className="flex flex-col min-h-screen w-full items-center space-between dark:bg-dk-surface-0 bg-surface-0">
      <div className="flex flex-col justify-center mx-auto my-auto w-full p-6 sm:w-1/3 h-full relative ease-in-out">
        <Image
          alt="datum imagery background"
          className="mx-auto"
          priority
          src={logoReversed as string}
          width={385}
        />
        <Link href="/login" className="mr-auto">
          Let&apos;s get started
        </Link>
      </div>
    </main>
  )
}

export default Landing
