/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { ConformAdapter } from '../adapters/conform'
import { RHFAdapter } from '../adapters/rhf'
import { Form } from '../index'

const adapters = [
  { name: 'Conform', Adapter: ConformAdapter },
  { name: 'RHF', Adapter: RHFAdapter },
]

describe.each(adapters)('form.DateTimePicker ($name adapter)', ({ Adapter }) => {
  it('renders with label', () => {
    const schema = z.object({
      scheduledAt: z.string().optional(),
    })

    render(
      <Adapter>
        <Form.Root schema={schema} onSubmit={vi.fn()}>
          <Form.Field name="scheduledAt" label="Scheduled At">
            <Form.DateTimePicker />
          </Form.Field>
        </Form.Root>
      </Adapter>,
    )

    expect(screen.getByText('Scheduled At')).toBeInTheDocument()
  })

  it('shows error message when validation fails on submit', async () => {
    const user = userEvent.setup()
    const schema = z.object({
      appointmentTime: z.string().min(1, 'Required'),
    })

    render(
      <Adapter>
        <Form.Root schema={schema} onSubmit={vi.fn()}>
          <Form.Field name="appointmentTime" label="Appointment Time">
            <Form.DateTimePicker />
          </Form.Field>
          <Form.Submit>Submit</Form.Submit>
        </Form.Root>
      </Adapter>,
    )

    await user.click(screen.getByRole('button', { name: /submit/i }))
    const alert = await screen.findByRole('alert')
    expect(alert).toBeInTheDocument()
  })
})
