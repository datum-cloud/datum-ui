import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  /**
   * EXAMPLE:
   * Stub auth logic
   * Can use any node lib here, check cookies and request/response objects, etc
   * and take action before the user even loads the initial page.
   * This is a server side function using the Node.js runtime
   */

  /**
   * In this case we might check for an auth token and route them
   * into the app, or we even have the user choice their default route
   * and add that logic here.
   *
   * For this example we are going to check if the user is being redirected with
   * an auth header or not and redirecting the user to `/login` if not
   */
  const authHeaderToken = request.headers.get('Authorization')

  if (!authHeaderToken) redirect('/login')
}
