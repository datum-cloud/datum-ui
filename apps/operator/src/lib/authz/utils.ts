import { datumRootUrl } from "@repo/dally/auth";
import { Session } from "next-auth";

// high level relation names
export const canViewRelation = "can_view";
export const canEditRelation = "can_edit";
export const canDeleteRelation = "can_delete";
export const accessRelation = "access";

// fine grained relation names
export const inviteAdminsRelation = "can_invite_admins";
export const inviteMembersRelation = "can_invite_members";
export const auditLogViewRelation = "audit_log_viewer";

// object types 
export const organizationObject = "organization";
export const groupObject = "group";
export const featureObject = "feature";

// CheckTuple includes the payload required for the check access endpoint
// @objectId: the id of the object being checked, usually the organization id
// @objectType: the type of the object being checked, usually organization
// @relation: the relation being checked 
export type CheckTuple = {
  objectId: string,
  objectType: string
  relation: string
}

export const checkPermissions = async (session: Session, relation: string) => {
  // get the current user's organization and access token for authorization
  const accessToken = session?.user?.accessToken
  const currentOrgId = session?.user.organization

  const headers: HeadersInit = {
    'content-type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  }

  // create the payload for the check
  const payload: CheckTuple = {
    relation: relation,
    objectType: organizationObject,
    objectId: currentOrgId,
  };

  const fData = await fetch(
    `${datumRootUrl}/v1/check-access`,
    {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
      credentials: 'include',
    },
  )

  const data = await fData.json()

  if (fData.ok) {
    return data.allowed as boolean
  }

  return false
}

// userHasWorkspaceEditPermissions checks if the current user has edit permissions for the workspace
export const userHasWorkspaceEditPermissions = async (session: Session | null) => {
  if (!session) {
    return false
  }

  const data = await checkPermissions(session, canEditRelation)


  return data
}

// userHasWorkspaceDeletePermissions checks if the current user has delete permissions for the workspace
export const userHasWorkspaceDeletePermissions = async (session: Session | null) => {
  if (!session) {
    return false
  }

  const data = await checkPermissions(session, canDeleteRelation)

  return data
}

// useCanInviteAdmins checks if the current user has permissions to invite admins
export const userCanInviteAdmins = async (session: Session | null) => {
  if (!session) {
    return false
  }

  const data = await checkPermissions(session, canDeleteRelation)

  return data
}