import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { AvatarStack } from '@datum-cloud/datum-ui'

const meta: Meta<typeof AvatarStack> = {
  title: 'Features/AvatarStack',
  component: AvatarStack,
  argTypes: {
    orientation: {
      control: { type: 'select' },
      options: ['vertical', 'horizontal'],
    },
    spacing: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
    },
    maxAvatarsAmount: {
      control: { type: 'number' },
    },
  },
  args: {
    orientation: 'vertical',
    spacing: 'md',
    maxAvatarsAmount: 3,
  },
}

export default meta

type Story = StoryObj<typeof AvatarStack>

const threeAvatars = [
  { name: 'Alice Johnson', image: 'https://i.pravatar.cc/40?u=alice' },
  { name: 'Bob Smith', image: 'https://i.pravatar.cc/40?u=bob' },
  { name: 'Charlie Brown', image: 'https://i.pravatar.cc/40?u=charlie' },
]

const manyAvatars = [
  { name: 'Alice Johnson', image: 'https://i.pravatar.cc/40?u=alice' },
  { name: 'Bob Smith', image: 'https://i.pravatar.cc/40?u=bob' },
  { name: 'Charlie Brown', image: 'https://i.pravatar.cc/40?u=charlie' },
  { name: 'Diana Prince', image: 'https://i.pravatar.cc/40?u=diana' },
  { name: 'Eve Davis', image: 'https://i.pravatar.cc/40?u=eve' },
  { name: 'Frank Miller', image: 'https://i.pravatar.cc/40?u=frank' },
  { name: 'Grace Lee', image: 'https://i.pravatar.cc/40?u=grace' },
]

export const Default: Story = {
  args: {
    avatars: threeAvatars,
  },
}

export const ManyAvatars: Story = {
  args: {
    avatars: manyAvatars,
    maxAvatarsAmount: 3,
  },
}
