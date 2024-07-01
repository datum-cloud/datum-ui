'use client'

import {
  GetOrganizationInvitesQueryVariables,
  useGetOrganizationInvitesQuery,
  InviteInviteStatus,
  InviteRole,
} from '@repo/codegen/src/schema'
import { DataTable } from '@repo/ui/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { useSession } from 'next-auth/react'
import { Tag } from '@repo/ui/tag'
import { format } from 'date-fns'

type Invite = {
  __typename?: 'Invite' | undefined
  id: string
  recipient: string
  status: InviteInviteStatus
  createdAt?: any
  role: InviteRole
}

const WorkspaceInvites = () => {
  const { data: session } = useSession()
  const variables: GetOrganizationInvitesQueryVariables = {
    organizationId: session?.user.organization ?? '',
  }
  const [{ data, fetching, error }] = useGetOrganizationInvitesQuery({
    variables,
  })

  if (fetching) return <p>Loading...</p>
  if (error) return null

  const invites: Invite[] = data?.organization?.invites ?? []
  const columns: ColumnDef<Invite>[] = [
    {
      accessorKey: 'recipient',
      header: 'Invited user',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ cell }) => {
        const status = cell.getValue() as InviteInviteStatus
        let statusLabel
        switch (status) {
          case InviteInviteStatus.APPROVAL_REQUIRED:
            statusLabel = 'Approval required'
            break
          case InviteInviteStatus.INVITATION_ACCEPTED:
            statusLabel = 'Accepted'
            break
          case InviteInviteStatus.INVITATION_EXPIRED:
            statusLabel = 'Expired'
            break
          case InviteInviteStatus.INVITATION_SENT:
            statusLabel = 'Outstanding'
            break
        }
        return (
          <Tag>
            <>{statusLabel}</>
          </Tag>
        )
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Sent',
      cell: ({ cell }) =>
        format(new Date(cell.getValue() as string), 'd MMM yyyy'),
    },
    {
      accessorKey: 'role',
      header: 'Role',
    },
  ]

  return <DataTable columns={columns} data={invites} />
}

export { WorkspaceInvites }
