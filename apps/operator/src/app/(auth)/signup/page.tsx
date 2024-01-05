'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SimpleForm } from '@repo/ui/simple-form'
import { TextInput } from '@repo/ui/text-input'
import { Button } from '@repo/ui/button'
import logoReversed from '../../../../public/logos/logo_orange_icon.svg'

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
        <div className="flex flex-col mt-8 justify-start">
          <SimpleForm
            classNames="space-y-2"
            onSubmit={(e: object) => {
              console.log('submit form json data => ', e)
            }}
          >
            <TextInput name="name" placeholder="Frodo Baggins" />
            <TextInput name="email" placeholder="email@domain.net" />
            <TextInput name="password" placeholder="password" type="password" />
            <TextInput
              name="confirmPassword"
              placeholder="confirm password"
              type="password"
            />
            <Button className="mr-auto mt-2 w-full" type="submit">
              Sign In
            </Button>
          </SimpleForm>
          <div className="flex items-center mt-4">
            <Link
              className="text-base text-sunglow-900 underline underline-offset-2"
              href="/login"
            >
              Already have an account?
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Landing
