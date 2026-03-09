/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { InputWithAddons } from '../input-with-addons'

describe('inputWithAddons', () => {
  it('renders an input element', () => {
    render(<InputWithAddons placeholder="Type here" />)

    expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument()
  })

  it('renders leading addon', () => {
    render(<InputWithAddons leading={<span>$</span>} placeholder="Amount" />)

    expect(screen.getByText('$')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Amount')).toBeInTheDocument()
  })

  it('renders trailing addon', () => {
    render(<InputWithAddons trailing={<span>kg</span>} placeholder="Weight" />)

    expect(screen.getByText('kg')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Weight')).toBeInTheDocument()
  })

  it('handles value changes', async () => {
    const user = userEvent.setup()
    render(<InputWithAddons placeholder="Type here" />)

    const input = screen.getByPlaceholderText('Type here')
    await user.type(input, 'Hello')

    expect(input).toHaveValue('Hello')
  })

  it('supports disabled state', () => {
    render(<InputWithAddons placeholder="Disabled" disabled />)

    expect(screen.getByPlaceholderText('Disabled')).toBeDisabled()
  })

  it('applies containerClassName to wrapper', () => {
    const { container } = render(
      <InputWithAddons containerClassName="custom-wrapper" placeholder="Test" />,
    )

    const wrapper = container.firstElementChild
    expect(wrapper).toHaveClass('custom-wrapper')
  })
})
