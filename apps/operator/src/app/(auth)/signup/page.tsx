'use client'

import { useState } from 'react'
import { clsx } from 'clsx'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { SimpleForm } from '@repo/ui/simple-form'
import { TextInput } from '@repo/ui/text-input'
import { MessageBox } from '@repo/ui/message-box'
import { Button } from '@repo/ui/button'
import { Logo } from '@repo/ui/logo'
import { registerUser } from '../../../lib/user'
import type { RegisterUser } from '../../../lib/user'

const AuthSignup: React.FC = () => {
  const router = useRouter()
  const [errorResponse, setErrorResponse] = useState({ message: '' })
  const [isLoading, setIsLoading] = useState<boolean>(false)

  return (
    <>
      <div className="mx-auto max-h-20">
        <Logo theme="dark" width={128} />
      </div>
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
                } else if (res?.message) {
                  setErrorResponse({ message: res.message })
                } else {
                  setErrorResponse({
                    message: 'Unknown error. Please try again.',
                  })
                }
              } else {
                setErrorResponse({ message: 'Passwords do not match' })
              }
            } catch (error) {
              setErrorResponse({
                message: 'Unknown error. Please try again.',
              })
            } finally {
              setIsLoading(false)
            }
          }}
        >
          <div className="flex flex-col sm:flex-row gap-2">
            <TextInput name="first_name" placeholder="First Name" required />
            <TextInput name="last_name" placeholder="Last Name" required />
          </div>
          <TextInput
            name="email"
            placeholder="email@domain.net"
            required
            type="email"
          />
          <TextInput
            name="password"
            placeholder="password"
            required
            type="password"
          />
          <TextInput
            name="confirmedPassword"
            placeholder="confirm password"
            required
            type="password"
          />
          <Button
            className="mr-auto mt-2 w-full"
            loading={isLoading ? true : undefined}
            type="submit"
          >
            Register
          </Button>
        </SimpleForm>
        <MessageBox
          className={clsx('p-4 ml-1', errorResponse.message ? '' : 'invisible')}
          message={errorResponse.message}
        />
        <div className="flex items-center mt-4">
          <Link
            className="text-base text-sunglow-900 underline underline-offset-2"
            href="/login"
          >
            Already have an account?
          </Link>
        </div>
      </div>
    </>
  )
}

export default AuthSignup
