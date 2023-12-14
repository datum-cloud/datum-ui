import React from 'react'
import Image from 'next/image'
import { Button } from '@repo/ui/button'
import logoReversed from '../../public/logos/full_reversed.svg'

export const Landing: React.FC = () => {
  return (
    <main className="flex flex-col min-h-screen w-full items-center space-between sp-24 dark:bg-dk-surface-0 bg-surface-0">
      <div className="flex flex-col justify-center mx-auto my-auto w-full p-6 sm:w-1/3 h-full relativee ease-in-out">
        <Image
          alt="datum imagery background"
          className="mx-auto"
          priority
          src={logoReversed as string}
          width={385}
        />
        <Button appName="Datum Operator Portal">Let&apos;s get started</Button>
      </div>
    </main>
  )
}

export default Landing
