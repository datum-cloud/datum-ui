/// <reference types="@testing-library/jest-dom/vitest" />
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CheckboxFilter } from '../filters/checkbox-filter'
import { renderWithStore } from './test-helpers'

const statusOptions = [
  { label: 'Running', value: 'running' },
  { label: 'Pending', value: 'pending' },
  { label: 'Stopped', value: 'stopped' },
]

describe('checkboxFilter', () => {
  it('renders trigger button with label when no selection', () => {
    renderWithStore(
      <CheckboxFilter column="status" label="Status" options={statusOptions} />,
    )

    expect(screen.getByRole('button', { name: /status/i })).toBeInTheDocument()
  })

  it('opens popover and shows checkbox options', async () => {
    const user = userEvent.setup()
    renderWithStore(
      <CheckboxFilter column="status" label="Status" options={statusOptions} />,
    )

    await user.click(screen.getByRole('button', { name: /status/i }))

    expect(screen.getByText('Running')).toBeInTheDocument()
    expect(screen.getByText('Pending')).toBeInTheDocument()
    expect(screen.getByText('Stopped')).toBeInTheDocument()
  })

  it('calls setFilter when checkbox toggled', async () => {
    const setFilter = vi.fn()
    const user = userEvent.setup()
    renderWithStore(
      <CheckboxFilter column="status" label="Status" options={statusOptions} />,
      { setFilter },
    )

    await user.click(screen.getByRole('button', { name: /status/i }))
    await user.click(screen.getByText('Running'))

    expect(setFilter).toHaveBeenCalledWith('status', ['running'])
  })

  it('shows badges for selected values', async () => {
    const user = userEvent.setup()
    renderWithStore(
      <CheckboxFilter column="status" label="Status" options={statusOptions} />,
      { filters: { status: ['running', 'pending'] } },
    )

    const trigger = screen.getByTestId('dt-filter-trigger')
    expect(trigger).toHaveTextContent('Running')
    expect(trigger).toHaveTextContent('Pending')

    // Open popover and verify checkboxes are checked
    await user.click(trigger)
    const runningCheckbox = screen.getByRole('checkbox', { name: 'Running' })
    const pendingCheckbox = screen.getByRole('checkbox', { name: 'Pending' })
    expect(runningCheckbox).toBeChecked()
    expect(pendingCheckbox).toBeChecked()
  })

  it('shows +N more when selections exceed MAX_VISIBLE_BADGES', () => {
    renderWithStore(
      <CheckboxFilter column="status" label="Status" options={statusOptions} />,
      { filters: { status: ['running', 'pending', 'stopped'] } },
    )

    const trigger = screen.getByTestId('dt-filter-trigger')
    expect(trigger).toHaveTextContent('Running')
    expect(trigger).toHaveTextContent('Pending')
    expect(trigger).toHaveTextContent('+1 more')
  })

  it('calls clearFilter when Clear button is clicked', async () => {
    const clearFilter = vi.fn()
    const user = userEvent.setup()
    renderWithStore(
      <CheckboxFilter column="status" label="Status" options={statusOptions} />,
      { filters: { status: ['running'] }, clearFilter },
    )

    await user.click(screen.getByTestId('dt-filter-trigger'))
    await user.click(screen.getByText('Clear'))

    expect(clearFilter).toHaveBeenCalledWith('status')
  })

  it('renders trigger as disabled when disabled prop is true', () => {
    renderWithStore(
      <CheckboxFilter column="status" label="Status" options={statusOptions} disabled />,
    )

    expect(screen.getByTestId('dt-filter-trigger')).toBeDisabled()
  })
})
