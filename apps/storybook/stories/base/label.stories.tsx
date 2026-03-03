import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Input, Label } from '@datum-cloud/datum-ui'

const meta: Meta<typeof Label> = {
  title: 'Base/Label',
  component: Label,
  args: {
    children: 'Label Text',
  },
}

export default meta

type Story = StoryObj<typeof Label>

export const Default: Story = {}

export const WithInput: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  ),
}
