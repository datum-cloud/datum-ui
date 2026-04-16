import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Button } from '@datum-cloud/datum-ui/button'
import { Form } from '@datum-cloud/datum-ui/form'
import { ConformAdapter } from '@datum-cloud/datum-ui/form/adapters/conform'
import { z } from 'zod'

const dialogSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
})

const meta: Meta = {
  title: 'Features/Form/Dialog',
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
    <Form.Dialog
      title="Add Member"
      description="Invite a team member by name and email."
      schema={dialogSchema}
      trigger={<Button type="primary">Open Dialog</Button>}
      onSubmit={async (data) => {
        await new Promise(r => setTimeout(r, 800))
        alert(JSON.stringify(data, null, 2))
      }}
      showHeaderClose
    >
      <div className="space-y-4 px-6 py-4">
        <Form.Field name="name" label="Name" required>
          <Form.Input placeholder="Jane Doe" />
        </Form.Field>
        <Form.Field name="email" label="Email" required>
          <Form.Input type="email" placeholder="jane@example.com" />
        </Form.Field>
      </div>
    </Form.Dialog>
  ),
}

export const WithoutHeaderClose: Story = {
  name: 'showHeaderClose = false',
  render: () => (
    <Form.Dialog
      title="Add Member"
      description="Dismiss only via Cancel or submit the form."
      schema={dialogSchema}
      trigger={<Button type="secondary" theme="outline">Open Dialog (no × button)</Button>}
      onSubmit={async (data) => {
        await new Promise(r => setTimeout(r, 800))
        alert(JSON.stringify(data, null, 2))
      }}
      showHeaderClose={false}
    >
      <div className="space-y-4 px-6 py-4">
        <Form.Field name="name" label="Name" required>
          <Form.Input placeholder="Jane Doe" />
        </Form.Field>
        <Form.Field name="email" label="Email" required>
          <Form.Input type="email" placeholder="jane@example.com" />
        </Form.Field>
      </div>
    </Form.Dialog>
  ),
}
