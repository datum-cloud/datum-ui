import { resetViewport, setViewport } from '@test/viewport'
/// <reference types="@testing-library/jest-dom/vitest" />
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SelectFilter } from '../filters/select-filter'
import { renderWithStore } from './test-helpers'

const statusOptions = [
  { label: 'Running', value: 'running' },
  { label: 'Pending', value: 'pending' },
  { label: 'Failed', value: 'failed' },
]

describe('selectFilter', () => {
  afterEach(() => {
    resetViewport()
  })

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

  it('renders selected value label in the trigger', () => {
    renderWithStore(
      <SelectFilter column="status" label="Status" options={statusOptions} />,
      { filters: { status: 'running' } },
    )
    expect(screen.getByText('Running')).toBeInTheDocument()
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

  it('renders with custom sheetTitle prop without error', () => {
    renderWithStore(
      <SelectFilter
        column="status"
        label="Status"
        options={statusOptions}
        sheetTitle="Filter by Status"
      />,
    )

    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('uses label as sheetTitle fallback when sheetTitle is not provided', () => {
    renderWithStore(
      <SelectFilter column="status" label="Status" options={statusOptions} />,
    )

    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('renders as mobile sheet on narrow viewport', async () => {
    setViewport(375)
    const user = userEvent.setup()
    renderWithStore(
      <SelectFilter
        column="status"
        label="Status"
        options={statusOptions}
        sheetTitle="Filter by Status"
      />,
    )

    await user.click(screen.getByRole('combobox'))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Filter by Status' })).toBeInTheDocument()
  })

  it('stays as popover when responsive=false on narrow viewport', async () => {
    setViewport(375)
    const user = userEvent.setup()
    renderWithStore(
      <SelectFilter
        column="status"
        label="Status"
        options={statusOptions}
        responsive={false}
      />,
    )

    await user.click(screen.getByRole('combobox'))

    expect(screen.getByText('Running')).toBeInTheDocument()
  })
})
