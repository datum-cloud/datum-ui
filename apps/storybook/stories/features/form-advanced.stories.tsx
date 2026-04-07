import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Button } from '@datum-cloud/datum-ui/button'
import { Form } from '@datum-cloud/datum-ui/form'
import { ConformAdapter } from '@datum-cloud/datum-ui/form/adapters/conform'
import { PlusIcon, TrashIcon } from 'lucide-react'
import { z } from 'zod'

const advancedSchema = z.object({
  contactMethod: z.string(),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  teamName: z.string().min(1, 'Team name is required'),
  members: z.array(
    z.object({
      email: z.string(),
      role: z.string(),
    }),
  ),
})

const meta: Meta = {
  title: 'Features/Form/Advanced',
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
      schema={advancedSchema}
      defaultValues={{
        contactMethod: '',
        teamName: '',
        members: [{ email: '', role: 'viewer' }],
      }}
      onSubmit={(data) => {
        alert(JSON.stringify(data, null, 2))
      }}
      className="max-w-lg space-y-6"
    >
      {/* Conditional Fields */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Conditional Fields
        </h3>

        <Form.Field name="contactMethod" label="Preferred Contact Method" required>
          <Form.Select placeholder="Select method">
            <Form.SelectItem value="email">Email</Form.SelectItem>
            <Form.SelectItem value="phone">Phone</Form.SelectItem>
            <Form.SelectItem value="mail">Physical Mail</Form.SelectItem>
          </Form.Select>
        </Form.Field>

        <Form.When field="contactMethod" is="email">
          <Form.Field name="email" label="Email Address" required>
            <Form.Input type="email" placeholder="you@example.com" />
          </Form.Field>
        </Form.When>

        <Form.When field="contactMethod" is="phone">
          <Form.Field name="phone" label="Phone Number" required>
            <Form.Input type="tel" placeholder="+1 (555) 123-4567" />
          </Form.Field>
        </Form.When>

        <Form.When field="contactMethod" is="mail">
          <Form.Field name="address" label="Mailing Address" required>
            <Form.Textarea placeholder="Enter your full address" rows={3} />
          </Form.Field>
        </Form.When>
      </div>

      <hr />

      {/* Field Array */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Field Array
        </h3>

        <Form.Field name="teamName" label="Team Name" required>
          <Form.Input placeholder="Engineering" />
        </Form.Field>

        <Form.FieldArray name="members">
          {({ fields, append, remove }) => (
            <div className="space-y-3">
              <label className="text-sm font-medium">Team Members</label>
              {fields.map((field, index) => (
                <div key={field.key} className="flex items-start gap-2">
                  <Form.Field name={`members.${index}.email`} className="flex-1">
                    <Form.Input type="email" placeholder="member@example.com" />
                  </Form.Field>
                  <Form.Field name={`members.${index}.role`} className="w-32">
                    <Form.Select>
                      <Form.SelectItem value="admin">Admin</Form.SelectItem>
                      <Form.SelectItem value="editor">Editor</Form.SelectItem>
                      <Form.SelectItem value="viewer">Viewer</Form.SelectItem>
                    </Form.Select>
                  </Form.Field>
                  {fields.length > 1 && (
                    <Button
                      type="danger"
                      theme="outline"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <TrashIcon size={14} />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="secondary"
                theme="outline"
                size="small"
                onClick={() => append({ email: '', role: 'viewer' })}
                icon={<PlusIcon size={14} />}
              >
                Add Member
              </Button>
            </div>
          )}
        </Form.FieldArray>
      </div>

      <Form.Submit>Save</Form.Submit>
    </Form.Root>
  ),
}
