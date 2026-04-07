import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Label } from '@datum-cloud/datum-ui/label'

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
