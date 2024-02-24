import type { NextAuthConfig } from 'next-auth'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
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
    GithubProvider({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      credentials: {},
      async authorize(credentials: any) {
        let accessToken = ""
        let refreshToken = ""

        // If the request did not come through with the access tokens, take the 
        // credentials and use them to get the access token and refresh token
        if (!credentials.accessToken) {
          /**
           * Here we would call out to the Datum API
           * to validate our credentials
           *
           * This runs on the server so we can store the API
           * route in an env var that way we don't expose
           * your API login routes to our end users
           */
          const fData = await fetch(`${restUrl}/v1/login`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              username: credentials.username as string,
              password: credentials.password as string,
            }),
          })

          if (fData.status !== 200) {
            console.log('error => ', await fData.text())

            return false
          }

          if (fData.ok) {
            const data = await fData.json()

            // get access token and refresh tokens from response
            accessToken = data?.access_token
            refreshToken = data?.refresh_token
          }

        } else {
          // else these came from the sign in call back and we can use them
          // to proceed
          accessToken = credentials.accessToken
          refreshToken = credentials.refreshToken
        }

        // Get user data for sessions
        const uData = await fetch(`${restUrl}/oauth/userinfo`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${accessToken}` },
        })

        if (uData.ok) {
          const data = await uData.json()

          return {
            accessToken,
            refreshToken,
            email: data?.email,
            name: `${data?.first_name} ${data?.last_name}`,
            image: data?.avatar_remote_url,
            ...data,
          }
        }

        return null
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // register user that signed in via oauth provider
      if (account?.provider !== "credentials") {
        const oauthUser = {
          externalUserID: account?.providerAccountId,
          name: user.name,
          email: user.email,
          image: user.image,
          authProvider: account?.provider,
          accessToken: account?.access_token,
        };

        const data = await getTokenFromDatumAPI(oauthUser);

        // set access token to pull additional data from the API
        user.accessToken = data?.access_token;
        user.refreshToken = data?.refresh_token;

        // Get user data for sessions
        const uData = await fetch(`${restUrl}/oauth/userinfo`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${user.accessToken}` },
        })

        if (uData.ok) {
          const userJson = await uData.json()

          user.email = userJson?.email
          user.name = `${userJson?.first_name} ${userJson?.last_name}`
          user.image = userJson?.avatar_remote_url
        }
      }

      return true
    },
    jwt({ token, user, account, profile }) {
      /* 
      set tokens on user
      */
      if (typeof user !== 'undefined') {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
      } else if (account) {
        token.accessToken = account.accessToken
        token.refreshToken = account.refreshToken
      }

      if (typeof profile !== 'undefined') {
        token.name = profile.name
        token.email = profile.email
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
      if (session.user) {
        session.user.name = token.name
        session.user.email = token.email
        session.user.accessToken = token.accessToken
        session.user.refreshToken = token.refreshToken
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

// getTokenFromDatumAPI is a function that takes an oauth user and registers them
// with the datum API to get an access token and refresh token
const getTokenFromDatumAPI = async (reqBody: any) => {
  try {
    const response = await fetch(`${restUrl}/oauth/register`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        externalUserId: reqBody.externalUserID.toString() as string,
        email: reqBody.email as string,
        name: reqBody.name as string,
        image: reqBody.image as string,
        authProvider: reqBody.authProvider as string,
        clientToken: reqBody.accessToken as string,
      })
    }).then((res) => res.json()).then((data) => data);

    return response
  } catch (error) {
    console.log(error);
  }
}
