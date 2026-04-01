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

describe.each(adapters)('form.Autosearch ($name adapter)', ({ Adapter }) => {
  const mockOptions = [
    { value: '1', label: 'Option 1', description: 'First option' },
    { value: '2', label: 'Option 2', description: 'Second option' },
    { value: '3', label: 'Option 3' },
  ]

  it('renders with label and search input', () => {
    const schema = z.object({
      selectedOption: z.string(),
    })

    render(
      <Adapter>
        <Form.Root schema={schema} onSubmit={vi.fn()}>
          <Form.Field name="selectedOption" label="Search User">
            <Form.Autosearch
              options={mockOptions}
              placeholder="Type to search..."
            />
          </Form.Field>
        </Form.Root>
      </Adapter>,
    )

    expect(screen.getByText('Search User')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Type to search...')).toBeInTheDocument()
  })

  it('renders search input element', () => {
    const schema = z.object({
      query: z.string().optional(),
    })

    render(
      <Adapter>
        <Form.Root schema={schema} onSubmit={vi.fn()}>
          <Form.Field name="query">
            <Form.Autosearch
              options={mockOptions}
              placeholder="Search..."
            />
          </Form.Field>
        </Form.Root>
      </Adapter>,
    )

    const input = screen.getByPlaceholderText('Search...')
    expect(input).toBeInTheDocument()
    expect(input.tagName).toBe('INPUT')
  })
})
