/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { RadioGroup, RadioGroupItem } from '../radio-group'

describe('radioGroup', () => {
  it('renders radio items', () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="a" />
        <RadioGroupItem value="b" />
      </RadioGroup>,
    )
    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(2)
  })

  it('selects the default value (data-state="checked")', () => {
    render(
      <RadioGroup defaultValue="b">
        <RadioGroupItem value="a" />
        <RadioGroupItem value="b" />
      </RadioGroup>,
    )
    const radios = screen.getAllByRole('radio')
    expect(radios.at(0)).toHaveAttribute('data-state', 'unchecked')
    expect(radios.at(1)).toHaveAttribute('data-state', 'checked')
  })

  it('calls onValueChange when selection changes', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(
      <RadioGroup defaultValue="a" onValueChange={handleChange}>
        <RadioGroupItem value="a" />
        <RadioGroupItem value="b" />
      </RadioGroup>,
    )

    const secondRadio = screen.getAllByRole('radio').at(1)!
    await user.click(secondRadio)
    expect(handleChange).toHaveBeenCalledWith('b')
  })
})
