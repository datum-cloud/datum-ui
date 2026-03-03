import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Button, Dialog, Input, Label } from '@datum-cloud/datum-ui'

const meta: Meta<typeof Dialog> = {
  title: 'Base/Dialog',
  component: Dialog,
}

export default meta
type Story = StoryObj<typeof Dialog>

export const Default: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger>
        <Button type="primary" theme="solid" size="default">
          Open Dialog
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          title="Dialog Title"
          description="This is a description of the dialog purpose."
        />
        <Dialog.Body>
          <div className="px-5">
            <p className="text-sm text-muted-foreground">
              This is the body content of the dialog. You can place any content
              here, including forms, informational text, or interactive elements.
            </p>
          </div>
        </Dialog.Body>
        <Dialog.Footer>
          <Button type="secondary" theme="outline" size="default">
            Cancel
          </Button>
          <Button type="primary" theme="solid" size="default">
            Confirm
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  ),
}

export const WithForm: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger>
        <Button type="primary" theme="solid" size="default">
          Edit Profile
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          title="Edit Profile"
          description="Update your profile information below."
        />
        <Dialog.Body>
          <div className="flex flex-col gap-4 px-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Enter your name" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" />
            </div>
          </div>
        </Dialog.Body>
        <Dialog.Footer>
          <Button type="secondary" theme="outline" size="default">
            Cancel
          </Button>
          <Button type="primary" theme="solid" size="default">
            Save
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  ),
}

export const Destructive: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger>
        <Button type="danger" theme="solid" size="default">
          Delete Account
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          title="Delete Account"
          description="This action cannot be undone."
        />
        <Dialog.Body>
          <div className="px-5">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete your account? All of your data
              will be permanently removed. This action cannot be undone.
            </p>
          </div>
        </Dialog.Body>
        <Dialog.Footer>
          <Button type="secondary" theme="outline" size="default">
            Cancel
          </Button>
          <Button type="danger" theme="solid" size="default">
            Delete
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  ),
}
