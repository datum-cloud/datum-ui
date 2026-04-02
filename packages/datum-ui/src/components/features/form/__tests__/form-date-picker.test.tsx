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

describe.each(adapters)('form.DatePicker ($name adapter)', ({ Adapter }) => {
  it('renders with label', () => {
    const schema = z.object({
      startDate: z.date(),
    })

    render(
      <Adapter>
        <Form.Root schema={schema} onSubmit={vi.fn()}>
          <Form.Field name="startDate" label="Start Date">
            <Form.DatePicker />
          </Form.Field>
        </Form.Root>
      </Adapter>,
    )

    expect(screen.getByText('Start Date')).toBeInTheDocument()
  })

  it('shows error message when validation fails on submit', async () => {
    const user = userEvent.setup()
    const schema = z.object({
      birthDate: z.string().min(1, 'Date is required'),
    })

    render(
      <Adapter>
        <Form.Root schema={schema} onSubmit={vi.fn()}>
          <Form.Field name="birthDate" label="Birth Date">
            <Form.DatePicker />
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
