'use client'

import { useState } from 'react'
import { clsx } from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Logo } from '@repo/ui/logo'
import { TextInput } from '@repo/ui/text-input'
import { MessageBox } from '@repo/ui/message-box'
import { SimpleForm } from '@repo/ui/simple-form'
import { Button } from '@repo/ui/button'
import { type LoginUser } from '../../../lib/user'

const AuthLogin: React.FC = () => {
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
      <div className="mx-auto max-h-20">
        <Logo theme="dark" width={128} />
      </div>
      <div className="flex flex-col mt-8 justify-start">
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
            loading={signInLoading ? true : undefined}
            type="submit"
          >
            Login
          </Button>
        </SimpleForm>
        <br />

        <button
          className="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex justify-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 me-1 mb-2 ml-1"
          onClick={() => {
            github()
          }}
          type="button"
        >
          <svg
            aria-hidden="true"
            className="w-4 h-4 me-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
              fillRule="evenodd"
            />
          </svg>
          Sign in with Github
        </button>

        <button
          className="!text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex justify-center dark:focus:ring-[#4285F4]/55 me-1 mb-2 ml-1"
          onClick={() => {
            google()
          }}
          type="button"
        >
          <svg
            aria-hidden="true"
            className="w-4 h-4 me-2"
            fill="currentColor"
            viewBox="0 0 18 19"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z"
              fillRule="evenodd"
            />
          </svg>
          Sign in with Google
        </button>
        <MessageBox
          className={clsx('p-4 ml-1', showLoginError ? '' : 'invisible')}
          message="Could not login. Please try again."
        />
        <div className="flex items-center mt-4">
          <Link
            className="text-base text-sunglow-900 underline underline-offset-2"
            href="/signup"
          >
            Need to create an account?
          </Link>
        </div>
      </div>
    </>
  )
}

export default AuthLogin
