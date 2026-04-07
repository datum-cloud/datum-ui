import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Form } from '@datum-cloud/datum-ui/form'
import { ConformAdapter } from '@datum-cloud/datum-ui/form/adapters/conform'
import { z } from 'zod'

const simpleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
})

const meta: Meta = {
  title: 'Features/Form',
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
  render: () => (
    <Form.Root
      schema={simpleSchema}
      onSubmit={(data) => {
        alert(JSON.stringify(data, null, 2))
      }}
      className="max-w-md space-y-4"
    >
      <Form.Field name="name" label="Name" required>
        <Form.Input placeholder="John Doe" />
      </Form.Field>
      <Form.Field name="email" label="Email" required>
        <Form.Input type="email" placeholder="john@example.com" />
      </Form.Field>
      <Form.Submit>Submit</Form.Submit>
    </Form.Root>
  ),
}
