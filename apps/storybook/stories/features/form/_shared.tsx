/* eslint-disable no-alert, react-refresh/only-export-components --
 * Story bodies + zod schemas live together here so each adapter folder
 * (conform/ + react-hook-form/) renders identical markup with only the
 * adapter decorator differing. Demonstrations use alert() the same way
 * the legacy story files did.
 */
import { Button } from '@datum-cloud/datum-ui/button'
import { Form } from '@datum-cloud/datum-ui/form'
import { FormStep, FormStepper, StepperControls, StepperNavigation } from '@datum-cloud/datum-ui/form/stepper'
import { PlusIcon, TrashIcon } from 'lucide-react'
import { z } from 'zod'

// ============================================================================
// Schemas (shared across both adapters)
// ============================================================================

// Conform's parseWithZod strips empty form values to `undefined` before
// zod validation, while RHF's zodResolver passes `''` straight through.
// Setting a constructor-level `error` on `z.string()` handles the
// undefined case (Conform path) and `.min(1, msg)` handles the empty
// string (RHF path), so both adapters surface the same message.
export const basicSchema = z.object({
  name: z.string({ error: 'Name is required' }).min(1, 'Name is required'),
  email: z.string({ error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
})

export const advancedSchema = z.object({
  contactMethod: z.string({ error: 'Please choose a contact method' })
    .min(1, 'Please choose a contact method'),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  teamName: z.string({ error: 'Team name is required' })
    .min(1, 'Team name is required'),
  members: z.array(
    z.object({
      email: z.string(),
      role: z.string(),
    }),
  ),
})

export const dialogSchema = z.object({
  name: z.string({ error: 'Name is required' }).min(1, 'Name is required'),
  email: z.string({ error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
})

export const fieldsSchema = z.object({
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

const timezones = [
  { value: 'utc', label: 'UTC' },
  { value: 'us-eastern', label: 'US Eastern (ET)' },
  { value: 'us-central', label: 'US Central (CT)' },
  { value: 'us-pacific', label: 'US Pacific (PT)' },
  { value: 'eu-london', label: 'Europe/London (GMT)' },
  { value: 'eu-berlin', label: 'Europe/Berlin (CET)' },
  { value: 'asia-tokyo', label: 'Asia/Tokyo (JST)' },
]

// ============================================================================
// Stepper config (shared across both adapters)
// ============================================================================

const personalInfoSchema = z.object({
  fullName: z.string({ error: 'Full name is required' })
    .min(1, 'Full name is required'),
  bio: z.string().optional(),
})

const contactSchema = z.object({
  email: z.string({ error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
  phone: z.string().optional(),
})

const reviewSchema = z.object({
  plan: z.string({ error: 'Please select a plan' })
    .min(1, 'Please select a plan'),
  newsletter: z.string().optional(),
})

export const stepperSteps = [
  { id: 'personal', label: 'Personal Info', description: 'Your basic details', schema: personalInfoSchema },
  { id: 'contact', label: 'Contact', description: 'How to reach you', schema: contactSchema },
  { id: 'review', label: 'Review', description: 'Confirm your choices', schema: reviewSchema },
]

// ============================================================================
// Story bodies (adapter-agnostic — the active adapter is provided by the
// story decorator)
// ============================================================================

export function BasicFormStory() {
  return (
    <Form.Root
      schema={basicSchema}
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
  )
}

export function FieldsFormStory() {
  return (
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
        <Form.Autocomplete options={timezones} placeholder="Search timezone..." />
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
  )
}

export function AdvancedFormStory() {
  return (
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
  )
}

export function DialogFormStory({
  showHeaderClose,
  triggerLabel,
  description,
}: {
  showHeaderClose: boolean
  triggerLabel: string
  description: string
}) {
  return (
    <Form.Dialog
      title="Add Member"
      description={description}
      schema={dialogSchema}
      trigger={
        showHeaderClose
          ? <Button type="primary">{triggerLabel}</Button>
          : <Button type="secondary" theme="outline">{triggerLabel}</Button>
      }
      onSubmit={async (data) => {
        await new Promise(r => setTimeout(r, 800))
        alert(JSON.stringify(data, null, 2))
      }}
      showHeaderClose={showHeaderClose}
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
  )
}

export function StepperFormStory() {
  return (
    <FormStepper
      steps={stepperSteps}
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
  )
}
