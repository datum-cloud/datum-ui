import type { Meta, StoryObj } from '@storybook/react-native'
import { Badge, BADGE_THEMES, BADGE_TYPES } from '@datum-cloud/datum-ui-native'

const meta = {
  title: 'Components/Badge',
  component: Badge,
  argTypes: {
    theme: { control: 'select', options: BADGE_THEMES },
    type: { control: 'select', options: BADGE_TYPES },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Badge>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {
    children: 'Badge',
    theme: 'solid',
    type: 'muted',
  },
}
