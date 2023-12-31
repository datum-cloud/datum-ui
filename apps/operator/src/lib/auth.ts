import type { NextAuthConfig } from 'next-auth'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export const config = {
  theme: {
    logo: '/logos/logo_orange_icon.svg',
  },
  pages: {
    signIn: '/login',
    newUser: '/signup',
  },
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Username' },
        password: { label: 'Password', type: 'password' },
      },
      authorize(credentials) {
        /**
         * Here we would call out to the Datum API
         * to validate our credentials without having
         * a direct connection to the DB.
         *
         * This runs on the server so we can store the API
         * route in an env var that way we don't expose
         * your API login routes to our end users
         *
         * For this example, we just check this email is in
         * the allowed email list and proceed
         */
        const allowedEmails = process.env.AUTH_ALLOWED_EMAILS || '[]'

        if (allowedEmails.includes(credentials.username as any)) {
          return {
            id: '999',
            name: (credentials.username as string).split('@')[0],
            email: credentials.username as string,
          }
        }

        return null
      },
    }),
  ],
  callbacks: {
    jwt: ({ token }) => {
      /**
       * Here is we persist and data we want into the JWT
       * that isn't there by default
       *
       * For this example, I just stubbed a fake JWT value
       * because we dont fetch anything from a DB
       */

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
      if (session.user) {
        session.user.name = token.name
        session.user.email = token.email
      }
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
