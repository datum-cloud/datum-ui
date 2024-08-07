import useSWR from "swr";

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

// userHasWorkspaceEditPermissions checks if the current user has edit permissions for the workspace
export const userHasWorkspaceEditPermissions = () => {
  const { data, isLoading, error } = useSWR(
    `/api/authz/can-edit`,
    async (url) => {
      return (
        await fetch(url, {
          method: 'GET',
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
    data: data,
    isLoading,
    error,
  }
}

// userHasWorkspaceDeletePermissions checks if the current user has delete permissions for the workspace
export const userHasWorkspaceDeletePermissions = () => {
  const { data, isLoading, error } = useSWR(
    `/api/authz/can-delete`,
    async (url) => {
      return (
        await fetch(url, {
          method: 'GET',
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
    data: data,
    isLoading,
    error,
  }
}

// useCanInviteAdmins checks if the current user has permissions to invite admins
export const userCanInviteAdmins = () => {
  const { data, isLoading, error } = useSWR(
    `/api/authz/invite-admin`,
    async (url) => {
      return (
        await fetch(url, {
          method: 'GET',
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
    data: data,
    isLoading,
    error,
  }
}