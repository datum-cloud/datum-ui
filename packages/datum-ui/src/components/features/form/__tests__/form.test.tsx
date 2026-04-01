/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { ConformAdapter } from '../adapters/conform'
import { RHFAdapter } from '../adapters/rhf'
import { Form } from '../index'

// ---------------------------------------------------------------------------
// Shared schemas & helpers
// ---------------------------------------------------------------------------

const basicSchema = z.object({
  name: z.string({ error: 'Name is required' }).min(2, 'Name must be at least 2 characters'),
  email: z.string({ error: 'Email is required' }).email('Invalid email address'),
})

const checkboxSchema = z.object({
  terms: z.boolean().optional(),
})

const switchSchema = z.object({
  notifications: z.boolean().optional(),
})

const textareaSchema = z.object({
  bio: z.string().optional(),
})

const selectSchema = z.object({
  country: z.string({ error: 'Country is required' }),
})

const radioSchema = z.object({
  plan: z.string({ error: 'Plan is required' }),
})

function noop() {}

// ---------------------------------------------------------------------------
// Adapter configurations
// ---------------------------------------------------------------------------

const adapters = [
  { name: 'Conform', Wrapper: ConformAdapter },
  { name: 'RHF', Wrapper: RHFAdapter },
] as const

// ---------------------------------------------------------------------------
// Tests for both adapters
// ---------------------------------------------------------------------------

describe.each(adapters)('form with $name adapter', ({ Wrapper }) => {
  function renderWithAdapter(ui: React.ReactNode) {
    return render(<Wrapper>{ui}</Wrapper>)
  }

  // -------------------------------------------------------------------------
  // Form.Root
  // -------------------------------------------------------------------------

  describe('form.Root', () => {
    it('renders a form element with children', () => {
      renderWithAdapter(
        <Form.Root schema={basicSchema} onSubmit={noop}>
          <span>child content</span>
        </Form.Root>,
      )

      const form = document.querySelector('form')
      expect(form).toBeInTheDocument()
      expect(screen.getByText('child content')).toBeInTheDocument()
    })

    it('renders with render function children (accessing isSubmitting)', () => {
      renderWithAdapter(
        <Form.Root schema={basicSchema} onSubmit={noop}>
          {({ isSubmitting }) => (
            <span data-testid="status">{isSubmitting ? 'submitting' : 'idle'}</span>
          )}
        </Form.Root>,
      )

      expect(screen.getByTestId('status')).toHaveTextContent('idle')
    })
  })

  // -------------------------------------------------------------------------
  // Form.Field + Form.Input
  // -------------------------------------------------------------------------

  describe('form.Field + Form.Input', () => {
    it('renders a labeled input field', () => {
      renderWithAdapter(
        <Form.Root schema={basicSchema} onSubmit={noop}>
          <Form.Field name="name" label="Full Name">
            <Form.Input />
          </Form.Field>
        </Form.Root>,
      )

      expect(screen.getByText('Full Name')).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('allows typing into the input', async () => {
      const user = userEvent.setup()

      renderWithAdapter(
        <Form.Root schema={basicSchema} onSubmit={noop}>
          <Form.Field name="name" label="Name">
            <Form.Input />
          </Form.Field>
        </Form.Root>,
      )

      const input = screen.getByRole('textbox')
      await user.type(input, 'Alice')
      expect(input).toHaveValue('Alice')
    })

    it('shows required asterisk when required=true', () => {
      renderWithAdapter(
        <Form.Root schema={basicSchema} onSubmit={noop}>
          <Form.Field name="name" label="Name" required>
            <Form.Input />
          </Form.Field>
        </Form.Root>,
      )

      // The asterisk is rendered as a <span> with aria-hidden="true" containing "*"
      const asterisk = document.querySelector('span[aria-hidden="true"]')
      expect(asterisk).toBeInTheDocument()
      expect(asterisk).toHaveTextContent('*')
    })

    it('renders field description text', () => {
      renderWithAdapter(
        <Form.Root schema={basicSchema} onSubmit={noop}>
          <Form.Field name="name" label="Name" description="Enter your full legal name">
            <Form.Input />
          </Form.Field>
        </Form.Root>,
      )

      expect(screen.getByText('Enter your full legal name')).toBeInTheDocument()
    })
  })

  // -------------------------------------------------------------------------
  // Form.Submit
  // -------------------------------------------------------------------------

  describe('form.Submit', () => {
    it('renders a submit button', () => {
      renderWithAdapter(
        <Form.Root schema={basicSchema} onSubmit={noop}>
          <Form.Submit>Save</Form.Submit>
        </Form.Root>,
      )

      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
    })

    it('has type="submit"', () => {
      renderWithAdapter(
        <Form.Root schema={basicSchema} onSubmit={noop}>
          <Form.Submit>Save</Form.Submit>
        </Form.Root>,
      )

      expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('type', 'submit')
    })
  })

  // -------------------------------------------------------------------------
  // Form.Button
  // -------------------------------------------------------------------------

  describe('form.Button', () => {
    it('renders as type="button" (non-submit)', () => {
      renderWithAdapter(
        <Form.Root schema={basicSchema} onSubmit={noop}>
          <Form.Button>Cancel</Form.Button>
        </Form.Root>,
      )

      const button = screen.getByRole('button', { name: 'Cancel' })
      expect(button).toHaveAttribute('type', 'button')
    })
  })

  // -------------------------------------------------------------------------
  // Form submission
  // -------------------------------------------------------------------------

  describe('form submission', () => {
    it('calls onSubmit with valid data when form is submitted', async () => {
      const user = userEvent.setup()
      const handleSubmit = vi.fn()

      renderWithAdapter(
        <Form.Root schema={basicSchema} onSubmit={handleSubmit} mode="onSubmit">
          <Form.Field name="name" label="Name">
            <Form.Input />
          </Form.Field>
          <Form.Field name="email" label="Email">
            <Form.Input type="email" />
          </Form.Field>
          <Form.Submit>Submit</Form.Submit>
        </Form.Root>,
      )

      const nameInput = screen.getByRole('textbox', { name: /name/i })
      const emailInput = screen.getByRole('textbox', { name: /email/i })

      await user.type(nameInput, 'Alice')
      await user.type(emailInput, 'alice@example.com')
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledTimes(1)
      })

      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Alice', email: 'alice@example.com' }),
      )
    })

    it('shows validation errors for invalid data', async () => {
      const user = userEvent.setup()
      const handleSubmit = vi.fn()

      renderWithAdapter(
        <Form.Root schema={basicSchema} onSubmit={handleSubmit} mode="onSubmit">
          <Form.Field name="name" label="Name">
            <Form.Input />
          </Form.Field>
          <Form.Field name="email" label="Email">
            <Form.Input type="email" />
          </Form.Field>
          <Form.Submit>Submit</Form.Submit>
        </Form.Root>,
      )

      // Submit without filling in any fields
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      await waitFor(() => {
        // Both fields produce an error, so there are multiple alert elements
        const alerts = screen.getAllByRole('alert')
        expect(alerts.length).toBeGreaterThanOrEqual(1)
      })

      // onSubmit should NOT have been called with invalid data
      expect(handleSubmit).not.toHaveBeenCalled()
    })
  })

  // -------------------------------------------------------------------------
  // Form.Checkbox
  // -------------------------------------------------------------------------

  describe('form.Checkbox', () => {
    it('renders a checkbox field with label', () => {
      renderWithAdapter(
        <Form.Root schema={checkboxSchema} onSubmit={noop}>
          <Form.Field name="terms">
            <Form.Checkbox label="I agree to the terms" />
          </Form.Field>
        </Form.Root>,
      )

      expect(screen.getByRole('checkbox')).toBeInTheDocument()
      expect(screen.getByText('I agree to the terms')).toBeInTheDocument()
    })
  })

  // -------------------------------------------------------------------------
  // Form.Switch
  // -------------------------------------------------------------------------

  describe('form.Switch', () => {
    it('renders a switch field with label', () => {
      renderWithAdapter(
        <Form.Root schema={switchSchema} onSubmit={noop}>
          <Form.Field name="notifications">
            <Form.Switch label="Enable notifications" />
          </Form.Field>
        </Form.Root>,
      )

      expect(screen.getByRole('switch')).toBeInTheDocument()
      expect(screen.getByText('Enable notifications')).toBeInTheDocument()
    })
  })

  // -------------------------------------------------------------------------
  // Form.Textarea
  // -------------------------------------------------------------------------

  describe('form.Textarea', () => {
    it('renders a textarea field', () => {
      const schema = z.object({ bio: z.string() })
      renderWithAdapter(
        <Form.Root schema={schema} onSubmit={noop}>
          <Form.Field name="bio" label="Bio">
            <Form.Textarea />
          </Form.Field>
        </Form.Root>,
      )

      expect(screen.getByRole('textbox')).toBeInTheDocument()
      expect(screen.getByText('Bio')).toBeInTheDocument()
    })

    it('allows typing into textarea', async () => {
      const user = userEvent.setup()

      renderWithAdapter(
        <Form.Root schema={textareaSchema} onSubmit={noop}>
          <Form.Field name="bio" label="Bio">
            <Form.Textarea />
          </Form.Field>
        </Form.Root>,
      )

      const textarea = screen.getByRole('textbox')
      await user.type(textarea, 'Hello world')
      expect(textarea).toHaveValue('Hello world')
    })
  })

  // -------------------------------------------------------------------------
  // Form.Select
  // -------------------------------------------------------------------------

  describe('form.Select', () => {
    it('renders a select field with label', () => {
      renderWithAdapter(
        <Form.Root schema={selectSchema} onSubmit={noop}>
          <Form.Field name="country" label="Country">
            <Form.Select placeholder="Select a country">
              <Form.SelectItem value="us">United States</Form.SelectItem>
              <Form.SelectItem value="uk">United Kingdom</Form.SelectItem>
            </Form.Select>
          </Form.Field>
        </Form.Root>,
      )

      expect(screen.getByText('Country')).toBeInTheDocument()
      // The trigger renders a combobox role in Radix Select
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })
  })

  // -------------------------------------------------------------------------
  // Form.RadioGroup
  // -------------------------------------------------------------------------

  describe('form.RadioGroup', () => {
    it('renders radio options with labels', () => {
      renderWithAdapter(
        <Form.Root schema={radioSchema} onSubmit={noop}>
          <Form.Field name="plan" label="Select Plan">
            <Form.RadioGroup>
              <Form.RadioItem value="free" label="Free" />
              <Form.RadioItem value="pro" label="Pro" />
              <Form.RadioItem value="enterprise" label="Enterprise" />
            </Form.RadioGroup>
          </Form.Field>
        </Form.Root>,
      )

      expect(screen.getByRole('radiogroup')).toBeInTheDocument()
      expect(screen.getByText('Free')).toBeInTheDocument()
      expect(screen.getByText('Pro')).toBeInTheDocument()
      expect(screen.getByText('Enterprise')).toBeInTheDocument()
    })
  })

  // -------------------------------------------------------------------------
  // Form State
  // -------------------------------------------------------------------------

  describe('form state', () => {
    it('exposes isDirty and isValid via render function', async () => {
      const user = userEvent.setup()

      renderWithAdapter(
        <Form.Root schema={basicSchema} onSubmit={noop}>
          {({ isDirty, isValid }) => (
            <>
              <span data-testid="dirty">{isDirty ? 'dirty' : 'pristine'}</span>
              <span data-testid="valid">{isValid ? 'valid' : 'invalid'}</span>
              <Form.Field name="name" label="Name" required>
                <Form.Input />
              </Form.Field>
              <Form.Field name="email" label="Email" required>
                <Form.Input type="email" />
              </Form.Field>
            </>
          )}
        </Form.Root>,
      )

      // Initially pristine
      expect(screen.getByTestId('dirty')).toHaveTextContent('pristine')

      // Type in the name field to make it dirty
      const nameInput = screen.getByLabelText(/name/i)
      await user.type(nameInput, 'John')

      await waitFor(() => {
        expect(screen.getByTestId('dirty')).toHaveTextContent('dirty')
      })
    })

    it('exposes isSubmitted and submitCount via render function', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()

      renderWithAdapter(
        <Form.Root schema={basicSchema} onSubmit={onSubmit} defaultValues={{ name: 'John Doe', email: 'john@test.com' }}>
          {({ isSubmitted, submitCount }) => (
            <>
              <span data-testid="submitted">{isSubmitted ? 'yes' : 'no'}</span>
              <span data-testid="count">{submitCount}</span>
              <Form.Field name="name" label="Name" required>
                <Form.Input />
              </Form.Field>
              <Form.Field name="email" label="Email" required>
                <Form.Input type="email" />
              </Form.Field>
              <Form.Submit>Submit</Form.Submit>
            </>
          )}
        </Form.Root>,
      )

      // Initially not submitted
      expect(screen.getByTestId('submitted')).toHaveTextContent('no')
      expect(screen.getByTestId('count')).toHaveTextContent('0')

      // Submit the form
      await user.click(screen.getByRole('button', { name: /submit/i }))

      await waitFor(() => {
        expect(screen.getByTestId('submitted')).toHaveTextContent('yes')
        expect(screen.getByTestId('count')).toHaveTextContent('1')
      })
    })

    it('exposes dirtyFields and touchedFields via render function', async () => {
      const user = userEvent.setup()

      renderWithAdapter(
        <Form.Root schema={basicSchema} onSubmit={noop}>
          {({ dirtyFields, touchedFields }) => (
            <>
              <span data-testid="dirty-name">{dirtyFields.name ? 'dirty' : 'clean'}</span>
              <span data-testid="touched-name">{touchedFields.name ? 'touched' : 'untouched'}</span>
              <Form.Field name="name" label="Name" required>
                <Form.Input />
              </Form.Field>
              <Form.Field name="email" label="Email" required>
                <Form.Input type="email" />
              </Form.Field>
            </>
          )}
        </Form.Root>,
      )

      // Initially clean and untouched
      expect(screen.getByTestId('dirty-name')).toHaveTextContent('clean')
      expect(screen.getByTestId('touched-name')).toHaveTextContent('untouched')

      // Type in the name field
      const nameInput = screen.getByLabelText(/name/i)
      await user.type(nameInput, 'John')

      await waitFor(() => {
        expect(screen.getByTestId('dirty-name')).toHaveTextContent('dirty')
      })

      // Tab out to trigger blur/touch
      await user.tab()

      await waitFor(() => {
        expect(screen.getByTestId('touched-name')).toHaveTextContent('touched')
      })
    })
  })
})

// ---------------------------------------------------------------------------
// Missing adapter test
// ---------------------------------------------------------------------------

describe('missing adapter', () => {
  it('throws when no adapter is provided', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      render(
        <Form.Root schema={basicSchema} onSubmit={noop}>
          <div>content</div>
        </Form.Root>,
      )
    }).toThrow('No form adapter found')

    consoleSpy.mockRestore()
  })
})
