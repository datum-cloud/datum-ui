import type { Meta, StoryObj } from '@storybook/react-native'
import { ScrollView } from 'react-native'
import { Feedback } from '../catalog/sections'

const meta = {
  title: 'Components/Feedback',
  component: Feedback,
} satisfies Meta<typeof Feedback>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ScrollView><Feedback /></ScrollView>,
}
