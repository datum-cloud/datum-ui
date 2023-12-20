'use client'

import React from 'react'
import Image from 'next/image'
import { Button } from '@repo/ui/button'
import { TextInput } from '@repo/ui/text-input'
import logoReversed from '../../../../public/logos/full_reversed.svg'
import SimpleForm from '@repo/ui/simple-form'

const AuthLogin: React.FC = () => {
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
        <div className="flex flex-col mt-8 justify-start">
          <SimpleForm
            onSubmit={(e: any) => console.log('submit form json data => ', e)}
            classNames="space-y-2"
          >
            <TextInput name="email" placeholder="email@domain.net" />
            <TextInput name="password" placeholder="password" type="password" />
            <Button type="submit" className="mr-auto mt-2 w-full">
              Sign In
            </Button>
          </SimpleForm>
        </div>
      </div>
    </main>
  )
}

export default AuthLogin
