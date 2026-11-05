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

  it('renders state glyphs inside the thumb so on/off is not carried by position alone', () => {
    const { container } = render(<Switch checked={false} />)
    const thumb = container.querySelector('[data-slot="switch-thumb"]')

    expect(thumb).not.toBeNull()
    expect(thumb?.querySelectorAll('svg')).toHaveLength(2)
  })

  it('keeps the glyphs decorative so assistive tech reads aria-checked instead', () => {
    const { container } = render(<Switch checked />)

    for (const icon of container.querySelectorAll('[data-slot="switch-thumb"] svg')) {
      expect(icon).toHaveAttribute('aria-hidden')
    }
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('toggles uncontrolled state on click', async () => {
    const user = userEvent.setup()
    render(<Switch defaultChecked />)
    const switchEl = screen.getByRole('switch')

    await user.click(switchEl)
    expect(switchEl).toHaveAttribute('aria-checked', 'false')
    await user.click(switchEl)
    expect(switchEl).toHaveAttribute('aria-checked', 'true')
  })

  it('still calls pointer handlers passed by the consumer', async () => {
    const user = userEvent.setup()
    const onPointerDown = vi.fn()
    render(<Switch onPointerDown={onPointerDown} />)

    await user.click(screen.getByRole('switch'))
    expect(onPointerDown).toHaveBeenCalled()
  })
})
