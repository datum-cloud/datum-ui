import type { Status } from '@datum-cloud/datum-ui-native'
import type { Meta, StoryObj } from '@storybook/react-native'
import { BADGE_THEMES, StatusBadge } from '@datum-cloud/datum-ui-native'

const STATUSES: Status[] = ['success', 'error', 'pending', 'unknown']

const meta = {
  title: 'Components/StatusBadge',
  component: StatusBadge,
  argTypes: {
    status: { control: 'select', options: STATUSES },
    label: { control: 'text' },
    theme: { control: 'select', options: BADGE_THEMES },
  },
} satisfies Meta<typeof StatusBadge>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {
    status: 'success',
    theme: 'light',
  },
}
