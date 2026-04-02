import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { ConformAdapter } from '../adapters/conform'
import { RHFAdapter } from '../adapters/rhf'
import { Form } from '../index'

const schema = z.object({
  email: z.string().email('Invalid email'),
})

function renderWithConform(ui: React.ReactNode) {
  return render(<ConformAdapter>{ui}</ConformAdapter>)
}

function renderWithRHF(ui: React.ReactNode) {
  return render(<RHFAdapter>{ui}</RHFAdapter>)
}

const adapters = [
  { name: 'Conform', render: renderWithConform },
  { name: 'RHF', render: renderWithRHF },
] as const

describe.each(adapters)('form validation modes ($name adapter)', ({ render: renderFn }) => {
  describe('mode="onChange" (default)', () => {
    it('should show errors after first change', async () => {
      const user = userEvent.setup()

      renderFn(
        <Form.Root schema={schema} mode="onChange" onSubmit={() => {}}>
          <Form.Field name="email" label="Email">
            <Form.Input type="email" />
          </Form.Field>
        </Form.Root>,
      )

      const input = screen.getByLabelText(/email/i)

      // No error initially
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()

      // Type invalid email
      await user.type(input, 'invalid')

      // Error should appear after first change
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })
    })

    it('should clear errors when value becomes valid', async () => {
      const user = userEvent.setup()

      renderFn(
        <Form.Root schema={schema} mode="onChange" onSubmit={() => {}}>
          <Form.Field name="email" label="Email">
            <Form.Input type="email" />
          </Form.Field>
        </Form.Root>,
      )

      const input = screen.getByLabelText(/email/i)

      // Type invalid, then clear and type valid
      await user.type(input, 'invalid')
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })

      await user.clear(input)
      await user.type(input, 'test@example.com')

      await waitFor(() => {
        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      })
    })
  })

  describe('mode="onBlur"', () => {
    it('should not show errors until blur', async () => {
      const user = userEvent.setup()

      renderFn(
        <Form.Root schema={schema} mode="onBlur" onSubmit={() => {}}>
          <Form.Field name="email" label="Email">
            <Form.Input type="email" />
          </Form.Field>
        </Form.Root>,
      )

      const input = screen.getByLabelText(/email/i)

      // Type invalid email
      await user.type(input, 'invalid')

      // No error yet (field not blurred)
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()

      // Blur the field
      await user.tab()

      // Error should appear after blur
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })
    })

    it('should show errors on submit even without blur', async () => {
      const user = userEvent.setup()

      renderFn(
        <Form.Root schema={schema} mode="onBlur" onSubmit={() => {}}>
          <Form.Field name="email" label="Email">
            <Form.Input type="email" />
          </Form.Field>
          <Form.Submit>Save</Form.Submit>
        </Form.Root>,
      )

      // Submit without touching any field
      await user.click(screen.getByRole('button', { name: /save/i }))

      // Errors should appear after submit attempt
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })
    })
  })

  describe('mode="onSubmit"', () => {
    it('should not show errors until submit', async () => {
      const user = userEvent.setup()

      renderFn(
        <Form.Root schema={schema} mode="onSubmit" onSubmit={() => {}}>
          <Form.Field name="email" label="Email">
            <Form.Input type="email" />
          </Form.Field>
          <Form.Submit>Save</Form.Submit>
        </Form.Root>,
      )

      const input = screen.getByLabelText(/email/i)

      // Type invalid and blur
      await user.type(input, 'invalid')
      await user.tab()

      // No error yet
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()

      // Submit
      await user.click(screen.getByRole('button', { name: /save/i }))

      // Error should appear after submit
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })
    })

    it('should not call onSubmit when validation fails', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()

      renderFn(
        <Form.Root schema={schema} mode="onSubmit" onSubmit={onSubmit}>
          <Form.Field name="email" label="Email">
            <Form.Input type="email" />
          </Form.Field>
          <Form.Submit>Save</Form.Submit>
        </Form.Root>,
      )

      const input = screen.getByLabelText(/email/i)
      await user.type(input, 'invalid')

      await user.click(screen.getByRole('button', { name: /save/i }))

      // Wait for errors to appear (form was submitted)
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })

      // onSubmit should not have been called with invalid data
      expect(onSubmit).not.toHaveBeenCalled()
    })
  })

  describe('isValid always reflects true state', () => {
    it('should update isValid on every change regardless of mode', async () => {
      const user = userEvent.setup()

      renderFn(
        <Form.Root schema={schema} mode="onBlur" onSubmit={() => {}}>
          {({ isValid }) => (
            <>
              <Form.Field name="email" label="Email">
                <Form.Input type="email" />
              </Form.Field>
              <button type="button" disabled={!isValid} data-testid="action-btn">
                Action
              </button>
            </>
          )}
        </Form.Root>,
      )

      const input = screen.getByLabelText(/email/i)
      const actionBtn = screen.getByTestId('action-btn')

      // Initially invalid (empty)
      expect(actionBtn).toBeDisabled()

      // Type valid email and blur to trigger onBlur validation
      await user.type(input, 'test@example.com')
      await user.tab()

      // Button enables after blur triggers revalidation
      await waitFor(() => {
        expect(actionBtn).not.toBeDisabled()
      })
    })
  })
})
