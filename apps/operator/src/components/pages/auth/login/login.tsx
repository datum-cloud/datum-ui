'use client'

import { LoginUser } from '@repo/dally/user'
import { Button } from '@repo/ui/button'
import MessageBox from '@repo/ui/message-box'
import SimpleForm from '@repo/ui/simple-form'
import { ArrowUpRight, KeyRoundIcon } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Separator } from '@repo/ui/separator'
import { loginStyles } from './login.styles'
import { GoogleIcon } from '@repo/ui/icons/google'
import { GithubIcon } from '@repo/ui/icons/github'
import { Input } from '@repo/ui/input'
import { PasswordInput } from '@repo/ui/password-input'
import { Label } from '@repo/ui/label'
import { getPasskeyOptions, verifyRegistration } from '@/lib/user'
import { startRegistration } from '@simplewebauthn/browser'

export const LoginPage = () => {
  const { separator, buttons, keyIcon, form, input } = loginStyles()
  const router = useRouter()
  const [signInError, setSignInError] = useState(false)
  const [signInLoading, setSignInLoading] = useState(false)
  const showLoginError = !signInLoading && signInError
  const [isPasswordActive, setIsPasswordActive] = useState(false)

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

  /**
   * Setup PassKey Authentication
   */
  const registerPassKey = async () => {
    const options: any = await getPasskeyOptions({
      email: 'test-passkey-auth@hannahking.com',
      name: 'Hannah King',
    })

    const attestationResponse = await startRegistration(options.publicKey)
    console.log(attestationResponse)

    const verificationResult = await verifyRegistration({ attestationResponse })
    console.log(verificationResult)
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

          <Button
            variant="outline"
            size="md"
            icon={<KeyRoundIcon className={keyIcon()} />}
            iconPosition="left"
            onClick={() => {
              registerPassKey()
            }}
          >
            Log in with PassKey
          </Button>
        </div>

        <Separator label="or" className={separator()} />

        <SimpleForm
          classNames={form()}
          onSubmit={(e: any) => {
            submit(e)
          }}
          onChange={(e: any) => {
            if (e.username.length > 0) {
              setIsPasswordActive(true)
            } else {
              setIsPasswordActive(false)
            }
          }}
        >
          <div className={input()}>
            <Label htmlFor="username">Email</Label>
            <Input name="username" placeholder="email@domain.net" />
          </div>
          {isPasswordActive && (
            <div className={input()}>
              <Label htmlFor="password">Password</Label>
              <PasswordInput name="password" placeholder="password" />
            </div>
          )}

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
            className={'p-4 ml-1'}
            message="Could not login. Please try again."
          />
        )}
      </div>
    </>
  )
}
