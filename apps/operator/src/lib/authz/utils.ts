import { datumAPIUrl } from "@repo/dally/auth";
import { Session } from "next-auth";
import useSWR from "swr";

// high level relation names
export const canViewRelation = "can_view";
export const canEditRelation = "can_edit";
export const canDeleteRelation = "can_delete";
export const accessRelation = "access";

// fine grained relation names
export const canInviteAdminsRelation = "can_invite_admins";
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

export const checkPermissions = async (session: Session | null, relation: string) => {
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

  const { data, isLoading, error } = useSWR(
    `${datumAPIUrl}/v1/check-access`,
    async (url) => {
      return (
        await fetch(
          url,
          {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload),
            credentials: 'include',
          })
      ).json()
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      refreshInterval: 0,
      revalidateIfStale: false,
    },
  )
  return {
    data,
    isLoading,
    error,
  }
}

// userHasWorkspaceEditPermissions checks if the current user has edit permissions for the workspace
export const userHasWorkspaceEditPermissions = async (session: Session | null) => {
  return checkPermissions(session, canEditRelation)
}

// userHasWorkspaceDeletePermissions checks if the current user has delete permissions for the workspace
export const userHasWorkspaceDeletePermissions = async (session: Session | null) => {
  return checkPermissions(session, canDeleteRelation)
}

// useCanInviteAdmins checks if the current user has permissions to invite admins
export const userCanInviteAdmins = async (session: Session | null) => {
  return checkPermissions(session, canInviteAdminsRelation)
}