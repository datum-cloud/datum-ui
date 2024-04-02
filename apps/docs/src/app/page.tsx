'use client'

import { Button } from '@repo/ui/button'
import { Logo } from '@repo/ui/logo'

const Landing: React.FC = () => {
  return (
    <main className="flex flex-col min-h-screen w-full items-center space-between dark:bg-dk-surface-0 bg-surface-0">
      <div className="flex flex-col justify-center mx-auto my-auto w-full p-6 sm:w-1/3 h-full relative ease-in-out">
        <Logo />
        <Button className="w-full mt-8">Let&apos;s read some docs</Button>
      </div>
    </main>
  )
}

export default Landing
