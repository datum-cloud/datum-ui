import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Button, startProgress, stopProgress } from '@datum-cloud/datum-ui'

const meta: Meta = {
  title: 'Features/NProgress',
}

export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground text-sm">
        Click &quot;Start&quot; to show the progress bar at the top of the page.
        Click &quot;Stop&quot; to dismiss it.
      </p>
      <div className="flex gap-3">
        <Button type="primary" onClick={() => startProgress()}>
          Start Progress
        </Button>
        <Button type="secondary" theme="outline" onClick={() => stopProgress()}>
          Stop Progress
        </Button>
      </div>
    </div>
  ),
}
