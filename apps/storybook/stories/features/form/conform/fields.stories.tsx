import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { ConformAdapter } from '@datum-cloud/datum-ui/form/adapters/conform'
import { FieldsFormStory } from '../_shared'

const meta: Meta = {
  title: 'Features/Form/Conform/Fields',
  decorators: [
    Story => (
      <ConformAdapter>
        <Story />
      </ConformAdapter>
    ),
  ],
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <FieldsFormStory />,
}
