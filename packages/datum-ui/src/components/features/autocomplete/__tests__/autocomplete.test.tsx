import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Autocomplete } from '../autocomplete'

const originalInnerWidth = window.innerWidth
const originalMatchMedia = window.matchMedia

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
]

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

describe('autocomplete — responsive', () => {
  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: originalInnerWidth,
    })
    window.matchMedia = originalMatchMedia
  })

  it('renders mobile sheet heading on mobile viewport', async () => {
    setViewport(500)
    render(
      <Autocomplete
        options={options}
        placeholder="Search items"
      />,
    )
    await userEvent.click(screen.getByRole('combobox'))
    expect(screen.getByRole('heading', { name: 'Search items' })).toBeInTheDocument()
  })

  it('stays as popover when responsive={false}', async () => {
    setViewport(500)
    render(
      <Autocomplete
        options={options}
        placeholder="Search items"
        responsive={false}
      />,
    )
    await userEvent.click(screen.getByRole('combobox'))
    expect(screen.queryByRole('heading', { name: 'Search items' })).not.toBeInTheDocument()
  })
})
