'use client'

import React from 'react'
import Image from 'next/image'
import { Button } from '@repo/ui/button'
import { useSearchParams } from 'next/navigation'
import { useVerifyUser } from '../../../lib/user'
import logoReversed from '../../../../public/logos/logo_orange_icon.svg'

const VerifyUser: React.FC = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const { isLoading } = useVerifyUser(token ?? null)

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
        {isLoading && (
          <h1 className="text-3xl text-center mt-4 animate-pulse">
            Verifying your account...
          </h1>
        )}
        {!isLoading && (
          <div>
            <h1 className="text-3xl text-center mt-4">
              Please check your email to verify your account.
            </h1>
          </div>
        )}
        <div className="mt-12">
          <Button
            className="mr-auto mt-2 w-full"
            onClick={() => {
              console.log('resend email')
            }}
            type="button"
          >
            Didn&apos;t get the email? Click here to resend.
          </Button>
        </div>
      </div>
    </main>
  )
}

export default VerifyUser
