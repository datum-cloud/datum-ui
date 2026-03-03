import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Button, Form } from '@datum-cloud/datum-ui'
import { PlusIcon, TrashIcon } from 'lucide-react'
import { useState } from 'react'
import { z } from 'zod'

const meta: Meta = {
  title: 'Features/Form',
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
// WithSelect
// ---------------------------------------------------------------------------

const selectSchema = z.object({
  country: z.string(),
  role: z.string(),
})

export const WithSelect: Story = {
  render: () => (
    <Form.Root
      schema={selectSchema}
      onSubmit={(data) => {
        alert(JSON.stringify(data, null, 2))
      }}
      className="max-w-md space-y-4"
    >
      <Form.Field name="country" label="Country" required>
        <Form.Select placeholder="Select a country">
          <Form.SelectItem value="us">United States</Form.SelectItem>
          <Form.SelectItem value="uk">United Kingdom</Form.SelectItem>
          <Form.SelectItem value="ca">Canada</Form.SelectItem>
          <Form.SelectItem value="de">Germany</Form.SelectItem>
          <Form.SelectItem value="fr">France</Form.SelectItem>
        </Form.Select>
      </Form.Field>
      <Form.Field name="role" label="Role">
        <Form.Select placeholder="Select a role">
          <Form.SelectItem value="admin">Admin</Form.SelectItem>
          <Form.SelectItem value="editor">Editor</Form.SelectItem>
          <Form.SelectItem value="viewer">Viewer</Form.SelectItem>
        </Form.Select>
      </Form.Field>
      <Form.Submit>Save</Form.Submit>
    </Form.Root>
  ),
}

// ---------------------------------------------------------------------------
// WithCheckboxAndSwitch
// ---------------------------------------------------------------------------

const checkboxSwitchSchema = z.object({
  terms: z.string().optional(),
  newsletter: z.string().optional(),
  notifications: z.string().optional(),
  darkMode: z.string().optional(),
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
// WithTextarea
// ---------------------------------------------------------------------------

const textareaSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
})

export const WithTextarea: Story = {
  render: () => (
    <Form.Root
      schema={textareaSchema}
      onSubmit={(data) => {
        alert(JSON.stringify(data, null, 2))
      }}
      className="max-w-md space-y-4"
    >
      <Form.Field name="name" label="Project Name" required>
        <Form.Input placeholder="My Project" />
      </Form.Field>
      <Form.Field
        name="description"
        label="Description"
        required
        description="Provide a brief summary of your project."
      >
        <Form.Textarea placeholder="Describe your project..." rows={4} />
      </Form.Field>
      <Form.Submit>Create Project</Form.Submit>
    </Form.Root>
  ),
}

// ---------------------------------------------------------------------------
// WithRadioGroup
// ---------------------------------------------------------------------------

const radioSchema = z.object({
  plan: z.string().min(1, 'Please select a plan'),
  billingCycle: z.string().optional(),
})

export const WithRadioGroup: Story = {
  render: () => (
    <Form.Root
      schema={radioSchema}
      onSubmit={(data) => {
        alert(JSON.stringify(data, null, 2))
      }}
      className="max-w-md space-y-4"
    >
      <Form.Field name="plan" label="Plan" required>
        <Form.RadioGroup>
          <Form.RadioItem value="free" label="Free" />
          <Form.RadioItem value="pro" label="Pro - $10/mo" />
          <Form.RadioItem value="enterprise" label="Enterprise - $50/mo" />
        </Form.RadioGroup>
      </Form.Field>
      <Form.Field name="billingCycle" label="Billing Cycle">
        <Form.RadioGroup>
          <Form.RadioItem value="monthly" label="Monthly" />
          <Form.RadioItem value="annual" label="Annual (save 20%)" />
        </Form.RadioGroup>
      </Form.Field>
      <Form.Submit>Subscribe</Form.Submit>
    </Form.Root>
  ),
}

// ---------------------------------------------------------------------------
// WithAutocomplete
// ---------------------------------------------------------------------------

const timezones = [
  { value: 'utc', label: 'UTC' },
  { value: 'us-eastern', label: 'US Eastern (ET)' },
  { value: 'us-central', label: 'US Central (CT)' },
  { value: 'us-pacific', label: 'US Pacific (PT)' },
  { value: 'eu-london', label: 'Europe/London (GMT)' },
  { value: 'eu-berlin', label: 'Europe/Berlin (CET)' },
  { value: 'asia-tokyo', label: 'Asia/Tokyo (JST)' },
  { value: 'asia-jakarta', label: 'Asia/Jakarta (WIB)' },
  { value: 'au-sydney', label: 'Australia/Sydney (AEST)' },
]

const autocompleteSchema = z.object({
  timezone: z.string().min(1, 'Please select a timezone'),
  language: z.string().optional(),
})

export const WithAutocomplete: Story = {
  render: () => (
    <Form.Root
      schema={autocompleteSchema}
      onSubmit={(data) => {
        alert(JSON.stringify(data, null, 2))
      }}
      className="max-w-md space-y-4"
    >
      <Form.Field name="timezone" label="Timezone" required>
        <Form.Autocomplete
          options={timezones}
          placeholder="Search timezone..."
        />
      </Form.Field>
      <Form.Field name="language" label="Language">
        <Form.Autocomplete
          options={[
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Spanish' },
            { value: 'fr', label: 'French' },
            { value: 'de', label: 'German' },
            { value: 'ja', label: 'Japanese' },
            { value: 'id', label: 'Indonesian' },
          ]}
          placeholder="Search language..."
        />
      </Form.Field>
      <Form.Submit>Save Settings</Form.Submit>
    </Form.Root>
  ),
}

// ---------------------------------------------------------------------------
// WithCopyBox
// ---------------------------------------------------------------------------

const copyBoxSchema = z.object({
  name: z.string(),
  apiKey: z.string(),
})

export const WithCopyBox: Story = {
  render: () => (
    <Form.Root
      schema={copyBoxSchema}
      defaultValues={{ name: 'my-project', apiKey: 'sk-proj-abc123def456ghi789' }}
      onSubmit={(data) => {
        alert(JSON.stringify(data, null, 2))
      }}
      className="max-w-md space-y-4"
    >
      <Form.Field name="name" label="Project Name">
        <Form.Input placeholder="my-project" />
      </Form.Field>
      <Form.Field
        name="apiKey"
        label="API Key"
        description="Use this key to authenticate API requests."
      >
        <Form.CopyBox />
      </Form.Field>
      <Form.Submit>Save</Form.Submit>
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
// WithRenderFunction (access form state)
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
      {({ form, isSubmitting }) => (
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
              onClick={() => {
                form.update({
                  value: { name: 'John Doe', email: 'john@example.com' },
                })
              }}
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
// FieldArray (dynamic fields)
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
// FormDialog
// ---------------------------------------------------------------------------

const dialogSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  region: z.string().optional(),
})

function FormDialogDemo() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Create Resource</Button>
      <Form.Dialog
        open={open}
        onOpenChange={setOpen}
        title="Create a Resource"
        description="Add a resource to manage your services."
        schema={dialogSchema}
        onSubmit={(data) => {
          alert(JSON.stringify(data, null, 2))
          setOpen(false)
        }}
        submitText="Confirm"
        submitTextLoading="Creating..."
      >
        <div className="divide-border space-y-0 divide-y [&>*]:px-5 [&>*]:py-5 [&>*:first-child]:pt-0 [&>*:last-child]:pb-0">
          <Form.Field
            name="name"
            label="Resource Name"
            description="A human-friendly name for your resource. Can be changed later."
            required
          >
            <Form.Input placeholder="e.g. My Resource" autoFocus />
          </Form.Field>
          <Form.Field name="description" label="Description">
            <Form.Textarea placeholder="Optional description..." rows={3} />
          </Form.Field>
          <Form.Field name="region" label="Region">
            <Form.Select placeholder="Select a region">
              <Form.SelectItem value="us-east-1">US East</Form.SelectItem>
              <Form.SelectItem value="us-west-2">US West</Form.SelectItem>
              <Form.SelectItem value="eu-west-1">EU West</Form.SelectItem>
              <Form.SelectItem value="ap-southeast-1">AP Southeast</Form.SelectItem>
            </Form.Select>
          </Form.Field>
        </div>
      </Form.Dialog>
    </>
  )
}

export const DialogForm: Story = {
  render: () => <FormDialogDemo />,
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
  newsletter: z.string().optional(),
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
      <Form.Stepper
        steps={stepperSteps}
        onComplete={(data) => {
          alert(JSON.stringify(data, null, 2))
        }}
      >
        <Form.StepperNavigation />

        <Form.Step id="account">
          <Form.Field name="email" label="Email" required>
            <Form.Input type="email" placeholder="you@example.com" />
          </Form.Field>
          <Form.Field name="password" label="Password" required>
            <Form.Input type="password" placeholder="Min 8 characters" />
          </Form.Field>
        </Form.Step>

        <Form.Step id="profile">
          <Form.Field name="fullName" label="Full Name" required>
            <Form.Input placeholder="Jane Smith" />
          </Form.Field>
          <Form.Field name="bio" label="Bio">
            <Form.Textarea placeholder="Tell us about yourself..." rows={3} />
          </Form.Field>
        </Form.Step>

        <Form.Step id="preferences">
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
        </Form.Step>

        <Form.StepperControls />
      </Form.Stepper>
    </div>
  ),
}

// ---------------------------------------------------------------------------
// KitchenSink (all field types in one form)
// ---------------------------------------------------------------------------

const kitchenSinkSchema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  description: z.string().optional(),
  country: z.string(),
  timezone: z.string().optional(),
  role: z.string().optional(),
  terms: z.string().optional(),
  notifications: z.string().optional(),
})

export const KitchenSink: Story = {
  render: () => (
    <Form.Root
      schema={kitchenSinkSchema}
      onSubmit={(data) => {
        alert(JSON.stringify(data, null, 2))
      }}
      className="max-w-lg space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <Form.Field name="name" label="Name" required>
          <Form.Input placeholder="John Doe" />
        </Form.Field>
        <Form.Field name="email" label="Email" required>
          <Form.Input type="email" placeholder="john@example.com" />
        </Form.Field>
      </div>

      <Form.Field name="description" label="Description">
        <Form.Textarea placeholder="Optional description..." rows={3} />
      </Form.Field>

      <div className="grid grid-cols-2 gap-4">
        <Form.Field name="country" label="Country">
          <Form.Select placeholder="Select country">
            <Form.SelectItem value="us">United States</Form.SelectItem>
            <Form.SelectItem value="uk">United Kingdom</Form.SelectItem>
            <Form.SelectItem value="de">Germany</Form.SelectItem>
          </Form.Select>
        </Form.Field>
        <Form.Field name="timezone" label="Timezone">
          <Form.Autocomplete
            options={timezones}
            placeholder="Search..."
          />
        </Form.Field>
      </div>

      <Form.Field name="role" label="Role">
        <Form.RadioGroup>
          <Form.RadioItem value="admin" label="Admin" />
          <Form.RadioItem value="editor" label="Editor" />
          <Form.RadioItem value="viewer" label="Viewer" />
        </Form.RadioGroup>
      </Form.Field>

      <Form.Field name="terms">
        <Form.Checkbox label="I agree to the terms and conditions" />
      </Form.Field>

      <Form.Field name="notifications" label="Notifications">
        <Form.Switch label="Enable email notifications" />
      </Form.Field>

      <Form.Submit>Save Everything</Form.Submit>
    </Form.Root>
  ),
}
