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

  it('clamps to min on blur without a ref without throwing (BUG-047)', async () => {
    const user = userEvent.setup()
    render(<InputNumber min={10} placeholder="Enter number" />)

    const input = screen.getByPlaceholderText('Enter number')
    await user.type(input, '5')
    // Blur by tabbing away — must not throw despite no ref prop.
    await user.tab()

    expect(screen.getByDisplayValue('10')).toBeInTheDocument()
  })

  it('does not step below min from an empty value (BUG-163)', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<InputNumber min={0} onValueChange={onValueChange} />)

    await user.click(screen.getByRole('button', { name: 'Decrease value' }))

    expect(onValueChange).not.toHaveBeenCalledWith(-1)
    expect(screen.queryByDisplayValue('-1')).not.toBeInTheDocument()
  })

  it('updates the displayed value on increment when uncontrolled', async () => {
    const user = userEvent.setup()
    render(<InputNumber defaultValue={5} />)

    await user.click(screen.getByRole('button', { name: 'Increase value' }))

    // Uncontrolled: the component owns the value, so the display advances.
    expect(screen.getByDisplayValue('6')).toBeInTheDocument()
  })

  it('emits on increment but leaves the display for the parent when controlled', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<InputNumber value={5} onValueChange={onValueChange} />)

    await user.click(screen.getByRole('button', { name: 'Increase value' }))

    // Controlled: parent owns the value; the display stays until `value` changes.
    expect(onValueChange).toHaveBeenCalledWith(6)
    expect(screen.getByDisplayValue('5')).toBeInTheDocument()
  })

  it('reflects a controlled value update from the parent', () => {
    const { rerender } = render(<InputNumber value={5} placeholder="Amount" />)
    expect(screen.getByDisplayValue('5')).toBeInTheDocument()

    rerender(<InputNumber value={9} placeholder="Amount" />)
    expect(screen.getByDisplayValue('9')).toBeInTheDocument()
  })

  it('clears the display when a controlled value becomes undefined (BUG-075)', () => {
    const { rerender } = render(<InputNumber value={7} placeholder="Amount" />)
    expect(screen.getByDisplayValue('7')).toBeInTheDocument()

    rerender(<InputNumber value={undefined} placeholder="Amount" />)
    expect(screen.getByPlaceholderText('Amount')).toHaveValue('')
  })
})
