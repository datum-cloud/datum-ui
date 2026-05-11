import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { RHFAdapter } from '@datum-cloud/datum-ui/form/adapters/rhf'
import { FieldsFormStory } from '../_shared'

const meta: Meta = {
  title: 'Features/Form/React Hook Form/Fields',
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
  render: () => <FieldsFormStory />,
}
