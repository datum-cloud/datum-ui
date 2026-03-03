/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Textarea } from '../textarea'

describe('textarea', () => {
  it('renders textarea with placeholder', () => {
    render(<Textarea placeholder="Write here" />)
    expect(screen.getByPlaceholderText('Write here')).toBeInTheDocument()
  })

  it('handles value changes', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Textarea onChange={handleChange} />)

    const textarea = screen.getByRole('textbox')
    await user.type(textarea, 'Some text')
    expect(handleChange).toHaveBeenCalled()
  })

  it('supports disabled state', () => {
    render(<Textarea disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('accepts controlled value', () => {
    render(<Textarea value="controlled value" readOnly />)
    expect(screen.getByRole('textbox')).toHaveValue('controlled value')
  })
})
