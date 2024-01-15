import type { NextAuthConfig } from 'next-auth'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { restUrl } from '@repo/dally/auth'


export const config = {
  theme: {
    logo: '/logos/logo_orange_icon.svg',
  },
  pages: {
    signIn: '/login',
    newUser: '/signup',
    verifyRequest: '/verify',
  },
  session: {
    strategy: 'jwt',
  },
  providers: [
    Credentials({
      credentials: {},
      async authorize(credentials: any) {
        /**
         * Here we would call out to the Datum API
         * to validate our credentials without having
         * a direct connection to the DB.
         *
         * This runs on the server so we can store the API
         * route in an env var that way we don't expose
         * your API login routes to our end users
         */
        const fData = await fetch(`${restUrl}/login`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            username: credentials.username as string,
            password: credentials.password as string,
          }),
        })

        if (fData.ok) {
          const data = await fData.json()

          // get access token and refresh tokens from headers
          const cookie = fData.headers.getSetCookie();
          const cookieSplit = cookie[0].split(", ")
          const accessToken = cookieSplit[0].split("; ")[0].split("access_token=")[1];
          const refreshToken = cookieSplit[1].split("; ")[0].split("refresh_token=")[1];

          const { username: email } = credentials

          return { name: email.split('@')[0], email, accessToken: accessToken, refreshToken: refreshToken, ...data }
        }

        if (fData.status !== 200) {
          console.log('error => ', await fData.text())
          return false
        }

        return null
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      /* 
      set tokens on user
      */
      if (typeof user !== 'undefined') {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
      }

      return token
    },
    session: ({ session, token }) => {
      /**
       * Here we can persist data into the client-side
       * session object that is used to read data
       * from the `useSession` hook in our react client
       * components
       *
       * Note our server components will also see this data
       * but do not use a client side hook to access it
       * as that data is memoized in the Node process
       */

      session.user.name = token.name
      session.user.email = token.email
      session.user.accessToken = token.accessToken
      session.user.refreshToken = token.refreshToken

      return session
    },
  },
} satisfies NextAuthConfig

/**
 * Export our route handlers and functions
 * so that we can reuse them within our app
 */
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(config)
