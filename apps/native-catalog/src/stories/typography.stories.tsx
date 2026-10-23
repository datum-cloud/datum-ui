import type { Meta, StoryObj } from '@storybook/react-native'
import { ScrollView } from 'react-native'
import { Typography } from '../catalog/sections'

const meta = {
  title: 'Components/Typography',
  component: Typography,
} satisfies Meta<typeof Typography>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ScrollView><Typography /></ScrollView>,
}
