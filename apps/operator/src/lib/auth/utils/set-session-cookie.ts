'use server'
import { sessionCookieName } from '@repo/dally/auth'
import { cookies } from 'next/headers'

export const setSessionCookie = (session: string): void => {
  if (process.env.NODE_ENV === 'production') {
    cookies().set(`${sessionCookieName}`, session, {
      domain: '.datum.net',
      httpOnly: true,
      secure: true,
      path: '/',
    })
  } else {
    cookies().set(`${sessionCookieName}`, session)
  }
}
