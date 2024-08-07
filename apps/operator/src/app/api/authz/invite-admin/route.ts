import { auth } from "@/lib/auth/auth"
import { checkTuple, FGACheckTuple, newFgaClient } from "@/lib/authz/client"
import { inviteAdminsRelation } from "@/lib/authz/utils"
import { fgaAuthorizationModelId, fgaStoreId, fgaUrl } from "@repo/dally/auth"
import { NextResponse } from "next/server"
import { checkPermissions } from "../utils"

export async function GET() {
  const fetchedData = await checkPermissions(inviteAdminsRelation)

  if (fetchedData) {
    return NextResponse.json(fetchedData, { status: 200 })
  }

  return NextResponse.json(fetchedData, { status: 500 })
}
