import { auth } from "@/lib/auth/auth";
import { CheckTuple, organizationObject } from "@/lib/authz/utils";
import { NextRequest, NextResponse } from "next/server";

export async function checkPermissions(request: NextRequest, relation: string) {
  const cookies = request.headers.get('cookie')

  const session = await auth()

  // get the current user's organization and access token for authorization
  const accessToken = session?.user?.accessToken
  const currentOrgId = session?.user.organization

  const headers: HeadersInit = {
    'content-type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  }
  if (cookies) {
    headers['cookie'] = cookies
  }

  // create the payload for the check
  const payload: CheckTuple = {
    relation: relation,
    objectType: organizationObject,
    objectId: currentOrgId,
  };

  const fData = await fetch(
    `${process.env.API_REST_URL}/v1/check-access`,
    {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
      credentials: 'include',
    },
  )

  const data = await fData.json()

  if (fData.ok) {
    return NextResponse.json(data, { status: 200 })
  }

  return NextResponse.json(data, { status: fData.status })

}