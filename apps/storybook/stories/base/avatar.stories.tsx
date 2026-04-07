import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Avatar, AvatarFallback, AvatarImage } from '@datum-cloud/datum-ui/avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Base/Avatar',
  component: Avatar,
  argTypes: {
    className: {
      control: 'text',
    },
  },
  args: {},
}

export default meta

type Story = StoryObj<typeof Avatar>

export const Default: Story = {
  render: args => (
    <Avatar {...args}>
      <AvatarImage src="https://i.pravatar.cc/150?u=avatar1" alt="User Avatar" />
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
  ),
}
