/**
 * check into why this default export isn't working
 * export { auth as default } from './lib/auth'
 */

import { NextResponse } from 'next/server'
import { auth } from './lib/auth'

export default auth((req) => {
  /**
   * Here we are running middleware on each matched route
   * in the config below.
   *
   * For this example we are just checking that the request
   * has a valid user attached and if so let the user
   * continue on, otherwise redirect them to the login page
   */
  if (req.auth?.user) return NextResponse.next()

  return NextResponse.redirect(new URL('/login', req.url))
})

export const config = {
  matcher: ['/', '/dashboard/:path*'],
}
