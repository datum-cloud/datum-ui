import { auth } from "@/lib/auth/auth";
import { checkTuple, FGACheckTuple, newFgaClient } from "@/lib/authz/client";
import { canEditRelation } from "@/lib/authz/utils";
import { fgaAuthorizationModelId, fgaStoreId, fgaUrl } from "@repo/dally/auth";

export async function checkPermissions(relation: string) {
  const session = await auth()

  // get the current user's organization and user id
  const currentOrgId = session?.user.organization
  const currentUserId = session?.user.userId

  // create the payload for the check
  const payload: FGACheckTuple = {
    user: `user:${currentUserId}`,
    relation: relation,
    object: `organization:${currentOrgId}`,
  };

  const clientConfig = {
    fgaUrl: fgaUrl,
    fgaStoreId: fgaStoreId,
    fgaAuthorizationModelId: fgaAuthorizationModelId
  }

  const client = newFgaClient(clientConfig)
  const fetchedData = await checkTuple(client, payload);

  return fetchedData;
}