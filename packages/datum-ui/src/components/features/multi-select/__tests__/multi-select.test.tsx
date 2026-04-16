import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MultiSelect } from '../multi-select'

const opts = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
]

const originalInnerWidth = window.innerWidth
const originalMatchMedia = window.matchMedia

function setViewport(width: number) {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: width,
  })
  window.matchMedia = vi.fn().mockImplementation((query: string) => {
    const match = query.match(/min-width:\s*(\d+)px/)
    const min = match ? Number(match[1]) : 0
    return {
      matches: width >= min,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList
  })
}

/** Returns the trigger <button> (by data-slot, avoids the role=button wrapper on mobile) */
function getTrigger() {
  return document.querySelector<HTMLButtonElement>('[data-slot="multi-select-trigger"]')!
}

describe('multiSelect', () => {
  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: originalInnerWidth,
    })
    window.matchMedia = originalMatchMedia
  })

  it('renders the trigger with placeholder when no value is selected', () => {
    render(<MultiSelect options={opts} onValueChange={() => {}} placeholder="Pick fruit" />)
    expect(screen.getByRole('button', { name: /pick fruit/i })).toBeInTheDocument()
  })

  it('calls onValueChange when a value is toggled', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<MultiSelect options={opts} onValueChange={onValueChange} placeholder="Pick fruit" />)
    await user.click(screen.getByRole('button', { name: /pick fruit/i }))
    await user.click(screen.getByText('Apple'))
    expect(onValueChange).toHaveBeenCalledWith(['apple'])
  })

  it('shows selected values as badges', () => {
    render(
      <MultiSelect
        options={opts}
        onValueChange={() => {}}
        value={['apple', 'banana']}
        placeholder="Pick fruit"
      />,
    )
    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Banana')).toBeInTheDocument()
  })

  it('calls onValueChange with empty array when clear is triggered', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <MultiSelect
        options={opts}
        onValueChange={onValueChange}
        value={['apple']}
        placeholder="Pick fruit"
      />,
    )
    // Open popover — use data-slot trigger to avoid ambiguity
    await user.click(getTrigger())
    const clearBtn = screen.getByText('Clear')
    await user.click(clearBtn)
    expect(onValueChange).toHaveBeenCalledWith([])
  })

  it('renders mobile sheet heading on mobile viewport', async () => {
    setViewport(500)
    const user = userEvent.setup()
    render(
      <MultiSelect
        options={opts}
        onValueChange={() => {}}
        placeholder="Pick fruit"
        sheetTitle="Pick fruit"
      />,
    )
    // On mobile, ResponsivePopover wraps the trigger in a div[role=button].
    // Click via the data-slot trigger button directly.
    await user.click(getTrigger())
    expect(screen.getByRole('heading', { name: 'Pick fruit' })).toBeInTheDocument()
  })

  it('does not open a sheet on mobile when responsive is false', async () => {
    setViewport(500)
    const user = userEvent.setup()
    render(
      <MultiSelect
        options={opts}
        onValueChange={() => {}}
        placeholder="Pick fruit"
        responsive={false}
      />,
    )
    await user.click(getTrigger())
    expect(screen.queryByRole('heading', { name: /pick fruit/i })).not.toBeInTheDocument()
  })
})
