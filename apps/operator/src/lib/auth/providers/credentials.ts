import { restUrl } from '@repo/dally/auth'
import Credentials from 'next-auth/providers/credentials'
import { setSessionCookie } from '../utils/set-session-cookie'

// Standard username and password credentials provider
export const credentialsProvider = Credentials({
  id: 'credentials',
  name: 'credentials',
  credentials: {},
  async authorize(credentials: any) {
    let accessToken = ''
    let refreshToken = ''
    let session = ''

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
        throw new Error(await fData.text()) //TODO: Sentry logging
      }

      if (fData.ok) {
        const data = await fData.json()

        // get access token and refresh tokens from response
        accessToken = data?.access_token
        refreshToken = data?.refresh_token

        session = data?.session
      }
    } else {
      // else these came from the sign in call back and we can use them
      // to proceed
      accessToken = credentials.accessToken
      refreshToken = credentials.refreshToken
      session = credentials.session
    }

    // Set the session cookie for the user
    setSessionCookie(session)

    // Get user data for sessions
    const uData = await fetch(`${restUrl}/oauth/userinfo`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (uData.ok) {
      const data = await uData.json()

      return {
        accessToken,
        refreshToken,
        email: data?.email,
        name: `${data?.first_name as string} ${data?.last_name as string}`,
        image: data?.avatar_remote_url,
        ...data,
      }
    }

    return null
  },
})
