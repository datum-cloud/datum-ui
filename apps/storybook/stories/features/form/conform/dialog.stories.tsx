import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { ConformAdapter } from '@datum-cloud/datum-ui/form/adapters/conform'
import { DialogFormStory } from '../_shared'

const meta: Meta = {
  title: 'Features/Form/Conform/Dialog',
  parameters: {
    docs: {
      description: {
        component:
          '`Form.Dialog` combines `Dialog` and `Form.Root` into a single compound component. Use `showHeaderClose` to toggle the × button in the dialog header.',
      },
    },
  },
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

export const WithHeaderClose: Story = {
  name: 'showHeaderClose = true (default)',
  render: () => (
    <DialogFormStory
      showHeaderClose
      triggerLabel="Open Dialog"
      description="Invite a team member by name and email."
    />
  ),
}

export const WithoutHeaderClose: Story = {
  name: 'showHeaderClose = false',
  render: () => (
    <DialogFormStory
      showHeaderClose={false}
      triggerLabel="Open Dialog (no × button)"
      description="Dismiss only via Cancel or submit the form."
    />
  ),
}
