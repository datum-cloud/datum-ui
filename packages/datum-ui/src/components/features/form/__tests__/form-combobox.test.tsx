import type { AutocompleteOption } from '../../autocomplete/autocomplete.types'
/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { ConformAdapter } from '../adapters/conform'
import { RHFAdapter } from '../adapters/rhf'
import { Form } from '../index'

type ComboboxOption = AutocompleteOption

const items: ComboboxOption[] = [
  { value: '1', label: 'Item 1' },
  { value: '2', label: 'Item 2' },
  { value: '3', label: 'Item 3' },
]

const adapters = [
  { name: 'Conform', Adapter: ConformAdapter },
  { name: 'RHF', Adapter: RHFAdapter },
]

describe.each(adapters)('form.Combobox ($name adapter)', ({ Adapter }) => {
  it('renders with label', () => {
    const schema = z.object({
      selectedItem: z.string(),
    })

    render(
      <Adapter>
        <Form.Root schema={schema} onSubmit={vi.fn()}>
          <Form.Field name="selectedItem" label="Select Item">
            <Form.Combobox options={items} placeholder="Choose an item" />
          </Form.Field>
        </Form.Root>
      </Adapter>,
    )

    expect(screen.getByText('Select Item')).toBeInTheDocument()
  })

  it('renders with placeholder', () => {
    const schema = z.object({
      selectedItem: z.string(),
    })

    render(
      <Adapter>
        <Form.Root schema={schema} onSubmit={vi.fn()}>
          <Form.Field name="selectedItem">
            <Form.Combobox options={items} placeholder="Choose an item" />
          </Form.Field>
        </Form.Root>
      </Adapter>,
    )

    expect(screen.getByText('Choose an item')).toBeInTheDocument()
  })
})
