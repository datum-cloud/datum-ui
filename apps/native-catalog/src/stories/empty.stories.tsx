import type { Meta, StoryObj } from '@storybook/react-native'
import { ScrollView } from 'react-native'
import { Empty } from '../catalog/sections'

const meta = {
  title: 'Components/EmptyContent',
  component: Empty,
} satisfies Meta<typeof Empty>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ScrollView><Empty /></ScrollView>,
}
