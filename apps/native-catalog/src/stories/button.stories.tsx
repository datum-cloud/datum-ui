import type { Meta, StoryObj } from '@storybook/react-native'
import { Button, BUTTON_SIZES, BUTTON_THEMES, BUTTON_TYPES } from '@datum-cloud/datum-ui-native'

const meta = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    theme: { control: 'select', options: BUTTON_THEMES },
    type: { control: 'select', options: BUTTON_TYPES },
    size: { control: 'select', options: BUTTON_SIZES },
    loading: { control: 'boolean' },
    block: { control: 'boolean' },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {
    children: 'Button',
    theme: 'solid',
    type: 'primary',
    size: 'default',
    loading: false,
    block: false,
  },
}
