import { Panel, PanelHeader } from '@repo/ui/panel'
import { existingWorkspacesStyles } from './existing-workspaces.styles'
import { useGetAllOrganizationsQuery } from '@repo/codegen/src/schema'
import { Avatar, AvatarFallback } from '@repo/ui/avatar'
import { Button } from '@repo/ui/button'
import { Tag } from '@repo/ui/tag'
import { switchWorkspace } from '@/lib/user'

export const ExistingWorkspaces = () => {
  const { container, orgWrapper, orgInfo, orgSelect, orgTitle } =
    existingWorkspacesStyles()
  const [{ data, fetching, error }] = useGetAllOrganizationsQuery()

  if (!data || fetching || error) {
    return null
  }

  const orgs = data.organizations.edges || []

  if (orgs.length === 0) {
    return null
  }

  const handleWorkspaceSwitch = async (orgId?: string) => {
    if (orgId) {
      const workspaceSwitcher = await switchWorkspace({
        target_organization_id: orgId,
      })
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
              <div className={orgSelect()}>
                <Button
                  variant="sunglow"
                  size="md"
                  onClick={() => handleWorkspaceSwitch(org?.node?.id)}
                >
                  Select
                </Button>
              </div>
            </div>
          )
        })}
      </Panel>
    </div>
  )
}
