import type { Meta, StoryObj } from '@storybook/react-native'
import { Alert, ALERT_TYPES } from '@datum-cloud/datum-ui-native'

const meta = {
  title: 'Components/Alert',
  component: Alert,
  argTypes: {
    type: { control: 'select', options: ALERT_TYPES },
    title: { control: 'text' },
    description: { control: 'text' },
  },
} satisfies Meta<typeof Alert>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {
    type: 'info',
    title: 'Heads up',
    description: 'Something worth knowing about this resource.',
  },
}
