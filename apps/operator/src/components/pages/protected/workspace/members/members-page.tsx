'use client'

import { pageStyles } from './page.styles'
import { WorkspaceInviteForm } from '@/components/pages/protected/workspace/members/workspace-invite-form'
import { WorkspaceInvites } from '@/components/pages/protected/workspace/members/workspace-invites'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/tabs'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  GetOrganizationInvitesQueryVariables,
  useGetOrganizationInvitesQuery,
} from '@repo/codegen/src/schema'
import { MembersTable } from './members-table'

const MembersPage: React.FC = () => {
  const { wrapper, inviteCount, inviteRow } = pageStyles()
  const defaultTab = 'members'
  const [activeTab, setActiveTab] = useState(defaultTab)
  const { data: session } = useSession()
  const variables: GetOrganizationInvitesQueryVariables = {
    organizationId: session?.user.organization ?? '',
  }
  const [{ data }] = useGetOrganizationInvitesQuery({
    variables,
    pause: !session,
  })

  const numInvites = Array.isArray(data?.organization?.invites)
    ? data?.organization?.invites.length
    : 0
  return (
    <>
      <Tabs
        variant="solid"
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value)
        }}
      >
        <TabsList>
          <TabsTrigger value="members">Member list</TabsTrigger>
          <TabsTrigger value="invites">
            <div className={inviteRow()}>
              <span>Invitations</span>
              {numInvites > 0 && (
                <div className={inviteCount()}>{numInvites}</div>
              )}
            </div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="members">
          <MembersTable setActiveTab={setActiveTab} />
        </TabsContent>
        <TabsContent value="invites">
          <div className={wrapper()}>
            <WorkspaceInviteForm />
            <WorkspaceInvites />
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}

export default MembersPage
