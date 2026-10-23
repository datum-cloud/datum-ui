import type { Meta, StoryObj } from '@storybook/react-native'
import { ScrollView } from 'react-native'
import { CatalogSplit } from '../catalog/sections'

const meta = {
  title: 'Catalog/Overview',
  component: CatalogSplit,
} satisfies Meta<typeof CatalogSplit>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <CatalogSplit />
    </ScrollView>
  ),
}
