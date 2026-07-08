import { resetViewport, setViewport } from '@test/viewport'
/// <reference types="@testing-library/jest-dom/vitest" />
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CheckboxFilter } from '../filters/checkbox-filter'
import { renderWithStore } from './test-helpers'

const statusOptions = [
  { label: 'Running', value: 'running' },
  { label: 'Pending', value: 'pending' },
  { label: 'Stopped', value: 'stopped' },
]

/** MultiSelect trigger renders as role="button" with the label/placeholder text */
function getTrigger() {
  return screen.getByRole('button', { name: /status/i })
}

describe('checkboxFilter', () => {
  afterEach(() => {
    resetViewport()
  })

  it('renders trigger button with label when no selection', () => {
    renderWithStore(
      <CheckboxFilter column="status" label="Status" options={statusOptions} />,
    )
    expect(getTrigger()).toBeInTheDocument()
  })

  it('opens popover and shows options', async () => {
    const user = userEvent.setup()
    renderWithStore(
      <CheckboxFilter column="status" label="Status" options={statusOptions} />,
    )
    await user.click(getTrigger())
    expect(screen.getByText('Running')).toBeInTheDocument()
    expect(screen.getByText('Pending')).toBeInTheDocument()
    expect(screen.getByText('Stopped')).toBeInTheDocument()
  })

  it('calls setFilter when option toggled', async () => {
    const setFilter = vi.fn()
    const user = userEvent.setup()
    renderWithStore(
      <CheckboxFilter column="status" label="Status" options={statusOptions} />,
      { setFilter },
    )
    await user.click(getTrigger())
    await user.click(screen.getByText('Running'))
    expect(setFilter).toHaveBeenCalledWith('status', ['running'])
  })

  it('shows badges for selected values', () => {
    renderWithStore(
      <CheckboxFilter column="status" label="Status" options={statusOptions} />,
      { filters: { status: ['running', 'pending'] } },
    )
    // MultiSelect renders badges in the trigger
    expect(screen.getByText('Running')).toBeInTheDocument()
    expect(screen.getByText('Pending')).toBeInTheDocument()
  })

  it('shows +N more when selections exceed maxCount', () => {
    renderWithStore(
      <CheckboxFilter column="status" label="Status" options={statusOptions} />,
      { filters: { status: ['running', 'pending', 'stopped'] } },
    )
    expect(screen.getByText('Running')).toBeInTheDocument()
    expect(screen.getByText('Pending')).toBeInTheDocument()
    expect(screen.getByText(/\+ 1 more/)).toBeInTheDocument()
  })

  it('coerces a scalar (string) filter value into a selected badge without crashing', () => {
    // URL hydration can set filters.status to a bare string instead of string[].
    renderWithStore(
      <CheckboxFilter column="status" label="Status" options={statusOptions} />,
      { filters: { status: 'running' } },
    )
    expect(screen.getByText('Running')).toBeInTheDocument()
  })

  it('renders as mobile sheet on narrow viewport', async () => {
    setViewport(375)
    const user = userEvent.setup()
    renderWithStore(
      <CheckboxFilter
        column="status"
        label="Status"
        options={statusOptions}
        sheetTitle="Filter by Status"
      />,
    )
    await user.click(getTrigger())
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Filter by Status' })).toBeInTheDocument()
  })
})
