import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Button } from '@datum-cloud/datum-ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@datum-cloud/datum-ui/popover'

const meta: Meta<typeof Popover> = {
  title: 'Base/Popover',
  component: Popover,
}

export default meta

type Story = StoryObj<typeof Popover>

export const Default: Story = {
  render: args => (
    <Popover {...args}>
      <PopoverTrigger asChild>
        <Button type="secondary" theme="outline">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-medium">Settings</h4>
          <p className="text-muted-foreground text-sm">
            Configure your preferences for this workspace.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
}
