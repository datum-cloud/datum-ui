/// <reference types="@testing-library/jest-dom/vitest" />
import type { ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DataTableStoreContext, TableInstanceContext } from '../core/data-table-context'
import { createDataTableStore } from '../core/store'
import { SelectFilter } from '../filters/select-filter'

const statusOptions = [
  { label: 'Running', value: 'running' },
  { label: 'Pending', value: 'pending' },
  { label: 'Failed', value: 'failed' },
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

function renderWithProvider(
  ui: ReactNode,
  overrides: {
    readonly filters?: Record<string, unknown>
    readonly setFilter?: (...args: any[]) => void
    readonly clearFilter?: (...args: any[]) => void
  } = {},
) {
  const { filters = {}, setFilter, clearFilter } = overrides

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

  return render(<Wrapper>{ui}</Wrapper>)
}

describe('selectFilter', () => {
  it('renders trigger button with label', () => {
    renderWithProvider(
      <SelectFilter column="status" label="Status" options={statusOptions} />,
    )

    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('renders trigger button with custom placeholder', () => {
    renderWithProvider(
      <SelectFilter column="status" label="Status" options={statusOptions} placeholder="Pick one" />,
    )

    expect(screen.getByText('Pick one')).toBeInTheDocument()
  })

  it('shows popover with options on click', async () => {
    const user = userEvent.setup()

    renderWithProvider(
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

    renderWithProvider(
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

    renderWithProvider(
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

    renderWithProvider(
      <SelectFilter column="status" label="Status" options={statusOptions} />,
    )

    await user.click(screen.getByRole('combobox'))

    expect(screen.getByPlaceholderText('Search status...')).toBeInTheDocument()
  })

  it('hides search input when searchable is false', async () => {
    const user = userEvent.setup()

    renderWithProvider(
      <SelectFilter column="status" label="Status" options={statusOptions} searchable={false} />,
    )

    await user.click(screen.getByRole('combobox'))

    expect(screen.queryByPlaceholderText('Search status...')).not.toBeInTheDocument()
  })
})
