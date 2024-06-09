import { Panel, PanelHeader } from '@repo/ui/panel'
import { existingWorkspacesStyles } from './existing-workspaces.styles'

export const ExistingWorkspaces = () => {
  const { container } = existingWorkspacesStyles()

  return (
    <div className={container()}>
      <Panel>
        <PanelHeader heading="Existing workspaces" />
      </Panel>
    </div>
  )
}
