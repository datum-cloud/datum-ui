import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Button } from '@datum-cloud/datum-ui/button'
import { Form } from '@datum-cloud/datum-ui/form'
import { RHFAdapter } from '@datum-cloud/datum-ui/form/adapters/rhf'
import { FormStep, FormStepper, StepperControls, StepperNavigation } from '@datum-cloud/datum-ui/form/stepper'
import { PlusIcon, TrashIcon } from 'lucide-react'
import { z } from 'zod'

/**
 * These stories demonstrate the same Form components using the React Hook Form adapter.
 * The form API is identical to the Conform adapter stories -- only the root provider differs.
 *
 * Compare with `Features/Form` to see the same forms running on a different backend.
 */
const meta: Meta = {
  title: 'Features/Form (React Hook Form)',
  decorators: [
    Story => (
      <RHFAdapter>
        <Story />
      </RHFAdapter>
    ),
  ],
}

export default meta

type Story = StoryObj

// ---------------------------------------------------------------------------
// SimpleForm
// ---------------------------------------------------------------------------

const simpleSchema = z.object({
  name: z.string(),
  email: z.string(),
})

export const SimpleForm: Story = {
  render: () => (
    <Form.Root
      schema={simpleSchema}
      onSubmit={(data) => {
        alert(JSON.stringify(data, null, 2))
      }}
      className="max-w-md space-y-4"
    >
      <Form.Field name="name" label="Name">
        <Form.Input placeholder="John Doe" />
      </Form.Field>
      <Form.Field name="email" label="Email">
        <Form.Input type="email" placeholder="john@example.com" />
      </Form.Field>
      <Form.Submit>Submit</Form.Submit>
    </Form.Root>
  ),
}

// ---------------------------------------------------------------------------
// WithValidation
// ---------------------------------------------------------------------------

const validationSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  age: z.string().min(1, 'Age is required'),
})

export const WithValidation: Story = {
  render: () => (
    <Form.Root
      schema={validationSchema}
      onSubmit={(data) => {
        alert(JSON.stringify(data, null, 2))
      }}
      className="max-w-md space-y-4"
    >
      <Form.Field name="username" label="Username" required>
        <Form.Input placeholder="Enter username (min 3 chars)" />
      </Form.Field>
      <Form.Field name="email" label="Email" required>
        <Form.Input type="email" placeholder="user@example.com" />
      </Form.Field>
      <Form.Field name="age" label="Age" required>
        <Form.Input type="number" placeholder="Enter your age" />
      </Form.Field>
      <Form.Submit>Register</Form.Submit>
    </Form.Root>
  ),
}

// ---------------------------------------------------------------------------
// WithCheckboxAndSwitch (boolean fields - no string conversion with RHF)
// ---------------------------------------------------------------------------

const checkboxSwitchSchema = z.object({
  terms: z.boolean().optional(),
  newsletter: z.boolean().optional(),
  notifications: z.boolean().optional(),
  darkMode: z.boolean().optional(),
})

export const WithCheckboxAndSwitch: Story = {
  render: () => (
    <Form.Root
      schema={checkboxSwitchSchema}
      onSubmit={(data) => {
        alert(JSON.stringify(data, null, 2))
      }}
      className="max-w-md space-y-4"
    >
      <Form.Field name="terms">
        <Form.Checkbox label="I agree to the terms and conditions" />
      </Form.Field>
      <Form.Field name="newsletter">
        <Form.Checkbox label="Subscribe to our newsletter" />
      </Form.Field>
      <Form.Field name="notifications" label="Notifications">
        <Form.Switch label="Enable email notifications" />
      </Form.Field>
      <Form.Field name="darkMode" label="Appearance">
        <Form.Switch label="Enable dark mode" />
      </Form.Field>
      <Form.Submit>Save Preferences</Form.Submit>
    </Form.Root>
  ),
}

// ---------------------------------------------------------------------------
// ConditionalFields (Form.When)
// ---------------------------------------------------------------------------

const conditionalSchema = z.object({
  contactMethod: z.string(),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
})

export const ConditionalFields: Story = {
  render: () => (
    <Form.Root
      schema={conditionalSchema}
      onSubmit={(data) => {
        alert(JSON.stringify(data, null, 2))
      }}
      className="max-w-md space-y-4"
    >
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

      <Form.Submit>Save Contact Info</Form.Submit>
    </Form.Root>
  ),
}

// ---------------------------------------------------------------------------
// WithRenderFunction
// ---------------------------------------------------------------------------

const renderFunctionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
})

export const WithRenderFunction: Story = {
  render: () => (
    <Form.Root
      schema={renderFunctionSchema}
      defaultValues={{ name: 'John Doe', email: 'john@example.com' }}
      onSubmit={(data) => {
        alert(JSON.stringify(data, null, 2))
      }}
      className="max-w-md space-y-4"
    >
      {({ reset, isSubmitting }) => (
        <>
          <Form.Field name="name" label="Name" required>
            <Form.Input />
          </Form.Field>
          <Form.Field name="email" label="Email" required>
            <Form.Input type="email" />
          </Form.Field>
          <div className="flex gap-2">
            <Button
              type="quaternary"
              theme="outline"
              onClick={() => reset()}
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Form.Submit>Save Changes</Form.Submit>
          </div>
        </>
      )}
    </Form.Root>
  ),
}

// ---------------------------------------------------------------------------
// FieldArray
// ---------------------------------------------------------------------------

const fieldArraySchema = z.object({
  teamName: z.string().min(1, 'Team name is required'),
  members: z.array(
    z.object({
      email: z.string(),
      role: z.string(),
    }),
  ),
})

export const FieldArray: Story = {
  render: () => (
    <Form.Root
      schema={fieldArraySchema}
      defaultValues={{
        teamName: '',
        members: [{ email: '', role: 'viewer' }],
      }}
      onSubmit={(data) => {
        alert(JSON.stringify(data, null, 2))
      }}
      className="max-w-lg space-y-4"
    >
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

      <Form.Submit>Create Team</Form.Submit>
    </Form.Root>
  ),
}

// ---------------------------------------------------------------------------
// WithFormState (live form state panel)
// ---------------------------------------------------------------------------

const formStateSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Enter a valid email'),
  agree: z.boolean().optional(),
})

export const WithFormState: Story = {
  render: () => (
    <Form.Root
      schema={formStateSchema}
      onSubmit={(data) => {
        alert(JSON.stringify(data, null, 2))
      }}
      className="max-w-lg space-y-4"
    >
      {({ isDirty, isValid, isSubmitted, submitCount, dirtyFields, touchedFields }) => (
        <>
          <Form.Field name="username" label="Username" required>
            <Form.Input placeholder="Enter username (min 3 chars)" />
          </Form.Field>
          <Form.Field name="email" label="Email" required>
            <Form.Input type="email" placeholder="user@example.com" />
          </Form.Field>
          <Form.Field name="agree">
            <Form.Checkbox label="I agree to terms" />
          </Form.Field>

          <div className="rounded-md border p-4 space-y-2 bg-muted/30">
            <h4 className="text-sm font-semibold">Live Form State</h4>
            <pre className="text-xs font-mono">
              {JSON.stringify({
                isDirty,
                isValid,
                isSubmitted,
                submitCount,
                dirtyFields,
                touchedFields,
              }, null, 2)}
            </pre>
          </div>

          <Form.Submit disabled={!isDirty || !isValid}>Save</Form.Submit>
        </>
      )}
    </Form.Root>
  ),
}

// ---------------------------------------------------------------------------
// MultiStepForm (Form.Stepper)
// ---------------------------------------------------------------------------

const accountSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const profileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  bio: z.string().optional(),
})

const preferencesSchema = z.object({
  plan: z.string().min(1, 'Please select a plan'),
  newsletter: z.boolean().optional(),
})

const stepperSteps = [
  {
    id: 'account',
    label: 'Account',
    description: 'Set up credentials',
    schema: accountSchema,
  },
  {
    id: 'profile',
    label: 'Profile',
    description: 'Personal details',
    schema: profileSchema,
  },
  {
    id: 'preferences',
    label: 'Preferences',
    description: 'Choose your plan',
    schema: preferencesSchema,
  },
]

export const MultiStepForm: Story = {
  render: () => (
    <div className="max-w-lg">
      <FormStepper
        steps={stepperSteps}
        onComplete={(data: Record<string, unknown>) => {
          alert(JSON.stringify(data, null, 2))
        }}
      >
        <StepperNavigation />

        <FormStep id="account">
          <Form.Field name="email" label="Email" required>
            <Form.Input type="email" placeholder="you@example.com" />
          </Form.Field>
          <Form.Field name="password" label="Password" required>
            <Form.Input type="password" placeholder="Min 8 characters" />
          </Form.Field>
        </FormStep>

        <FormStep id="profile">
          <Form.Field name="fullName" label="Full Name" required>
            <Form.Input placeholder="Jane Smith" />
          </Form.Field>
          <Form.Field name="bio" label="Bio">
            <Form.Textarea placeholder="Tell us about yourself..." rows={3} />
          </Form.Field>
        </FormStep>

        <FormStep id="preferences">
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

// ---------------------------------------------------------------------------
// WithDateTimePickers
// ---------------------------------------------------------------------------

const datePickerSchema = z.object({
  birthDate: z.string().optional(),
  availableTime: z.string().optional(),
  appointmentTime: z.string().optional(),
})

export const WithDateTimePickers: Story = {
  render: () => (
    <Form.Root
      schema={datePickerSchema}
      onSubmit={(data) => {
        alert(JSON.stringify(data, null, 2))
      }}
      className="max-w-md space-y-4"
    >
      <Form.Field name="birthDate" label="Birth Date">
        <Form.DatePicker placeholder="Select your birth date" />
      </Form.Field>

      <Form.Field name="availableTime" label="Available Time">
        <Form.TimePicker />
      </Form.Field>

      <Form.Field name="appointmentTime" label="Appointment Time">
        <Form.DateTimePicker showTimezoneIndicator />
      </Form.Field>

      <Form.Submit>Submit</Form.Submit>
    </Form.Root>
  ),
}

// ---------------------------------------------------------------------------
// WithTransfer
// ---------------------------------------------------------------------------

interface User {
  id: string
  name: string
  role: string
}

const users: User[] = [
  { id: '1', name: 'Alice Johnson', role: 'Admin' },
  { id: '2', name: 'Bob Smith', role: 'User' },
  { id: '3', name: 'Charlie Brown', role: 'Admin' },
  { id: '4', name: 'David Lee', role: 'User' },
  { id: '5', name: 'Emma Davis', role: 'User' },
]

const transferSchema = z.object({
  assignedUsers: z.array(z.string()).optional(),
})

export const WithTransfer: Story = {
  render: () => (
    <Form.Root
      schema={transferSchema}
      onSubmit={(data) => {
        alert(JSON.stringify(data, null, 2))
      }}
      className="max-w-4xl space-y-4"
    >
      <Form.Field name="assignedUsers" label="Assigned Users">
        <Form.Transfer items={users} itemKey="id" itemLabel="name" itemGroup="role" />
      </Form.Field>

      <Form.Submit>Save Selection</Form.Submit>
    </Form.Root>
  ),
}
