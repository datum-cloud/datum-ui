import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { ConformAdapter } from '../adapters/conform'
import { Form } from '../index'

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
})

function renderWithConform(ui: React.ReactNode) {
  return render(<ConformAdapter>{ui}</ConformAdapter>)
}

describe('conform adapter', () => {
  it('renders a form with ConformAdapter', () => {
    renderWithConform(
      <Form.Root schema={schema} onSubmit={() => {}}>
        <Form.Field name="email" label="Email">
          <Form.Input type="email" />
        </Form.Field>
        <Form.Submit>Save</Form.Submit>
      </Form.Root>,
    )

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
  })

  it('calls onSubmit with valid data', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    renderWithConform(
      <Form.Root schema={schema} onSubmit={onSubmit}>
        <Form.Field name="email" label="Email">
          <Form.Input type="email" />
        </Form.Field>
        <Form.Field name="name" label="Name">
          <Form.Input />
        </Form.Field>
        <Form.Submit>Save</Form.Submit>
      </Form.Root>,
    )

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/name/i), 'John')
    await user.click(screen.getByRole('button', { name: /save/i }))

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'test@example.com', name: 'John' }),
    )
  })

  it('displays validation errors for invalid data', async () => {
    const user = userEvent.setup()

    renderWithConform(
      <Form.Root schema={schema} onSubmit={() => {}}>
        <Form.Field name="email" label="Email">
          <Form.Input type="email" />
        </Form.Field>
        <Form.Submit>Save</Form.Submit>
      </Form.Root>,
    )

    await user.click(screen.getByRole('button', { name: /save/i }))

    // Conform should display validation errors
    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })

  it('renders checkbox with native boolean value', () => {
    const checkSchema = z.object({ agree: z.boolean() })

    renderWithConform(
      <Form.Root schema={checkSchema} onSubmit={() => {}}>
        <Form.Field name="agree" label="Agreement">
          <Form.Checkbox label="I agree" />
        </Form.Field>
        <Form.Submit>Save</Form.Submit>
      </Form.Root>,
    )

    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })
})
