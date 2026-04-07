import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Dialog } from '@datum-cloud/datum-ui/dialog'

const meta: Meta<typeof Dialog> = {
  title: 'Base/Dialog',
  component: Dialog,
}

export default meta

type Story = StoryObj<typeof Dialog>

export const Default: Story = {
  render: args => (
    <Dialog {...args}>
      <Dialog.Trigger>
        <button type="button" className="rounded-md border px-4 py-2 text-sm">
          Open Dialog
        </button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          title="Dialog Title"
          description="This is a description of the dialog purpose."
        />
        <Dialog.Body>
          <p className="text-muted-foreground text-sm">
            This is the main content of the dialog. You can place any content here.
          </p>
        </Dialog.Body>
        <Dialog.Footer>
          <div className="flex justify-end gap-2">
            <button type="button" className="rounded-md border px-4 py-2 text-sm">
              Cancel
            </button>
            <button type="button" className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm">
              Confirm
            </button>
          </div>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  ),
}
