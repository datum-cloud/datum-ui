/// <reference types="@testing-library/jest-dom/vitest" />
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../collapsible'

function Example(props: React.ComponentProps<typeof Collapsible>) {
  return (
    <Collapsible {...props}>
      <CollapsibleTrigger>Toggle</CollapsibleTrigger>
      <CollapsibleContent className="p-4">
        <button type="button">Inside</button>
      </CollapsibleContent>
    </Collapsible>
  )
}

describe('collapsible', () => {
  it('keeps closed content mounted, inert and hidden so it takes no space', () => {
    const { container } = render(<Example />)
    const content = container.querySelector('[data-slot="collapsible-content"]')

    expect(content).not.toBeNull()
    expect(content).toHaveAttribute('data-state', 'closed')
    expect(content).toHaveAttribute('inert')
    expect(content).toHaveAttribute('hidden')
  })

  it('opens and closes from the trigger in uncontrolled mode', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    const { container } = render(<Example onOpenChange={onOpenChange} />)
    const content = () => container.querySelector('[data-slot="collapsible-content"]')

    await user.click(screen.getByRole('button', { name: 'Toggle' }))
    expect(onOpenChange).toHaveBeenLastCalledWith(true)
    expect(content()).toHaveAttribute('data-state', 'open')
    expect(content()).not.toHaveAttribute('inert')
    expect(content()).not.toHaveAttribute('hidden')

    await user.click(screen.getByRole('button', { name: 'Toggle' }))
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
    expect(content()).toHaveAttribute('data-state', 'closed')
    expect(content()).toHaveAttribute('inert')
    // Stays visible for the close animation, then hides.
    await waitFor(() => expect(content()).toHaveAttribute('hidden'))
  })

  it('follows a controlled open prop', () => {
    const { container, rerender } = render(<Example open={false} />)
    rerender(<Example open />)
    expect(container.querySelector('[data-slot="collapsible-content"]')).toHaveAttribute('data-state', 'open')
  })

  it('puts className on an inner wrapper so padding does not hold the box open', () => {
    const { container } = render(<Example defaultOpen />)
    const content = container.querySelector('[data-slot="collapsible-content"]')

    expect(content).not.toHaveClass('p-4')
    expect(content?.firstElementChild).toHaveClass('p-4')
  })

  it('falls back to Radix mount/unmount under a bare Radix root', () => {
    render(
      <CollapsiblePrimitive.Root>
        <CollapsibleContent>Hidden</CollapsibleContent>
      </CollapsiblePrimitive.Root>,
    )
    expect(screen.queryByText('Hidden')).toBeNull()
  })
})
