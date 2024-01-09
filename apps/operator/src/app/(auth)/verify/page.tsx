'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { SimpleForm } from '@repo/ui/simple-form'
import { TextInput } from '@repo/ui/text-input'
import { Button } from '@repo/ui/button'
import { registerUser } from '@repo/dally/user'
import type { RegisterUser } from '@repo/dally/user'
import logoReversed from '../../../../public/logos/logo_orange_icon.svg'

const VerifyUser: React.FC = () => {
  const token = useSearchParams().get('token') || undefined

  console.log(token)

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
        {token && (
          <div>
            <h1 className="text-3xl text-center mt-4 animate-pulse">
              Verifying your account...
            </h1>
          </div>
        )}
        {!token && (
          <div className="flex flex-col mt-8 justify-start">
            <SimpleForm
              classNames="space-y-2"
              onSubmit={(payload: any) => {
                console.log('hit => `/v1/verify`', token)
              }}
            >
              Resend email?
              <Button className="mr-auto mt-2 w-full" type="submit">
                Send it!
              </Button>
            </SimpleForm>
          </div>
        )}
      </div>
    </main>
  )
}

export default VerifyUser
