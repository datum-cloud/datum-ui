import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Form } from '@datum-cloud/datum-ui/form'
import { ConformAdapter } from '@datum-cloud/datum-ui/form/adapters/conform'
import { FormStep, FormStepper, StepperControls, StepperNavigation } from '@datum-cloud/datum-ui/form/stepper'
import { z } from 'zod'

const personalInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  bio: z.string().optional(),
})

const contactSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
})

const reviewSchema = z.object({
  plan: z.string().min(1, 'Please select a plan'),
  newsletter: z.string().optional(),
})

const steps = [
  {
    id: 'personal',
    label: 'Personal Info',
    description: 'Your basic details',
    schema: personalInfoSchema,
  },
  {
    id: 'contact',
    label: 'Contact',
    description: 'How to reach you',
    schema: contactSchema,
  },
  {
    id: 'review',
    label: 'Review',
    description: 'Confirm your choices',
    schema: reviewSchema,
  },
]

const meta: Meta = {
  title: 'Features/Form/Stepper',
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
    <div className="max-w-lg">
      <FormStepper
        steps={steps}
        onComplete={(data: Record<string, unknown>) => {
          alert(JSON.stringify(data, null, 2))
        }}
      >
        <StepperNavigation />

        <FormStep id="personal">
          <Form.Field name="fullName" label="Full Name" required>
            <Form.Input placeholder="Jane Smith" />
          </Form.Field>
          <Form.Field name="bio" label="Bio">
            <Form.Textarea placeholder="Tell us about yourself..." rows={3} />
          </Form.Field>
        </FormStep>

        <FormStep id="contact">
          <Form.Field name="email" label="Email" required>
            <Form.Input type="email" placeholder="you@example.com" />
          </Form.Field>
          <Form.Field name="phone" label="Phone">
            <Form.Input type="tel" placeholder="+1 (555) 123-4567" />
          </Form.Field>
        </FormStep>

        <FormStep id="review">
          <Form.Field name="plan" label="Plan" required>
            <Form.RadioGroup>
              <Form.RadioItem value="free" label="Free" />
              <Form.RadioItem value="pro" label="Pro - $10/mo" />
              <Form.RadioItem value="enterprise" label="Enterprise - Custom" />
            </Form.RadioGroup>
          </Form.Field>
          <Form.Field name="newsletter">
            <Form.Checkbox label="Subscribe to product updates" />
          </Form.Field>
        </FormStep>

        <StepperControls />
      </FormStepper>
    </div>
  ),
}
