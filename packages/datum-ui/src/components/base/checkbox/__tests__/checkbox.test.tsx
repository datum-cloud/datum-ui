/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Checkbox } from '../checkbox'

describe('checkbox', () => {
  it('renders a checkbox', () => {
    render(<Checkbox />)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('toggles checked state on click (onCheckedChange called with true)', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Checkbox onCheckedChange={handleChange} />)

    await user.click(screen.getByRole('checkbox'))
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('supports disabled state', () => {
    render(<Checkbox disabled />)
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })

  it('supports controlled checked state', () => {
    render(<Checkbox checked />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('data-state', 'checked')
  })

  it('toggles uncontrolled state on click', async () => {
    const user = userEvent.setup()
    render(<Checkbox />)
    const checkbox = screen.getByRole('checkbox')

    await user.click(checkbox)
    expect(checkbox).toHaveAttribute('data-state', 'checked')
    await user.click(checkbox)
    expect(checkbox).toHaveAttribute('data-state', 'unchecked')
  })

  it('keeps the indicator mounted while unchecked so it can animate out', () => {
    const { container } = render(<Checkbox />)
    expect(container.querySelector('[data-slot="checkbox-indicator"] svg')).not.toBeNull()
  })

  it('renders the indeterminate state', () => {
    render(<Checkbox checked="indeterminate" />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('data-state', 'indeterminate')
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed')
  })
})
