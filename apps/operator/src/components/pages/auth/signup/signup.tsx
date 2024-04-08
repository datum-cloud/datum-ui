'use client'

import { useState } from 'react'
import { clsx } from 'clsx'
import { useRouter } from 'next/navigation'
import { SimpleForm } from '@repo/ui/simple-form'
import { TextInput } from '@repo/ui/text-input'
import { MessageBox } from '@repo/ui/message-box'
import { Button } from '@repo/ui/button'
import { ArrowUpRight } from 'lucide-react'
import { registerUser, type RegisterUser } from '@/lib/user'

export const SignupPage = () => {
  const router = useRouter()
  const [errorResponse, setErrorResponse] = useState({ message: '' })
  const [isLoading, setIsLoading] = useState<boolean>(false)

  return (
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
          icon={<ArrowUpRight />}
          size="md"
          type="submit"
          iconAnimated
        >
          {isLoading ? 'loading' : 'Sign up'}
        </Button>
      </SimpleForm>
      {errorResponse.message && (
        <MessageBox
          className={clsx('p-4 ml-1', errorResponse.message ? '' : 'invisible')}
          message={errorResponse.message}
        />
      )}
    </div>
  )
}
