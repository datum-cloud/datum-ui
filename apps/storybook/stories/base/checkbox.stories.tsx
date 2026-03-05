import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Checkbox } from '@datum-cloud/datum-ui/checkbox'
import { Label } from '@datum-cloud/datum-ui/label'

const meta: Meta<typeof Checkbox> = {
  title: 'Base/Checkbox',
  component: Checkbox,
  argTypes: {
    disabled: {
      control: { type: 'boolean' },
    },
    defaultChecked: {
      control: { type: 'boolean' },
    },
  },
  args: {
    disabled: false,
    defaultChecked: false,
  },
}

export default meta

type Story = StoryObj<typeof Checkbox>

export const Default: Story = {}

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const WithLabel: Story = {
  render: args => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" {...args} />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
}
