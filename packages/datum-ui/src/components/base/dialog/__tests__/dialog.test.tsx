/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Dialog } from '../dialog'

describe('dialog', () => {
  it('renders trigger', () => {
    render(
      <Dialog>
        <Dialog.Trigger>
          <button type="button">Open</button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Body>Content</Dialog.Body>
        </Dialog.Content>
      </Dialog>,
    )
    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument()
  })

  it('opens when trigger is clicked', async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <Dialog.Trigger>
          <button type="button">Open</button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Body>Dialog body content</Dialog.Body>
        </Dialog.Content>
      </Dialog>,
    )

    await user.click(screen.getByRole('button', { name: 'Open' }))

    await waitFor(() => {
      expect(screen.getByText('Dialog body content')).toBeInTheDocument()
    })
  })

  it('renders controlled open state', () => {
    render(
      <Dialog open>
        <Dialog.Content>
          <Dialog.Body>Controlled content</Dialog.Body>
        </Dialog.Content>
      </Dialog>,
    )
    expect(screen.getByText('Controlled content')).toBeInTheDocument()
  })

  it('calls onOpenChange when closed', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()

    render(
      <Dialog open onOpenChange={onOpenChange}>
        <Dialog.Content>
          <Dialog.Header title="Test Title" onClose={() => onOpenChange(false)} />
          <Dialog.Body>Body</Dialog.Body>
        </Dialog.Content>
      </Dialog>,
    )

    const closeButton = screen.getByRole('button')
    await user.click(closeButton)

    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('renders header with title, description, body, and footer', () => {
    render(
      <Dialog open>
        <Dialog.Content>
          <Dialog.Header title="My Title" description="My Description" />
          <Dialog.Body>Body content</Dialog.Body>
          <Dialog.Footer>
            <button type="button">Save</button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>,
    )

    expect(screen.getByText('My Title')).toBeInTheDocument()
    expect(screen.getByText('My Description')).toBeInTheDocument()
    expect(screen.getByText('Body content')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })
})
