import { resetViewport, setViewport } from '@test/viewport'
import { act, fireEvent, render, screen } from '@testing-library/react'
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

describe('autosearch — latest callbacks', () => {
  const DEBOUNCE_MS = 300
  const singleResult = [{ value: 'a', label: 'Alpha' }]

  afterEach(() => {
    vi.useRealTimers()
  })

  it('calls the latest onSearch when the debounce fires after the prop changed', () => {
    vi.useFakeTimers()
    const firstOnSearch = vi.fn()
    const secondOnSearch = vi.fn()
    const { rerender } = render(
      <Autosearch options={[]} placeholder="Search users" onSearch={firstOnSearch} searchDebounceMs={DEBOUNCE_MS} />,
    )

    fireEvent.change(screen.getByPlaceholderText('Search users'), { target: { value: 'al' } })
    // The parent swaps its handler while the debounce is still pending.
    rerender(
      <Autosearch options={[]} placeholder="Search users" onSearch={secondOnSearch} searchDebounceMs={DEBOUNCE_MS} />,
    )
    act(() => {
      vi.advanceTimersByTime(DEBOUNCE_MS)
    })

    expect(secondOnSearch).toHaveBeenCalledWith('al')
    expect(firstOnSearch).not.toHaveBeenCalled()
  })

  it('auto-selects a single result through the latest onValueChange', () => {
    vi.useFakeTimers()
    const firstOnValueChange = vi.fn()
    const secondOnValueChange = vi.fn()
    const { rerender } = render(
      <Autosearch options={[]} placeholder="Search users" onValueChange={firstOnValueChange} searchDebounceMs={DEBOUNCE_MS} />,
    )

    fireEvent.change(screen.getByPlaceholderText('Search users'), { target: { value: 'al' } })
    act(() => {
      vi.advanceTimersByTime(DEBOUNCE_MS)
    })
    // The parent swaps its handler (for example after a form reset), then the
    // search resolves with one result.
    rerender(
      <Autosearch options={[]} placeholder="Search users" onValueChange={secondOnValueChange} searchDebounceMs={DEBOUNCE_MS} />,
    )
    rerender(
      <Autosearch options={singleResult} placeholder="Search users" onValueChange={secondOnValueChange} searchDebounceMs={DEBOUNCE_MS} />,
    )

    expect(secondOnValueChange).toHaveBeenCalledWith('a')
    expect(firstOnValueChange).not.toHaveBeenCalled()
  })

  it('does not auto-select a single disabled result', () => {
    vi.useFakeTimers()
    const onValueChange = vi.fn()
    const { rerender } = render(
      <Autosearch options={[]} placeholder="Search users" onValueChange={onValueChange} searchDebounceMs={DEBOUNCE_MS} />,
    )

    fireEvent.change(screen.getByPlaceholderText('Search users'), { target: { value: 'al' } })
    act(() => {
      vi.advanceTimersByTime(DEBOUNCE_MS)
    })
    rerender(
      <Autosearch
        options={[{ value: 'a', label: 'Alpha', disabled: true }]}
        placeholder="Search users"
        onValueChange={onValueChange}
        searchDebounceMs={DEBOUNCE_MS}
      />,
    )

    expect(onValueChange).not.toHaveBeenCalled()
  })
})
