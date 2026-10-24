import type { TextTone } from '@datum-cloud/datum-ui-native'
import type { Meta, StoryObj } from '@storybook/react-native'
import { Spinner } from '@datum-cloud/datum-ui-native'

const TEXT_TONES: TextTone[] = ['default', 'muted', 'primary', 'secondary', 'destructive', 'success', 'warning', 'info']
const SPINNER_SIZES = ['small', 'large'] as const

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  argTypes: {
    tone: { control: 'select', options: TEXT_TONES },
    size: { control: 'select', options: SPINNER_SIZES },
  },
} satisfies Meta<typeof Spinner>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {
    tone: 'primary',
    size: 'small',
  },
}
