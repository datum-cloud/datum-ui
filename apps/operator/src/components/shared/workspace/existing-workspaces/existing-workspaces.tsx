import { Panel, PanelHeader } from '@repo/ui/panel'
import { existingWorkspacesStyles } from './existing-workspaces.styles'
import { useGetAllOrganizationsQuery } from '@repo/codegen/src/schema'
import { Avatar, AvatarFallback } from '@repo/ui/avatar'
import { Button } from '@repo/ui/button'
import { Tag } from '@repo/ui/tag'
import { switchWorkspace } from '@/lib/user'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export const ExistingWorkspaces = () => {
  const { data: sessionData, update: updateSession } = useSession()
  const currentOrg = sessionData?.user.organization
  const { container, orgWrapper, orgInfo, orgSelect, orgTitle } =
    existingWorkspacesStyles()
  const [{ data, fetching, error }] = useGetAllOrganizationsQuery()
  const { push } = useRouter()

  if (!data || fetching || error) {
    return null
  }

  const orgs =
    data.organizations.edges?.filter((org) => !org?.node?.personalOrg) || []

  if (orgs.length === 0) {
    return null
  }

  const handleWorkspaceSwitch = async (orgId?: string) => {
    if (orgId) {
      const response = await switchWorkspace({
        target_organization_id: orgId,
      })

      await updateSession({
        session: response.session,
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        user: {
          organization: orgId,
        },
      })

      push('/dashboard')
    }
  }

  return (
    <div className={container()}>
      <Panel>
        <PanelHeader heading="Existing workspaces" />
        {orgs.map((org) => {
          const role = org?.node?.members?.[0]?.role ?? 'Owner'

          return (
            <div key={org?.node?.id} className={`${orgWrapper()} group`}>
              <div>
                <Avatar variant="large">
                  <AvatarFallback>
                    {org?.node?.displayName.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className={orgInfo()}>
                <div className={orgTitle()}>{org?.node?.displayName}</div>
                <Tag>{role}</Tag>
              </div>
              {currentOrg !== org?.node?.id && (
                <div className={orgSelect()}>
                  <Button
                    variant="sunglow"
                    size="md"
                    onClick={() => handleWorkspaceSwitch(org?.node?.id)}
                  >
                    Select
                  </Button>
                </div>
              )}
            </div>
          )
        })}
      </Panel>
    </div>
  )
}
