import { auth } from "@/lib/auth/auth"
import { checkTuple, FGACheckTuple, newFgaClient } from "@/lib/authz/client"
import { canDeleteRelation, canEditRelation, inviteAdminsRelation } from "@/lib/authz/utils"
import { fgaAuthorizationModelId, fgaStoreId, fgaUrl } from "@repo/dally/auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  const session = await auth()

  // get the current user's organization and user id
  const currentOrgId = session?.user.organization
  const currentUserId = session?.user.userId

  // create the payload for the check
  const payload: FGACheckTuple = {
    user: `user:${currentUserId}`,
    relation: canEditRelation,
    object: `organization:${currentOrgId}`,
  };


  const client = newFgaClient(fgaUrl, fgaStoreId, fgaAuthorizationModelId)

  const fetchedData = await checkTuple(client, payload);

  if (fetchedData && fetchedData.allowed) {
    return NextResponse.json(fetchedData, { status: 200 })
  }

  return NextResponse.json(fetchedData, { status: 500 })
}
