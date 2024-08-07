import { canEditRelation } from "@/lib/authz/utils"
import { NextResponse } from "next/server"
import { checkPermissions } from "../utils"

export async function GET() {
  const fetchedData = await checkPermissions(canEditRelation)

  if (fetchedData) {
    return NextResponse.json(fetchedData, { status: 200 })
  }

  return NextResponse.json(fetchedData, { status: 500 })
}
