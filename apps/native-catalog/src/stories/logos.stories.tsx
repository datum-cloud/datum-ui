import type { Meta, StoryObj } from '@storybook/react-native'
import { ScrollView } from 'react-native'
import { Logos } from '../catalog/sections'

const meta = {
  title: 'Components/Logo',
  component: Logos,
} satisfies Meta<typeof Logos>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ScrollView><Logos /></ScrollView>,
}
