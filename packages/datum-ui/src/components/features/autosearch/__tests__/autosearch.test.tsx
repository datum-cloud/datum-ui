import { resetViewport, setViewport } from '@test/viewport'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Autosearch } from '../autosearch'

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma' },
]

describe('autosearch — responsive', () => {
  afterEach(() => {
    resetViewport()
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
