import type { TextSize, TextTone, TextWeight } from '@datum-cloud/datum-ui-native'
import type { Meta, StoryObj } from '@storybook/react-native'
import { Text } from '@datum-cloud/datum-ui-native'

const TEXT_SIZES: TextSize[] = ['5xs', '4xs', '3xs', '2xs', 'xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl']
const TEXT_WEIGHTS: TextWeight[] = ['regular', 'normal', 'medium', 'semibold']
const TEXT_TONES: TextTone[] = ['default', 'muted', 'primary', 'secondary', 'destructive', 'success', 'warning', 'info']

const meta = {
  title: 'Components/Text',
  component: Text,
  argTypes: {
    size: { control: 'select', options: TEXT_SIZES },
    weight: { control: 'select', options: TEXT_WEIGHTS },
    tone: { control: 'select', options: TEXT_TONES },
    mono: { control: 'boolean' },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Text>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {
    children: 'The quick brown fox',
    size: 'base',
    weight: 'regular',
    tone: 'default',
    mono: false,
  },
}
