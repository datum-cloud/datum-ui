import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Autosearch } from '../autosearch'

const originalInnerWidth = window.innerWidth
const originalMatchMedia = window.matchMedia

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma' },
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

describe('autosearch — responsive', () => {
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
      <Autosearch
        options={options}
        placeholder="Search users"
        onSearch={vi.fn()}
      />,
    )
    const input = screen.getByPlaceholderText('Search users')
    await userEvent.type(input, 'a')
    expect(screen.getByRole('heading', { name: 'Search users' })).toBeInTheDocument()
  })

  it('uses sheetTitle over placeholder for mobile sheet heading', async () => {
    setViewport(500)
    render(
      <Autosearch
        options={options}
        placeholder="Search users"
        sheetTitle="Find a user"
        onSearch={vi.fn()}
      />,
    )
    const input = screen.getByPlaceholderText('Search users')
    await userEvent.type(input, 'a')
    expect(screen.getByRole('heading', { name: 'Find a user' })).toBeInTheDocument()
  })

  it('stays as popover when responsive={false}', async () => {
    setViewport(500)
    render(
      <Autosearch
        options={options}
        placeholder="Search users"
        responsive={false}
        onSearch={vi.fn()}
      />,
    )
    const input = screen.getByPlaceholderText('Search users')
    await userEvent.type(input, 'a')
    expect(screen.queryByRole('heading', { name: 'Search users' })).not.toBeInTheDocument()
  })
})
