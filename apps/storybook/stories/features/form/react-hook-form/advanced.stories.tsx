import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { RHFAdapter } from '@datum-cloud/datum-ui/form/adapters/rhf'
import { AdvancedFormStory } from '../_shared'

const meta: Meta = {
  title: 'Features/Form/React Hook Form/Advanced',
  decorators: [
    Story => (
      <RHFAdapter>
        <Story />
      </RHFAdapter>
    ),
  ],
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <AdvancedFormStory />,
}
