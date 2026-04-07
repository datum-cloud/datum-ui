import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { AvatarStack } from '@datum-cloud/datum-ui/avatar-stack'

const avatars = [
  { name: 'Alice Johnson', image: 'https://i.pravatar.cc/40?u=alice' },
  { name: 'Bob Smith', image: 'https://i.pravatar.cc/40?u=bob' },
  { name: 'Charlie Brown', image: 'https://i.pravatar.cc/40?u=charlie' },
  { name: 'Diana Prince', image: 'https://i.pravatar.cc/40?u=diana' },
  { name: 'Eve Davis', image: 'https://i.pravatar.cc/40?u=eve' },
  { name: 'Frank Miller', image: 'https://i.pravatar.cc/40?u=frank' },
]

const meta: Meta<typeof AvatarStack> = {
  title: 'Features/AvatarStack',
  component: AvatarStack,
  argTypes: {
    maxAvatarsAmount: { control: { type: 'number', min: 1, max: 10 } },
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
    },
    spacing: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
  },
  args: {
    maxAvatarsAmount: 3,
    orientation: 'vertical',
    spacing: 'md',
  },
}

export default meta

type Story = StoryObj<typeof AvatarStack>

export const Default: Story = {
  args: {
    avatars,
  },
}
