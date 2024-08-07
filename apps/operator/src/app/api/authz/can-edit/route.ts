import { canEditRelation } from "@/lib/authz/utils"
import { NextRequest } from "next/server"
import { checkPermissions } from "../utils"

export async function GET(request: NextRequest) {
  return checkPermissions(request, canEditRelation)
}
