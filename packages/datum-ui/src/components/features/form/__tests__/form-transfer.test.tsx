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

describe.each(adapters)('form.Transfer ($name adapter)', ({ Adapter }) => {
  const mockItems = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
    { id: '3', name: 'Item 3' },
  ]

  it('renders with label', () => {
    const schema = z.object({
      selectedItems: z.array(z.string()),
    })

    render(
      <Adapter>
        <Form.Root schema={schema} onSubmit={vi.fn()}>
          <Form.Field name="selectedItems" label="Selected Items">
            <Form.Transfer
              items={mockItems}
              itemKey="id"
              itemLabel="name"
            />
          </Form.Field>
        </Form.Root>
      </Adapter>,
    )

    expect(screen.getByText('Selected Items')).toBeInTheDocument()
  })

  it('shows min/max constraints hint', () => {
    const schema = z.object({
      teams: z.array(z.string()).min(2).max(5),
    })

    render(
      <Adapter>
        <Form.Root schema={schema} onSubmit={vi.fn()}>
          <Form.Field name="teams" label="Select Teams">
            <Form.Transfer
              items={mockItems}
              itemKey="id"
              itemLabel="name"
              minItems={2}
              maxItems={5}
            />
          </Form.Field>
        </Form.Root>
      </Adapter>,
    )

    expect(screen.getByText('Select Teams')).toBeInTheDocument()
    expect(screen.getByText(/between 2 and 5/i)).toBeInTheDocument()
  })
})
