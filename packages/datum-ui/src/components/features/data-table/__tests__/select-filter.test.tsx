/// <reference types="@testing-library/jest-dom/vitest" />
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SelectFilter } from '../filters/select-filter'
import { renderWithStore } from './test-helpers'

const statusOptions = [
  { label: 'Running', value: 'running' },
  { label: 'Pending', value: 'pending' },
  { label: 'Failed', value: 'failed' },
]

describe('selectFilter', () => {
  it('renders trigger button with label', () => {
    renderWithStore(
      <SelectFilter column="status" label="Status" options={statusOptions} />,
    )

    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('renders trigger button with custom placeholder', () => {
    renderWithStore(
      <SelectFilter column="status" label="Status" options={statusOptions} placeholder="Pick one" />,
    )

    expect(screen.getByText('Pick one')).toBeInTheDocument()
  })

  it('shows popover with options on click', async () => {
    const user = userEvent.setup()

    renderWithStore(
      <SelectFilter column="status" label="Status" options={statusOptions} />,
    )

    await user.click(screen.getByRole('combobox'))

    expect(screen.getByText('Running')).toBeInTheDocument()
    expect(screen.getByText('Pending')).toBeInTheDocument()
    expect(screen.getByText('Failed')).toBeInTheDocument()
  })

  it('selects an option and closes popover', async () => {
    const user = userEvent.setup()
    const setFilter = vi.fn()

    renderWithStore(
      <SelectFilter column="status" label="Status" options={statusOptions} />,
      { setFilter },
    )

    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByText('Running'))

    expect(setFilter).toHaveBeenCalledWith('status', 'running')
  })

  it('shows clear button when value is set', async () => {
    const user = userEvent.setup()
    const clearFilter = vi.fn()

    renderWithStore(
      <SelectFilter column="status" label="Status" options={statusOptions} />,
      { filters: { status: 'running' }, clearFilter },
    )

    // The selected label should be shown
    expect(screen.getByText('Running')).toBeInTheDocument()

    // Click the clear button (X icon)
    const clearButton = screen.getByRole('button', { name: /clear status filter/i })
    await user.click(clearButton)

    expect(clearFilter).toHaveBeenCalledWith('status')
  })

  it('shows search input when searchable is true (default)', async () => {
    const user = userEvent.setup()

    renderWithStore(
      <SelectFilter column="status" label="Status" options={statusOptions} />,
    )

    await user.click(screen.getByRole('combobox'))

    expect(screen.getByPlaceholderText('Search status...')).toBeInTheDocument()
  })

  it('hides search input when searchable is false', async () => {
    const user = userEvent.setup()

    renderWithStore(
      <SelectFilter column="status" label="Status" options={statusOptions} searchable={false} />,
    )

    await user.click(screen.getByRole('combobox'))

    expect(screen.queryByPlaceholderText('Search status...')).not.toBeInTheDocument()
  })

  it('renders trigger as disabled when disabled prop is true', () => {
    renderWithStore(
      <SelectFilter column="status" label="Status" options={statusOptions} disabled />,
    )

    expect(screen.getByRole('combobox')).toBeDisabled()
  })
})
