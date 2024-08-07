import { Session } from "next-auth";
import { checkTuple, FGACheckTuple } from "./client";
import useSWR from "swr";

// high level relation names
export const canViewRelation = "can_view";
export const canEditRelation = "can_edit";
export const canDeleteRelation = "can_delete";

// fine grained relation names
export const inviteAdminsRelation = "can_invite_admins";
export const inviteMembersRelation = "can_invite_members";
export const auditLogViewRelation = "audit_log_viewer";

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