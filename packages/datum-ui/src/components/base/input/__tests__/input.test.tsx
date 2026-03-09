/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Input } from '../input'

describe('input', () => {
  it('renders input with placeholder', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('handles value changes via onChange', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'hello')
    expect(handleChange).toHaveBeenCalled()
  })

  it('accepts controlled value', () => {
    render(<Input value="controlled" readOnly />)
    expect(screen.getByRole('textbox')).toHaveValue('controlled')
  })

  it('supports disabled state', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('merges custom className', () => {
    render(<Input className="extra-class" />)
    expect(screen.getByRole('textbox')).toHaveClass('extra-class')
  })
})
