import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Label } from '@datum-cloud/datum-ui/label'
import { Switch } from '@datum-cloud/datum-ui/switch'

const meta: Meta<typeof Switch> = {
  title: 'Base/Switch',
  component: Switch,
  argTypes: {
    disabled: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
  },
  args: {
    disabled: false,
    defaultChecked: false,
  },
}

export default meta

type Story = StoryObj<typeof Switch>

export const Default: Story = {
  render: args => (
    <div className="flex items-center gap-2">
      <Switch id="airplane-mode" {...args} />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  ),
}
