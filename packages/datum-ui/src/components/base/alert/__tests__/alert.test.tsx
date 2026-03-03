/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Alert, AlertDescription, AlertTitle } from '../alert'

describe('alert', () => {
  it('renders with role="alert"', () => {
    render(<Alert>Content</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(<Alert>Alert content</Alert>)
    expect(screen.getByText('Alert content')).toBeInTheDocument()
  })

  describe('variants', () => {
    const variants = [
      'default',
      'secondary',
      'outline',
      'destructive',
      'success',
      'info',
      'warning',
    ] as const

    it.each(variants)('renders variant=%s without error', (variant) => {
      render(<Alert variant={variant}>{variant}</Alert>)
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  it('does not show close button by default', () => {
    render(<Alert>No close</Alert>)
    expect(screen.queryByRole('button', { name: 'Close alert' })).not.toBeInTheDocument()
  })

  it('shows close button when closable=true', () => {
    render(<Alert closable>Closable</Alert>)
    expect(screen.getByRole('button', { name: 'Close alert' })).toBeInTheDocument()
  })

  it('hides alert when close button clicked (uncontrolled)', async () => {
    const user = userEvent.setup()
    render(<Alert closable>Dismissible</Alert>)

    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Close alert' }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('calls onClose when close button clicked', async () => {
    const user = userEvent.setup()
    const handleClose = vi.fn()
    render(
      <Alert closable onClose={handleClose}>
        Callback
      </Alert>,
    )

    await user.click(screen.getByRole('button', { name: 'Close alert' }))
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('supports keyboard close (Enter key)', async () => {
    const user = userEvent.setup()
    render(<Alert closable>Keyboard close</Alert>)

    const closeBtn = screen.getByRole('button', { name: 'Close alert' })
    closeBtn.focus()
    await user.keyboard('{Enter}')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})

describe('alertTitle', () => {
  it('renders text', () => {
    render(<AlertTitle>My Title</AlertTitle>)
    expect(screen.getByText('My Title')).toBeInTheDocument()
  })
})

describe('alertDescription', () => {
  it('renders text', () => {
    render(<AlertDescription>My description</AlertDescription>)
    expect(screen.getByText('My description')).toBeInTheDocument()
  })
})
