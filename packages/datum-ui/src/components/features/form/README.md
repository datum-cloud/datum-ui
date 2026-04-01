# Datum Form Library

A compound component pattern form library with pluggable adapter support for form state management. Choose between **Conform.js** or **React Hook Form** as your form backend, with Zod for schema validation.

## Adapter Setup

The form system requires an adapter to be set up at the root of your application. The adapter tells all `Form.*` components which form library to use internally.

### Conform Adapter

```bash
npm install @conform-to/react @conform-to/zod zod
```

```tsx
import { ConformAdapter } from '@datum-cloud/datum-ui/form/adapters/conform'

function App() {
  return (
    <ConformAdapter>
      {/* All Form.* components use Conform.js internally */}
      <YourApp />
    </ConformAdapter>
  )
}
```

### React Hook Form Adapter

```bash
npm install react-hook-form @hookform/resolvers zod
```

```tsx
import { RHFAdapter } from '@datum-cloud/datum-ui/form/adapters/rhf'

function App() {
  return (
    <RHFAdapter>
      {/* All Form.* components use React Hook Form internally */}
      <YourApp />
    </RHFAdapter>
  )
}
```

### Missing Adapter

If no adapter is provided, all `Form.*` components will throw a descriptive error:

```
useAdapter must be used within a FormAdapterProvider.
Wrap your app with <ConformAdapter> or <RHFAdapter>.
```

## Dependencies

| Dependency                  | Conform Adapter | RHF Adapter |
| --------------------------- | --------------- | ----------- |
| `zod` (>=4)                 | Required        | Required    |
| `@conform-to/react` (>=1)   | Required        | --          |
| `@conform-to/zod` (>=1)     | Required        | --          |
| `react-hook-form` (>=7.55)  | --              | Required    |
| `@hookform/resolvers` (>=5) | --              | Required    |

All form library dependencies are **optional peer dependencies** -- you only install what your chosen adapter needs.

Additional optional peer dependencies for specific components:

| Dependency                | Component                               |
| ------------------------- | --------------------------------------- |
| `@stepperize/react` (>=4) | `FormStepper` (from `./form/stepper`)   |
| `@tanstack/react-virtual` | `Form.Autocomplete` (virtualized lists) |
| `sonner`                  | `Form.CopyBox` (toast notifications)    |

## Quick Start

```tsx
import { Form } from '@datum-cloud/datum-ui/form'
import { z } from 'zod'

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'user', 'viewer']),
})

function UserForm() {
  return (
    <Form.Root
      schema={userSchema}
      onSubmit={async (data) => {
        console.log('Form submitted:', data)
        await saveUser(data)
      }}>
      <Form.Field name="name" label="Full Name" required>
        <Form.Input placeholder="John Doe" />
      </Form.Field>

      <Form.Field name="email" label="Email Address" required>
        <Form.Input type="email" placeholder="john@example.com" />
      </Form.Field>

      <Form.Field name="role" label="Role" required>
        <Form.Select placeholder="Select a role">
          <Form.SelectItem value="admin">Admin</Form.SelectItem>
          <Form.SelectItem value="user">User</Form.SelectItem>
          <Form.SelectItem value="viewer">Viewer</Form.SelectItem>
        </Form.Select>
      </Form.Field>

      <Form.Submit>Create User</Form.Submit>
    </Form.Root>
  )
}
```

> The form API is identical regardless of which adapter you use. Switch adapters by changing only the root provider -- no form code changes needed.

## Components

### Core Components

#### `Form.Root`

The root form component that provides context to all children. Supports two patterns:

**Standard Pattern** - For simple forms:

```tsx
<Form.Root
  schema={zodSchema} // Required: Zod schema for validation
  onSubmit={(data) => {}} // Client-side submit handler
  action="/api/users" // OR: React Router action path
  method="POST" // HTTP method (default: POST)
  defaultValues={{ role: 'user' }} // Default form values
  mode="onBlur" // Validation mode: onBlur | onChange | onSubmit
  isSubmitting={false} // External submitting state (e.g., from useFetcher)
  onError={(errors) => {}} // Validation error callback
  onSuccess={(data) => {}} // Success callback
  className="space-y-4" // Additional CSS classes
>
  {children}
</Form.Root>
```

**Render Function Pattern** - For accessing form state:

```tsx
<Form.Root schema={zodSchema} onSubmit={handleSubmit}>
  {({ form, fields, isSubmitting, isDirty, isValid, submit, reset }) => (
    <>
      <Form.Field name="email" label="Email">
        <Form.Input type="email" />
      </Form.Field>

      <Button disabled={isSubmitting} onClick={() => reset()}>
        Reset
      </Button>

      <Form.Submit disabled={!isDirty || !isValid}>Save</Form.Submit>
    </>
  )}
</Form.Root>
```

The render function receives:

- `form` - Normalized form instance (adapter-agnostic)
- `fields` - All form fields metadata
- `isSubmitting` - Whether the form is currently submitting
- `isDirty` - Whether any field value differs from default
- `isValid` - Whether the form currently passes validation
- `isSubmitted` - Whether the form has been submitted at least once
- `submitCount` - Number of times the form has been submitted
- `dirtyFields` - Record of field names that have been changed
- `touchedFields` - Record of field names that have been focused
- `submit` - Function to programmatically submit the form
- `reset` - Function to reset form to default values

#### `Form.Field`

Field wrapper with automatic label and error handling. Supports two patterns:

**Standard Pattern** - For built-in Form inputs:

```tsx
<Form.Field
  name="email" // Required: Field name (supports nested: "address.city")
  label="Email Address" // Field label
  description="We'll never share your email" // Helper text
  tooltip="More information" // Tooltip content
  required // Show required indicator
  disabled // Disable the field
  className="custom-class" // Wrapper CSS classes
  labelClassName="font-bold" // Label CSS classes
>
  <Form.Input />
</Form.Field>
```

**Render Function Pattern** - For custom components needing field access:

```tsx
<Form.Field name="role" label="Role" required>
  {({ control, meta, fields, form, isSubmitting }) => (
    <CustomSelect
      name={meta.name}
      id={meta.id}
      value={control.value}
      onChange={(value) => control.change(value)}
      disabled={meta.disabled || isSubmitting}
    />
  )}
</Form.Field>
```

The render function receives:

- `field` - Normalized field state from the adapter
- `control` - Input control with `value`, `change()`, `blur()`, `focus()`
- `meta` - Field meta: `name`, `id`, `errors`, `required`, `disabled`
- `fields` - All form fields (for multi-field scenarios)
- `form` - Normalized form instance
- `isSubmitting` - Whether form is submitting

#### `Form.Submit`

Submit button with automatic loading state.

```tsx
<Form.Submit
  loadingText="Saving..." // Text shown while submitting
  type="primary" // Button variant
  theme="solid" // Button theme
  size="default" // Button size
  disabled={false} // Disable button
>
  Save Changes
</Form.Submit>
```

#### `Form.Button`

Non-submit button for actions like cancel, reset, etc. Automatically disabled during form submission.

```tsx
// Cancel button (defaults to quaternary/borderless style)
<Form.Button onClick={() => navigate(-1)}>
  Cancel
</Form.Button>

// Reset button with custom styling
<Form.Button onClick={() => reset()} type="secondary" theme="light">
  Reset Form
</Form.Button>

// Button that stays enabled during submission
<Form.Button onClick={handleHelp} disableOnSubmit={false}>
  Need Help?
</Form.Button>
```

Props:

- `onClick` - Click handler
- `type` - Button variant: `primary` | `secondary` | `tertiary` | `quaternary` (default)
- `theme` - Button theme: `solid` | `light` | `borderless` (default)
- `size` - Button size: `small` | `default` | `large`
- `disabled` - Disable button manually
- `disableOnSubmit` - Auto-disable during form submission (default: `true`)

### Input Components

#### `Form.Input`

```tsx
<Form.Field name="username">
  <Form.Input
    type="text" // text | email | password | number | tel | url | search | date | time
    placeholder="Enter username"
    disabled={false}
    className="w-full"
  />
</Form.Field>
```

#### `Form.Textarea`

```tsx
<Form.Field name="bio">
  <Form.Textarea rows={4} placeholder="Tell us about yourself..." />
</Form.Field>
```

#### `Form.Select`

```tsx
<Form.Field name="country">
  <Form.Select placeholder="Select a country">
    <Form.SelectItem value="us">United States</Form.SelectItem>
    <Form.SelectItem value="uk">United Kingdom</Form.SelectItem>
    <Form.SelectItem value="ca" disabled>
      Canada
    </Form.SelectItem>
  </Form.Select>
</Form.Field>
```

#### `Form.Checkbox`

```tsx
<Form.Field name="terms">
  <Form.Checkbox label="I agree to the terms and conditions" />
</Form.Field>
```

#### `Form.Switch`

```tsx
<Form.Field name="notifications">
  <Form.Switch label="Enable email notifications" />
</Form.Field>
```

#### `Form.RadioGroup`

```tsx
<Form.Field name="plan" label="Select Plan">
  <Form.RadioGroup orientation="vertical">
    <Form.RadioItem value="free" label="Free" description="Basic features" />
    <Form.RadioItem value="pro" label="Pro" description="Advanced features" />
    <Form.RadioItem value="enterprise" label="Enterprise" description="Custom solutions" />
  </Form.RadioGroup>
</Form.Field>
```

### Using Form Components in Modals/Dialogs

Components that use popovers (DatePicker, DateTimePicker, Combobox, Autocomplete, Autosearch) support a `modal` prop to control their behavior inside Dialog/Modal components.

**Default behavior (modal={false}):**
Components work correctly inside Dialogs without any configuration:

```tsx
<Dialog>
  <DialogContent>
    <Form.Field name="date" label="Select Date">
      {/* Works by default! */}
      <Form.DatePicker />
    </Form.Field>
  </DialogContent>
</Dialog>
```

**Prevent outside interactions (modal={true}):**
Set `modal={true}` to prevent clicking outside the popover:

```tsx
<Form.Field name="country" label="Country">
  <Form.Combobox options={countries} modal={true} />
</Form.Field>
```

**Note:** The default `modal={false}` is correct for most use cases. Only set `modal={true}` if you need to block interactions outside the popover.

### Picker Components

#### `Form.DatePicker`

Date selection with calendar popover:

```tsx
<Form.Field name="birthDate" label="Birth Date" required>
  <Form.DatePicker placeholder="Select date" />
</Form.Field>
```

**Schema:** `z.string()` (ISO date string)
**Props:** All CalendarDatePicker props (numberOfMonths, minDate, maxDate, disableFuture, disablePast, modal)

#### `Form.TimePicker`

Time input (HH:mm format):

```tsx
<Form.Field name="availableTime" label="Available Time" required>
  <Form.TimePicker />
</Form.Field>
```

**Schema:** `z.string()` (HH:mm format)
**Props:** min, max, step, disabled

#### `Form.DateTimePicker`

Combined date and time selection:

```tsx
<Form.Field name="appointmentTime" label="Appointment" required>
  <Form.DateTimePicker showTimezoneIndicator />
</Form.Field>
```

**Schema:** `z.string()` (ISO 8601 datetime string)
**Props:** timezone, showTimezoneIndicator, minDate, maxDate, disabledDates, modal, disabled

#### `Form.Transfer`

Dual-panel item selector with search:

```tsx
<Form.Field name="assignedUsers" label="Assigned Users" required>
  <Form.Transfer
    items={users}
    itemKey="id"
    itemLabel="name"
    itemGroup="role"
  />
</Form.Field>
```

**Schema:** `z.array(z.string())` (array of selected keys)
**Props:** items, itemKey, itemLabel, itemGroup, searchable

#### `Form.Combobox`

Searchable single-select dropdown:

```tsx
<Form.Field name="country" label="Country" required>
  <Form.Combobox
    options={[
      { value: 'us', label: 'United States' },
      { value: 'uk', label: 'United Kingdom' },
    ]}
    placeholder="Select country"
  />
</Form.Field>
```

**Schema:** `z.string()`
**Props:** options, placeholder, searchable, clearable, modal

#### `Form.Autosearch`

Search-first input with dropdown results (type to search):

```tsx
<Form.Field name="userId" label="User" required>
  <Form.Autosearch
    options={searchResults}
    onSearch={handleSearch}
    loading={isSearching}
    placeholder="Type to search users..."
  />
</Form.Field>
```

**Schema:** `z.string()` (selected value)
**Props:** options, onSearch, loading, searchDebounceMs, modal, placeholder, emptyMessage

### Advanced Components

#### `Form.When` - Conditional Rendering

Render children based on field values.

```tsx
// Render when field equals value
<Form.When field="contactMethod" is="email">
  <Form.Field name="email"><Form.Input type="email" /></Form.Field>
</Form.When>

// Render when field does not equal value
<Form.When field="contactMethod" isNot="none">
  <Form.Field name="contact"><Form.Input /></Form.Field>
</Form.When>

// Render when field value is in array
<Form.When field="role" in={['admin', 'moderator']}>
  <Form.Field name="permissions"><Form.Input /></Form.Field>
</Form.When>

// Render when field value is not in array
<Form.When field="status" notIn={['archived', 'deleted']}>
  <Form.Field name="actions"><Form.Input /></Form.Field>
</Form.When>
```

#### `Form.FieldArray` - Dynamic Fields

Manage arrays of form fields.

```tsx
<Form.FieldArray name="members">
  {({ fields, append, remove, move }) => (
    <>
      {fields.map((field, index) => (
        <div key={field.key} className="flex gap-2">
          <Form.Field name={`members.${index}.email`} label="Email">
            <Form.Input type="email" />
          </Form.Field>
          <Form.Field name={`members.${index}.role`} label="Role">
            <Form.Select>
              <Form.SelectItem value="admin">Admin</Form.SelectItem>
              <Form.SelectItem value="member">Member</Form.SelectItem>
            </Form.Select>
          </Form.Field>
          <button type="button" onClick={() => remove(index)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={() => append({ email: '', role: 'member' })}>
        Add Member
      </button>
    </>
  )}
</Form.FieldArray>
```

#### `Form.Custom` - Escape Hatch

Access raw form context for complex use cases.

```tsx
<Form.Custom>
  {({ form, fields, submit, reset }) => (
    <MyCustomComponent
      fields={fields}
      onCustomAction={() => {
        // Custom logic
        submit()
      }}
    />
  )}
</Form.Custom>
```

### Stepper Components (Separate Import)

The stepper is shipped as a separate entry point to avoid pulling in `@stepperize/react` for basic forms.

```bash
npm install @stepperize/react
```

```tsx
import { FormStepper, FormStep, StepperNavigation, StepperControls } from '@datum-cloud/datum-ui/form/stepper'
```

#### Multi-Step Form

```tsx
const steps = [
  { id: 'account', label: 'Account', description: 'Create your account', schema: accountSchema },
  { id: 'profile', label: 'Profile', schema: profileSchema },
  { id: 'confirm', label: 'Confirm', schema: confirmSchema },
]

<FormStepper
  steps={steps}
  onComplete={async (data) => {
    console.log('All data:', data)
    await submitForm(data)
  }}
  onStepChange={(stepId, direction) => {
    console.log(`Moving ${direction} to step: ${stepId}`)
  }}
  initialStep="account">
  <StepperNavigation variant="horizontal" labelOrientation="vertical" />

  <FormStep id="account">
    <Form.Field name="email" label="Email" required>
      <Form.Input type="email" />
    </Form.Field>
    <Form.Field name="password" label="Password" required>
      <Form.Input type="password" />
    </Form.Field>
  </FormStep>

  <FormStep id="profile">
    <Form.Field name="name" label="Full Name" required>
      <Form.Input />
    </Form.Field>
    <Form.Field name="bio" label="Bio">
      <Form.Textarea rows={4} />
    </Form.Field>
  </FormStep>

  <FormStep id="confirm">
    <p>Please review your information before submitting.</p>
  </FormStep>

  <StepperControls
    prevLabel={(isFirst) => (isFirst ? 'Cancel' : 'Previous')}
    nextLabel={(isLast) => (isLast ? 'Submit' : 'Next')}
  />
</FormStepper>
```

## Hooks

### `Form.useFormContext()`

Access the form context from any component inside `Form.Root`.

```tsx
function MyComponent() {
  const { form, fields, isSubmitting, submit, reset } = Form.useFormContext()

  return (
    <button onClick={submit} disabled={isSubmitting}>
      Submit
    </button>
  )
}
```

### `Form.useFieldContext()`

Access the current field context from inside `Form.Field`.

```tsx
function MyInput() {
  const { name, id, errors, required, disabled, fieldState } = Form.useFieldContext()

  return (
    <input
      name={name}
      id={id}
      required={required}
      disabled={disabled}
      aria-invalid={!!errors?.length}
    />
  )
}
```

### `Form.useField(name)`

Access and control a specific field by name.

```tsx
function MyCustomField({ name }: { name: string }) {
  const { field, control, meta, errors } = Form.useField(name)

  return (
    <input
      name={meta.name}
      value={control.value ?? ''}
      onChange={(e) => control.change(e.target.value)}
      onBlur={control.blur}
    />
  )
}
```

### `Form.useWatch(name)`

Watch a field's value and re-render when it changes.

```tsx
function PriceDisplay() {
  const quantity = Form.useWatch('quantity')
  const price = Form.useWatch('price')

  const total = (Number(quantity) || 0) * (Number(price) || 0)

  return <p>Total: ${total.toFixed(2)}</p>
}
```

### `Form.useFormState()`

Access form state (dirty, valid, submitted, touched fields) from any component inside `Form.Root`.

```tsx
function SaveButton() {
  const { isDirty, isValid, isSubmitting, isSubmitted, submitCount, dirtyFields, touchedFields } = Form.useFormState()

  return (
    <div>
      <button type="submit" disabled={!isDirty || !isValid || isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save'}
      </button>
      {isSubmitted && <p>Form submitted {submitCount} time(s)</p>}
    </div>
  )
}
```

Returns:

- `isDirty` - Whether any field value differs from its default
- `isValid` - Whether the form currently passes schema validation
- `isSubmitting` - Whether a submission is in progress
- `isSubmitted` - Whether the form has been submitted at least once
- `submitCount` - Number of times the form has been submitted
- `dirtyFields` - `Record<string, boolean>` of fields that have been changed
- `touchedFields` - `Record<string, boolean>` of fields that have been focused

### `useStepper()` (Separate Import)

Access stepper context inside `FormStepper`. Imported from `@datum-cloud/datum-ui/form/stepper`.

```tsx
import { useStepper } from '@datum-cloud/datum-ui/form/stepper'

function StepIndicator() {
  const { current, currentIndex, steps, isFirst, isLast } = useStepper()

  return (
    <p>
      Step {currentIndex + 1} of {steps.length}: {current.label}
    </p>
  )
}
```

## TypeScript Support

All components are fully typed. Import types directly:

```tsx
import { Form } from '@datum-cloud/datum-ui/form'
import type {
  FormAdapter,
  FormRootProps,
  FormFieldProps,
  NormalizedFieldState,
  NormalizedFormInstance,
  StepConfig,
} from '@datum-cloud/datum-ui/form'
```

## Adapter Architecture

The form system uses a pluggable adapter pattern (similar to nuqs). The adapter is set once at the application root and all `Form.*` components use it transparently.

```
<ConformAdapter>        or        <RHFAdapter>
  └── Form.Root                     └── Form.Root
       ├── Form.Field                    ├── Form.Field
       │   └── Form.Input               │   └── Form.Input
       └── Form.Submit                  └── Form.Submit
```

### Creating a Custom Adapter

Implement the `FormAdapter` interface:

```tsx
import type { FormAdapter } from '@datum-cloud/datum-ui/form'

const myAdapter: FormAdapter = {
  name: 'my-adapter',
  useCreateForm: (props) => { /* ... */ },
  useField: (name) => { /* ... */ },
  useWatch: (name) => { /* ... */ },
  useWatchAll: (names) => { /* ... */ },
  useFieldArray: (name) => { /* ... */ },
  FormProvider: ({ instance, children }) => { /* ... */ },
}
```

## Accessibility

All components include built-in accessibility features:

- ARIA labels and descriptions
- Error announcements with `role="alert"`
- Keyboard navigation support
- Required field indicators
- Focus management
