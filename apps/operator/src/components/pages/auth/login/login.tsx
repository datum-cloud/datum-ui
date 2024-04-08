'use client'

import { LoginUser } from '@repo/dally/user'
import { Button } from '@repo/ui/button'
import MessageBox from '@repo/ui/message-box'
import SimpleForm from '@repo/ui/simple-form'
import TextInput from '@repo/ui/text-input'
import clsx from 'clsx'
import { ArrowUpRight } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'
import { Separator } from '@repo/ui/separator'
import { loginStyles } from './login.styles'
import { GoogleIcon } from '@repo/ui/icons/google'
import { GithubIcon } from '@repo/ui/icons/github'

export const LoginPage = () => {
  const { separator, buttons } = loginStyles()
  const router = useRouter()
  const [signInError, setSignInError] = useState(false)
  const [signInLoading, setSignInLoading] = useState(false)
  const showLoginError = !signInLoading && signInError
  const [showPassword, setShowPassword] = useState(false)

  /**
   * Submit client-side sign-in function using username and password
   */
  const submit = async (payload: LoginUser) => {
    setSignInLoading(true)
    setSignInError(false)
    try {
      const res: any = await signIn('credentials', {
        redirect: false,
        ...payload,
      })
      if (res.ok && !res.error) {
        router.push('/dashboard')
      } else {
        setSignInLoading(false)
        setSignInError(true)
      }
    } catch (error) {
      setSignInLoading(false)
      setSignInError(true)
    }
  }

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
    <>
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
            Log in with Google
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
            Log in with GitHub
          </Button>
        </div>

        <Separator label="or" className={separator()} />

        <SimpleForm
          classNames="space-y-2"
          onSubmit={(e: any) => {
            submit(e)
          }}
        >
          <TextInput name="username" placeholder="email@domain.net" />
          <div className="flex relative">
            <TextInput
              name="password"
              placeholder="password"
              type={showPassword ? 'text' : 'password'}
            />
            <button
              className="flex justify-around items-center absolute  right-2.5 bottom-2"
              onClick={() => {
                setShowPassword(!showPassword)
              }}
              type="button"
            >
              {showPassword ? (
                <Image
                  alt="hide password icon"
                  height={20}
                  src="/icons/visibility-off.svg"
                  width={20}
                />
              ) : (
                <Image
                  alt="show password icon"
                  height={20}
                  src="/icons/visibility.svg"
                  width={20}
                />
              )}
            </button>
          </div>

          <Button
            className="mr-auto mt-2 w-full"
            icon={<ArrowUpRight />}
            size="md"
            type="submit"
            iconAnimated
          >
            Login
          </Button>
        </SimpleForm>
        {showLoginError && (
          <MessageBox
            className={clsx('p-4 ml-1', showLoginError ? '' : 'invisible')}
            message="Could not login. Please try again."
          />
        )}
      </div>
    </>
  )
}
