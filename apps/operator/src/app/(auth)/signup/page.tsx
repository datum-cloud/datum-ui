'use client'

import React, { useState } from 'react'
import clsx from 'clsx';
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { SimpleForm } from '@repo/ui/simple-form'
import { TextInput } from '@repo/ui/text-input'
import { MessageBox } from '@repo/ui/message-box'
import { Button } from '@repo/ui/button'
import { registerUser } from '../../../lib/user'
import type { RegisterUser } from '../../../lib/user'
import logoReversed from '../../../../public/logos/logo_orange_icon.svg'

const AuthSignup: React.FC = () => {
  const router = useRouter()
  const [errorResponse, setErrorResponse] = useState({ message: '' });
  const [isLoading, setIsLoading] = useState<boolean>(false)


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

              setIsLoading(true)

              try {
                if (payload.password === payload.confirmedPassword) {
                  delete payload.confirmedPassword

                  const res: any = await registerUser(payload)
                  if (res?.ok) {
                    router.push('/verify')
                  }
                  else if (res?.message) {
                    setErrorResponse({ message: res.message })
                  }
                  else {
                    setErrorResponse({ message: 'Unknown error. Please try again.' })
                  }
                }
                else {
                  setErrorResponse({ message: 'Passwords do not match' })
                }
              } catch (error) {
                setErrorResponse({ message: 'Unknown error. Please try again.' })
              } finally {
                setIsLoading(false)
              }
            }}
          >
            <div className="flex flex-col sm:flex-row gap-2">
              <TextInput name="first_name" placeholder="First Name" required={true} />
              <TextInput name="last_name" placeholder="Last Name" required={true} />
            </div>
            <TextInput name="email" placeholder="email@domain.net" type="email" required={true} />
            <TextInput name="password" placeholder="password" type="password" required={true} />
            <TextInput
              name="confirmedPassword"
              placeholder="confirm password"
              type="password"
              required={true}
            />
            <Button className="mr-auto mt-2 w-full" loading={isLoading ? true : undefined} type="submit">
              Register
            </Button>
          </SimpleForm>
          <MessageBox className={clsx("p-4 ui-ml-1", errorResponse.message ? '' : 'invisible')} message={errorResponse.message} />
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
