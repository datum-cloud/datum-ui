'use client'

import { useState } from 'react'
import { clsx } from 'clsx'
import { useRouter } from 'next/navigation'
import { SimpleForm } from '@repo/ui/simple-form'
import { MessageBox } from '@repo/ui/message-box'
import { Button } from '@repo/ui/button'
import { ArrowUpRight } from 'lucide-react'
import { registerUser, type RegisterUser } from '@/lib/user'
import { GoogleIcon } from '@repo/ui/icons/google'
import { GithubIcon } from '@repo/ui/icons/github'
import { signIn } from 'next-auth/react'
import { signupStyles } from './signup.styles'
import { Separator } from '@repo/ui/separator'
import { Input } from '@repo/ui/input'
import { PasswordInput } from '@repo/ui/password-input'

export const SignupPage = () => {
  const router = useRouter()
  const [errorResponse, setErrorResponse] = useState({ message: '' })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { separator, buttons } = signupStyles()

  /**
   * Setup Github Authentication
   */
  const github = async () => {
    await signIn('github', {
      callbackUrl: '/dashboard',
    })
  }

  /**
   * Setup Google Authentication
   */
  const google = async () => {
    await signIn('google', {
      callbackUrl: '/dashboard',
    })
  }

  return (
    <div className="flex flex-col mt-8 justify-start">
      <div className={buttons()}>
        <Button
          variant="outline"
          size="md"
          icon={<GoogleIcon />}
          iconPosition="left"
          onClick={() => {
            google()
          }}
        >
          Sign up with Google
        </Button>

        <Button
          variant="outline"
          size="md"
          icon={<GithubIcon />}
          iconPosition="left"
          onClick={() => {
            github()
          }}
        >
          Sign up with GitHub
        </Button>
      </div>

      <Separator label="or" className={separator()} />

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
        <Input
          name="email"
          placeholder="email@domain.net"
          required
          type="email"
        />
        <PasswordInput
          name="password"
          placeholder="password"
          required
          type="password"
        />
        <PasswordInput
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
