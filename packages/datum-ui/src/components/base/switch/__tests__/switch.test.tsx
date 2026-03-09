/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Switch } from '../switch'

describe('switch', () => {
  it('renders a switch', () => {
    render(<Switch />)
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  it('toggles state on click (onCheckedChange called with true)', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Switch onCheckedChange={handleChange} />)

    await user.click(screen.getByRole('switch'))
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('supports disabled state', () => {
    render(<Switch disabled />)
    expect(screen.getByRole('switch')).toBeDisabled()
  })

  it('supports controlled checked state', () => {
    render(<Switch checked />)
    const switchEl = screen.getByRole('switch')
    expect(switchEl).toHaveAttribute('data-state', 'checked')
  })
})
