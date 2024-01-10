'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { SimpleForm } from '@repo/ui/simple-form'
import { TextInput } from '@repo/ui/text-input'
import { Button } from '@repo/ui/button'
import { registerUser } from '../../../lib/user'
import type { RegisterUser } from '../../../lib/user'
import logoReversed from '../../../../public/logos/logo_orange_icon.svg'

const AuthSignup: React.FC = () => {
  const router = useRouter()

  return (
    <main className="flex flex-col min-h-screen w-full items-center space-between dark:bg-dk-surface-0 bg-surface-0">
      <div className="flex flex-col justify-center mx-auto my-auto w-full p-6 sm:w-1/3 h-full relative ease-in-out">
        <Image
          alt="datum imagery background"
          className="mx-auto max-h-20"
          priority
          src={logoReversed as string}
          width={385}
        />
        <div className="flex flex-col mt-8 justify-start">
          <SimpleForm
            classNames="space-y-2"
            onSubmit={async (payload: RegisterUser) => {
              try {
                if (payload.password === payload.confirmedPassword) {
                  delete payload.confirmedPassword

                  const res = await registerUser(payload)

                  if (res?.token) {
                    router.push(`/verify?token=${res?.token}`)
                  }

                  if (res?.message) {
                    console.log('toast message => ', res.message)
                  }
                }
              } catch (error) {
                console.log(error)
              }
            }}
          >
            <div className="flex flex-col sm:flex-row gap-2">
              <TextInput name="first_name" placeholder="Frodo" />
              <TextInput name="last_name" placeholder="Baggins" />
            </div>
            <TextInput name="email" placeholder="email@domain.net" />
            <TextInput name="password" placeholder="password" type="password" />
            <TextInput
              name="confirmedPassword"
              placeholder="confirm password"
              type="password"
            />
            <Button className="mr-auto mt-2 w-full" type="submit">
              Register
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

export default AuthSignup
