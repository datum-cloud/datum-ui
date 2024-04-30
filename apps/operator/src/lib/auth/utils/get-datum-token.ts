import { restUrl } from '@repo/dally/auth'

// getTokenFromDatumAPI is a function that takes an oauth user and registers them
// with the datum API to get an access token and refresh token
export const getTokenFromDatumAPI = async (reqBody: any) => {
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
      }),
    })
      .then((res) => res.json())
      .then((data) => data)

    return response
  } catch (error) {
    throw new Error() //TODO: Sentry logging
  }
}
