import type { Meta, StoryObj } from '@storybook/react-native'
import { ScrollView } from 'react-native'
import { Assistant } from '../assistant'
import { Section } from '../catalog/sections'

// `Assistant` requires a `Section` prop, so the story is render-only and the
// meta stays component-less rather than forcing args for a harness.
const meta = {
  title: 'Components/Assistant',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ScrollView><Assistant Section={Section} /></ScrollView>,
}
