import type { Meta, StoryObj } from '@storybook/react-native'
import { ScrollView } from 'react-native'
import { Cards } from '../catalog/sections'

const meta = {
  title: 'Components/Card',
  component: Cards,
} satisfies Meta<typeof Cards>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ScrollView><Cards /></ScrollView>,
}
