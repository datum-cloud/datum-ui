import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Badge } from '@datum-cloud/datum-ui/badge'

const meta: Meta<typeof Badge> = {
  title: 'Base/Badge',
  component: Badge,
  argTypes: {
    type: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'quaternary', 'info', 'warning', 'danger', 'success', 'muted'],
    },
    theme: {
      control: 'select',
      options: ['solid', 'outline', 'light'],
    },
  },
  args: {
    type: 'primary',
    theme: 'solid',
    children: 'Badge',
  },
}

export default meta

type Story = StoryObj<typeof Badge>

export const Default: Story = {}
