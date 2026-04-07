import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Form } from '@datum-cloud/datum-ui/form'
import { ConformAdapter } from '@datum-cloud/datum-ui/form/adapters/conform'
import { z } from 'zod'

const timezones = [
  { value: 'utc', label: 'UTC' },
  { value: 'us-eastern', label: 'US Eastern (ET)' },
  { value: 'us-central', label: 'US Central (CT)' },
  { value: 'us-pacific', label: 'US Pacific (PT)' },
  { value: 'eu-london', label: 'Europe/London (GMT)' },
  { value: 'eu-berlin', label: 'Europe/Berlin (CET)' },
  { value: 'asia-tokyo', label: 'Asia/Tokyo (JST)' },
]

const fieldsSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  country: z.string().optional(),
  timezone: z.string().optional(),
  plan: z.string().optional(),
  terms: z.string().optional(),
  notifications: z.string().optional(),
  birthDate: z.string().optional(),
  availableTime: z.string().optional(),
})

const meta: Meta = {
  title: 'Features/Form/Fields',
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
      schema={fieldsSchema}
      onSubmit={(data) => {
        alert(JSON.stringify(data, null, 2))
      }}
      className="max-w-lg space-y-4"
    >
      <Form.Field name="name" label="Text Input">
        <Form.Input placeholder="Enter text..." />
      </Form.Field>

      <Form.Field name="description" label="Textarea">
        <Form.Textarea placeholder="Enter a longer description..." rows={3} />
      </Form.Field>

      <Form.Field name="country" label="Select">
        <Form.Select placeholder="Select a country">
          <Form.SelectItem value="us">United States</Form.SelectItem>
          <Form.SelectItem value="uk">United Kingdom</Form.SelectItem>
          <Form.SelectItem value="de">Germany</Form.SelectItem>
          <Form.SelectItem value="fr">France</Form.SelectItem>
        </Form.Select>
      </Form.Field>

      <Form.Field name="timezone" label="Autocomplete (Combobox)">
        <Form.Autocomplete
          options={timezones}
          placeholder="Search timezone..."
        />
      </Form.Field>

      <Form.Field name="plan" label="Radio Group">
        <Form.RadioGroup>
          <Form.RadioItem value="free" label="Free" />
          <Form.RadioItem value="pro" label="Pro - $10/mo" />
          <Form.RadioItem value="enterprise" label="Enterprise - Custom" />
        </Form.RadioGroup>
      </Form.Field>

      <Form.Field name="terms">
        <Form.Checkbox label="I agree to the terms and conditions" />
      </Form.Field>

      <Form.Field name="notifications" label="Notifications">
        <Form.Switch label="Enable email notifications" />
      </Form.Field>

      <Form.Field name="birthDate" label="Date Picker">
        <Form.DatePicker placeholder="Select a date" />
      </Form.Field>

      <Form.Field name="availableTime" label="Time Picker">
        <Form.TimePicker />
      </Form.Field>

      <Form.Submit>Submit</Form.Submit>
    </Form.Root>
  ),
}
