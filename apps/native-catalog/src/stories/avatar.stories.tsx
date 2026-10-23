import type { AvatarSize } from '@datum-cloud/datum-ui-native'
import type { Meta, StoryObj } from '@storybook/react-native'
import { Avatar } from '@datum-cloud/datum-ui-native'

const AVATAR_SIZES: AvatarSize[] = ['sm', 'md', 'lg', 'xl']

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  argTypes: {
    name: { control: 'text' },
    size: { control: 'select', options: AVATAR_SIZES },
  },
} satisfies Meta<typeof Avatar>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {
    name: 'Ada Lovelace',
    size: 'md',
  },
}
