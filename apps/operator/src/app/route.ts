import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  /**
   * EXAMPLE:
   * Stub auth logic
   * Can use any node lib here, check cookie and request/response objects, etc
   * and take action before the user even loads the page.
   * This is a server side function using the Node.js runtime
   */
  const authHeaderToken = request.headers.get('Authorization')

  if (!authHeaderToken) redirect('/login')
}

export async function POST(request: Request) {
  /**
   * EXAMPLE:
   * Here we can hit this endpoint from our client-side app logic to
   * hit out API. We can use direct DB access, private env vars, and
   * more in these server side functions
   * This logic, if not secret, can just be fetched from the client-side
   */
  const payload = await request.json()
  if (request.bodyUsed && payload.email && payload?.password) {
    const fLoginResult = await fetch('<someSecretEndpoint>', {
      method: 'POST',
      body: payload,
    })

    if (fLoginResult.ok) {
      return Response.json(await fLoginResult.json(), {
        status: 200,
        headers: {
          Authorization: `Bearer ${payload.token}`,
        },
      })
    }

    if (!fLoginResult.ok) {
      return Response.json('Failed to login', { status: 401 })
    }
  }
}

export async function PUT(request: Request) {}

export async function DELETE(request: Request) {}

export async function OPTIONS(request: Request) {}
