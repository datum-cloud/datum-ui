/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { InputNumber } from '../input-number'

describe('inputNumber', () => {
  it('renders an input element', () => {
    render(<InputNumber placeholder="Enter number" />)

    expect(screen.getByPlaceholderText('Enter number')).toBeInTheDocument()
  })

  it('renders stepper buttons', () => {
    render(<InputNumber />)

    expect(screen.getByRole('button', { name: 'Increase value' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Decrease value' })).toBeInTheDocument()
  })

  it('increments value when up button clicked', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<InputNumber defaultValue={5} onValueChange={onValueChange} />)

    await user.click(screen.getByRole('button', { name: 'Increase value' }))

    expect(onValueChange).toHaveBeenCalledWith(6)
  })

  it('decrements value when down button clicked', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<InputNumber defaultValue={5} onValueChange={onValueChange} />)

    await user.click(screen.getByRole('button', { name: 'Decrease value' }))

    expect(onValueChange).toHaveBeenCalledWith(4)
  })

  it('does not go below min', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<InputNumber defaultValue={0} min={0} onValueChange={onValueChange} />)

    const decreaseButton = screen.getByRole('button', { name: 'Decrease value' })
    expect(decreaseButton).toBeDisabled()

    await user.click(decreaseButton)

    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('does not go above max', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<InputNumber defaultValue={10} max={10} onValueChange={onValueChange} />)

    const increaseButton = screen.getByRole('button', { name: 'Increase value' })
    expect(increaseButton).toBeDisabled()

    await user.click(increaseButton)

    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('displays controlled value', () => {
    render(<InputNumber value={42} />)

    expect(screen.getByDisplayValue('42')).toBeInTheDocument()
  })
})
