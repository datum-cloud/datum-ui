'use server'
import { sessionCookieName } from '@repo/dally/auth'
import { cookies } from 'next/headers'

export const setSessionCookie = (session: string): void => {
  const expires = new Date()
  expires.setDate(expires.getDate() + 7)

  if (process.env.NODE_ENV === 'production') {
    cookies().set(`${sessionCookieName}`, session, {
      domain: '.datum.net',
      httpOnly: true,
      secure: true,
      path: '/',
      expires,
    })
  } else {
    cookies().set(`${sessionCookieName}`, session)
  }
}
