/// <reference types="@testing-library/jest-dom/vitest" />
import type { ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DataTableStoreContext, TableInstanceContext } from '../core/data-table-context'
import { createDataTableStore } from '../core/store'
import { CheckboxFilter } from '../filters/checkbox-filter'

const statusOptions = [
  { label: 'Running', value: 'running' },
  { label: 'Pending', value: 'pending' },
  { label: 'Stopped', value: 'stopped' },
]

const mockTable = {
  getCanNextPage: () => false,
  getCanPreviousPage: () => false,
  nextPage: vi.fn(),
  previousPage: vi.fn(),
  getPageCount: () => 1,
  getRowModel: () => ({ rows: [] }),
  getHeaderGroups: () => [],
  getAllColumns: () => [],
  getFilteredSelectedRowModel: () => ({ rows: [] }),
  getState: () => ({ pagination: { pageIndex: 0, pageSize: 20 } }),
  getFilteredRowModel: () => ({ rows: [] }),
} as any

function renderFilter(props: {
  readonly filters?: Record<string, unknown>
  readonly setFilter?: (...args: any[]) => void
  readonly clearFilter?: (...args: any[]) => void
}) {
  const { filters = {}, setFilter, clearFilter } = props

  const store = createDataTableStore<Record<string, unknown>>({ data: [], mode: 'client', defaultFilters: filters })

  if (setFilter) {
    vi.spyOn(store, 'setFilter').mockImplementation(setFilter as any)
  }
  if (clearFilter) {
    vi.spyOn(store, 'clearFilter').mockImplementation(clearFilter as any)
  }

  function Wrapper({ children }: { readonly children: ReactNode }) {
    return (
      <DataTableStoreContext value={store}>
        <TableInstanceContext value={mockTable}>
          {children}
        </TableInstanceContext>
      </DataTableStoreContext>
    )
  }

  return render(
    <Wrapper>
      <CheckboxFilter column="status" label="Status" options={statusOptions} />
    </Wrapper>,
  )
}

describe('checkboxFilter', () => {
  it('renders trigger button with label when no selection', () => {
    renderFilter({})

    expect(screen.getByRole('button', { name: /status/i })).toBeInTheDocument()
  })

  it('opens popover and shows checkbox options', async () => {
    const user = userEvent.setup()
    renderFilter({})

    await user.click(screen.getByRole('button', { name: /status/i }))

    expect(screen.getByText('Running')).toBeInTheDocument()
    expect(screen.getByText('Pending')).toBeInTheDocument()
    expect(screen.getByText('Stopped')).toBeInTheDocument()
  })

  it('calls setFilter when checkbox toggled', async () => {
    const setFilter = vi.fn()
    const user = userEvent.setup()
    renderFilter({ setFilter })

    await user.click(screen.getByRole('button', { name: /status/i }))
    await user.click(screen.getByText('Running'))

    expect(setFilter).toHaveBeenCalledWith('status', ['running'])
  })

  it('shows badges for selected values', async () => {
    const user = userEvent.setup()
    renderFilter({ filters: { status: ['running', 'pending'] } })

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
    renderFilter({ filters: { status: ['running', 'pending', 'stopped'] } })

    const trigger = screen.getByTestId('dt-filter-trigger')
    expect(trigger).toHaveTextContent('Running')
    expect(trigger).toHaveTextContent('Pending')
    expect(trigger).toHaveTextContent('+1 more')
  })

  it('calls clearFilter when Clear button is clicked', async () => {
    const clearFilter = vi.fn()
    const user = userEvent.setup()
    renderFilter({ filters: { status: ['running'] }, clearFilter })

    await user.click(screen.getByTestId('dt-filter-trigger'))
    await user.click(screen.getByText('Clear'))

    expect(clearFilter).toHaveBeenCalledWith('status')
  })
})
