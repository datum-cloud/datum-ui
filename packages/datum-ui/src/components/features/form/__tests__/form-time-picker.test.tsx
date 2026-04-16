/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { ConformAdapter } from '../adapters/conform'
import { RHFAdapter } from '../adapters/rhf'
import { Form } from '../index'

const adapters = [
  { name: 'Conform', Adapter: ConformAdapter },
  { name: 'RHF', Adapter: RHFAdapter },
]

describe.each(adapters)('form.TimePicker ($name adapter)', ({ Adapter }) => {
  it('renders with label', () => {
    const schema = z.object({
      time: z.string().optional(),
    })

    render(
      <Adapter>
        <Form.Root schema={schema} onSubmit={vi.fn()}>
          <Form.Field name="time" label="Time">
            <Form.TimePicker />
          </Form.Field>
        </Form.Root>
      </Adapter>,
    )

    expect(screen.getByText('Time')).toBeInTheDocument()
  })

  it('renders time input element', () => {
    const schema = z.object({
      appointmentTime: z.string().optional(),
    })

    render(
      <Adapter>
        <Form.Root schema={schema} onSubmit={vi.fn()}>
          <Form.Field name="appointmentTime" label="Appointment Time">
            <Form.TimePicker placeholder="Select time" />
          </Form.Field>
        </Form.Root>
      </Adapter>,
    )

    // TimePicker now renders a combobox trigger button instead of <input type="time">
    const trigger = screen.getByRole('combobox')
    expect(trigger).toBeInTheDocument()
  })
})
