/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Sheet } from '../sheet'

describe('sheet', () => {
  it('renders the trigger', () => {
    render(
      <Sheet>
        <Sheet.Trigger asChild>
          <button type="button">Open Sheet</button>
        </Sheet.Trigger>
        <Sheet.Content>
          <Sheet.Header>
            <Sheet.Title>Sheet Title</Sheet.Title>
          </Sheet.Header>
          <p>Sheet body content</p>
        </Sheet.Content>
      </Sheet>,
    )
    expect(screen.getByText('Open Sheet')).toBeInTheDocument()
  })

  it('opens when trigger is clicked', async () => {
    const user = userEvent.setup()
    render(
      <Sheet>
        <Sheet.Trigger asChild>
          <button type="button">Open Sheet</button>
        </Sheet.Trigger>
        <Sheet.Content>
          <Sheet.Header>
            <Sheet.Title>Sheet Title</Sheet.Title>
          </Sheet.Header>
          <p>Sheet body content</p>
        </Sheet.Content>
      </Sheet>,
    )

    await user.click(screen.getByText('Open Sheet'))

    await waitFor(() => {
      expect(screen.getByText('Sheet body content')).toBeInTheDocument()
    })
  })

  it('renders in controlled open state', () => {
    render(
      <Sheet open>
        <Sheet.Trigger asChild>
          <button type="button">Open Sheet</button>
        </Sheet.Trigger>
        <Sheet.Content>
          <Sheet.Header>
            <Sheet.Title>Sheet Title</Sheet.Title>
          </Sheet.Header>
          <p>Controlled content</p>
        </Sheet.Content>
      </Sheet>,
    )
    expect(screen.getByText('Controlled content')).toBeInTheDocument()
  })
})
