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

  it('keeps every dot mounted so selection can animate between items', () => {
    const { container } = render(
      <RadioGroup defaultValue="a">
        <RadioGroupItem value="a" />
        <RadioGroupItem value="b" />
      </RadioGroup>,
    )
    expect(container.querySelectorAll('[data-slot="radio-group-indicator"]')).toHaveLength(2)
  })

  it('moves the selection in uncontrolled mode', async () => {
    const user = userEvent.setup()
    render(
      <RadioGroup defaultValue="a">
        <RadioGroupItem value="a" />
        <RadioGroupItem value="b" />
      </RadioGroup>,
    )
    const radios = screen.getAllByRole('radio')
    await user.click(radios.at(1)!)
    expect(radios.at(0)).toHaveAttribute('data-state', 'unchecked')
    expect(radios.at(1)).toHaveAttribute('data-state', 'checked')
  })

  it('follows a controlled value', () => {
    const { rerender } = render(
      <RadioGroup value="a">
        <RadioGroupItem value="a" />
        <RadioGroupItem value="b" />
      </RadioGroup>,
    )
    rerender(
      <RadioGroup value="b">
        <RadioGroupItem value="a" />
        <RadioGroupItem value="b" />
      </RadioGroup>,
    )
    expect(screen.getAllByRole('radio').at(1)).toHaveAttribute('data-state', 'checked')
  })
})
