import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Button } from '@datum-cloud/datum-ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@datum-cloud/datum-ui/popover'
import { Settings } from 'lucide-react'

const meta: Meta = {
  title: 'Base/Popover',
}

export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="secondary" theme="outline" icon={<Settings size={16} />}>
          Open Popover
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-medium">Settings</h4>
          <p className="text-muted-foreground text-sm">
            Configure your preferences for this workspace.
          </p>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" defaultChecked />
              Enable notifications
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" />
              Dark mode
            </label>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
}
