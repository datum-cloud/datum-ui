import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Button } from '@datum-cloud/datum-ui/button'
import { Dialog } from '@datum-cloud/datum-ui/dialog'
import { Input } from '@datum-cloud/datum-ui/input'
import { Label } from '@datum-cloud/datum-ui/label'

const meta: Meta<typeof Dialog> = {
  title: 'Base/Dialog',
  component: Dialog,
  parameters: {
    docs: {
      description: {
        component:
          'A modal overlay for confirmations, forms, and focused user interactions.\n\n'
          + 'The Dialog component renders a centered modal panel with a semi-transparent backdrop. '
          + 'It composes Radix UI\'s Dialog primitive with Datum styling — blur overlay, rounded '
          + 'content panel, and built-in close button. Use it for confirmations, short forms, or '
          + 'any interaction that requires focused attention.',
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof Dialog>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Basic dialog with a trigger button, header, body, and footer actions.',
      },
    },
  },
  render: args => (
    <Dialog {...args}>
      <Dialog.Trigger asChild>
        <Button type="primary">Open Dialog</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          title="Invite Team Member"
          description="They will receive an email invitation."
        />
        <Dialog.Footer>
          <div className="flex justify-end gap-2">
            <Button type="secondary" theme="outline">Cancel</Button>
            <Button type="primary">Send Invitation</Button>
          </div>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  ),
}

export const WithForm: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Add form fields between the header and footer for data-entry dialogs.',
      },
    },
  },
  render: () => (
    <Dialog>
      <Dialog.Trigger asChild>
        <Button type="primary">Create API Key</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          title="Create API Key"
          description="Generate a new API key."
        />
        <Dialog.Body>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="key-name">Key Name</Label>
            <Input id="key-name" placeholder="e.g. CI/CD Pipeline" />
          </div>
        </Dialog.Body>
        <Dialog.Footer>
          <div className="flex justify-end gap-2">
            <Button type="secondary" theme="outline">Cancel</Button>
            <Button type="primary">Generate Key</Button>
          </div>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  ),
}

export const DestructiveConfirmation: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Use a `danger` type button trigger and confirm action for destructive operations that cannot be undone.',
      },
    },
  },
  render: () => (
    <Dialog>
      <Dialog.Trigger asChild>
        <Button type="danger">Delete Project</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          title="Delete Project"
          description="This action cannot be undone."
        />
        <Dialog.Footer>
          <div className="flex justify-end gap-2">
            <Button type="secondary" theme="outline">Cancel</Button>
            <Button type="danger">Delete Project</Button>
          </div>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  ),
}
