/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../dropdown'

describe('dropdown', () => {
  it('renders the trigger', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button">Open Menu</button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    expect(screen.getByText('Open Menu')).toBeInTheDocument()
  })

  it('opens menu on trigger click', async () => {
    const user = userEvent.setup()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button">Open Menu</button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuItem>Item 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )

    await user.click(screen.getByText('Open Menu'))

    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
    })
  })

  it('calls onClick on menu item click', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button">Open Menu</button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleClick}>Clickable Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )

    await user.click(screen.getByText('Open Menu'))

    await waitFor(() => {
      expect(screen.getByText('Clickable Item')).toBeInTheDocument()
    })

    await user.click(screen.getByText('Clickable Item'))
    expect(handleClick).toHaveBeenCalledOnce()
  })
})
