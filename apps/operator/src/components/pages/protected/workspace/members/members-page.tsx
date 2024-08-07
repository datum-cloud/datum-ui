'use client'

import { pageStyles } from './page.styles'
import { WorkspaceInviteForm } from '@/components/pages/protected/workspace/members/workspace-invite-form'
import { WorkspaceInvites } from '@/components/pages/protected/workspace/members/workspace-invites'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/tabs'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useGetInvitesQuery } from '@repo/codegen/src/schema'
import { MembersTable } from './members-table'
import { userCanInviteAdmins } from '@/lib/authz/utils'

const MembersPage: React.FC = () => {
  const { wrapper, inviteCount, inviteRow } = pageStyles()
  const defaultTab = 'members'
  const [activeTab, setActiveTab] = useState(defaultTab)
  const { data: session } = useSession()
  const [{ data }] = useGetInvitesQuery({
    pause: !session,
  })

  // Check if the user can invite admins or only members
  const inviteAdmins = userCanInviteAdmins()

  const numInvites = Array.isArray(data?.invites.edges)
    ? data?.invites.edges.length
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
            <WorkspaceInviteForm inviteAdmins={inviteAdmins.data?.allowed} />
            <WorkspaceInvites />
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}

export default MembersPage
