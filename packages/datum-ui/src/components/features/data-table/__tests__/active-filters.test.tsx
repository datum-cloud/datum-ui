import type { ReactNode } from 'react'
/// <reference types="@testing-library/jest-dom/vitest" />
import type { ActiveFiltersProps } from '../types'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DataTableActiveFilters } from '../components/active-filters'
import { DataTableStoreContext, TableInstanceContext } from '../core/data-table-context'
import { createDataTableStore } from '../core/store'

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

interface RenderOpts {
  readonly filters?: Record<string, unknown>
  readonly search?: string
  readonly clearFilter?: (...args: any[]) => void
  readonly clearAllFilters?: () => void
  readonly clearSearch?: () => void
  readonly setFilter?: (...args: any[]) => void
  // Component props forwarded directly
  readonly props?: Partial<ActiveFiltersProps>
}

function renderActiveFilters(opts: RenderOpts = {}) {
  const { filters = {}, search = '', props = {} } = opts

  const store = createDataTableStore<Record<string, unknown>>({
    data: [],
    mode: 'client',
    defaultFilters: filters,
  })

  if (search)
    store.setSearch(search)
  if (opts.clearFilter)
    vi.spyOn(store, 'clearFilter').mockImplementation(opts.clearFilter as any)
  if (opts.clearAllFilters)
    vi.spyOn(store, 'clearAllFilters').mockImplementation(opts.clearAllFilters)
  if (opts.clearSearch)
    vi.spyOn(store, 'clearSearch').mockImplementation(opts.clearSearch)
  if (opts.setFilter)
    vi.spyOn(store, 'setFilter').mockImplementation(opts.setFilter as any)

  function Wrapper({ children }: { readonly children: ReactNode }) {
    return (
      <DataTableStoreContext value={store}>
        <TableInstanceContext value={mockTable}>
          {children}
        </TableInstanceContext>
      </DataTableStoreContext>
    )
  }

  return render(<DataTableActiveFilters {...props} />, { wrapper: Wrapper })
}

describe('dataTableActiveFilters', () => {
  it('renders nothing when no filters or search are active', () => {
    const { container } = renderActiveFilters()
    expect(container.querySelector('[data-slot="dt-active-filters"]')).toBeNull()
  })

  it('shows a grouped box for a select filter', () => {
    renderActiveFilters({
      filters: { status: 'active' },
      props: { filterLabels: { status: 'Status' } },
    })

    expect(screen.getByTestId('dt-active-filters')).toBeInTheDocument()
    expect(screen.getByText('Selected Filters')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('active')).toBeInTheDocument()
  })

  it('shows grouped badges for array (checkbox) filters', () => {
    renderActiveFilters({
      filters: { department: ['engineering', 'sales'] },
      props: { filterLabels: { department: 'Department' } },
    })

    expect(screen.getByText('Department')).toBeInTheDocument()
    expect(screen.getByText('engineering')).toBeInTheDocument()
    expect(screen.getByText('sales')).toBeInTheDocument()
    expect(screen.getAllByTestId('dt-filter-group')).toHaveLength(1)
  })

  it('shows search group when search is active', () => {
    renderActiveFilters({ search: 'hello' })

    expect(screen.getByText('Search')).toBeInTheDocument()
    expect(screen.getByText('hello')).toBeInTheDocument()
  })

  it('calls clearFilter when removing a select filter badge', async () => {
    const user = userEvent.setup()
    const clearFilter = vi.fn()

    renderActiveFilters({
      filters: { status: 'active' },
      clearFilter,
      props: { filterLabels: { status: 'Status' } },
    })

    await user.click(screen.getByLabelText('Clear Status filter'))
    expect(clearFilter).toHaveBeenCalledWith('status')
  })

  it('removes individual value from array filter', async () => {
    const user = userEvent.setup()
    const setFilter = vi.fn()

    renderActiveFilters({
      filters: { department: ['engineering', 'sales'] },
      setFilter,
      props: { filterLabels: { department: 'Department' } },
    })

    await user.click(screen.getByLabelText('Remove engineering from Department'))
    expect(setFilter).toHaveBeenCalledWith('department', ['sales'])
  })

  it('calls clearFilter when removing last array value', async () => {
    const user = userEvent.setup()
    const clearFilter = vi.fn()

    renderActiveFilters({
      filters: { department: ['engineering'] },
      clearFilter,
      props: { filterLabels: { department: 'Department' } },
    })

    await user.click(screen.getByLabelText('Remove engineering from Department'))
    expect(clearFilter).toHaveBeenCalledWith('department')
  })

  it('calls clearSearch when removing search badge', async () => {
    const user = userEvent.setup()
    const clearSearch = vi.fn()

    renderActiveFilters({ search: 'hello', clearSearch })

    await user.click(screen.getByLabelText('Clear search'))
    expect(clearSearch).toHaveBeenCalled()
  })

  it('shows clear-all X icon when multiple filter groups are active', () => {
    renderActiveFilters({
      filters: { status: 'active', department: ['engineering'] },
      props: { filterLabels: { status: 'Status', department: 'Department' } },
    })

    expect(screen.getByTestId('dt-clear-all-filters')).toBeInTheDocument()
  })

  it('does not show clear-all with only one filter group', () => {
    renderActiveFilters({ filters: { status: 'active' } })

    expect(screen.queryByTestId('dt-clear-all-filters')).toBeNull()
  })

  it('calls clearAllFilters and clearSearch when clicking clear-all', async () => {
    const user = userEvent.setup()
    const clearAllFilters = vi.fn()
    const clearSearch = vi.fn()

    renderActiveFilters({
      filters: { status: 'active' },
      search: 'hello',
      clearAllFilters,
      clearSearch,
    })

    await user.click(screen.getByTestId('dt-clear-all-filters'))
    expect(clearAllFilters).toHaveBeenCalled()
    expect(clearSearch).toHaveBeenCalled()
  })

  it('uses formatFilterValue when provided', () => {
    renderActiveFilters({
      filters: { status: 'active' },
      props: {
        filterLabels: { status: 'Status' },
        formatFilterValue: (_col, val) => String(val).toUpperCase(),
      },
    })

    expect(screen.getByText('ACTIVE')).toBeInTheDocument()
  })

  it('falls back to column key when filterLabels not provided', () => {
    renderActiveFilters({ filters: { status: 'active' } })

    expect(screen.getByText('status')).toBeInTheDocument()
  })

  // ── Customization tests ──

  describe('label customization', () => {
    it('uses custom label text', () => {
      renderActiveFilters({
        filters: { status: 'active' },
        props: { label: 'Active Filters' },
      })

      expect(screen.getByText('Active Filters')).toBeInTheDocument()
      expect(screen.queryByText('Selected Filters')).toBeNull()
    })

    it('hides label when set to null', () => {
      renderActiveFilters({
        filters: { status: 'active' },
        props: { label: null },
      })

      expect(screen.getByTestId('dt-active-filters')).toBeInTheDocument()
      expect(screen.queryByText('Selected Filters')).toBeNull()
      expect(screen.queryByText(/data-slot="dt-active-filters-label"/)).toBeNull()
    })
  })

  describe('clearAll variants', () => {
    it('renders icon mode by default with title tooltip', () => {
      renderActiveFilters({
        filters: { status: 'active', department: ['eng'] },
      })

      const btn = screen.getByTestId('dt-clear-all-filters')
      expect(btn).toHaveAttribute('title', 'Clear all')
    })

    it('renders button mode with label', () => {
      renderActiveFilters({
        filters: { status: 'active', department: ['eng'] },
        props: { clearAll: 'button', clearAllLabel: 'Reset' },
      })

      const btn = screen.getByTestId('dt-clear-all-filters')
      expect(btn).toHaveTextContent('Reset')
    })

    it('renders text mode with label', () => {
      renderActiveFilters({
        filters: { status: 'active', department: ['eng'] },
        props: { clearAll: 'text', clearAllLabel: 'Clear filters' },
      })

      const btn = screen.getByTestId('dt-clear-all-filters')
      expect(btn).toHaveTextContent('Clear filters')
    })

    it('uses default "Clear all" label when clearAllLabel not set', () => {
      renderActiveFilters({
        filters: { status: 'active', department: ['eng'] },
        props: { clearAll: 'text' },
      })

      expect(screen.getByTestId('dt-clear-all-filters')).toHaveTextContent('Clear all')
    })
  })

  describe('data-slot attributes', () => {
    it('has data-slot on root container', () => {
      const { container } = renderActiveFilters({ filters: { status: 'active' } })
      expect(container.querySelector('[data-slot="dt-active-filters"]')).toBeInTheDocument()
    })

    it('has data-slot on label', () => {
      const { container } = renderActiveFilters({ filters: { status: 'active' } })
      expect(container.querySelector('[data-slot="dt-active-filters-label"]')).toBeInTheDocument()
    })

    it('has data-slot on filter groups', () => {
      const { container } = renderActiveFilters({ filters: { status: 'active' } })
      expect(container.querySelector('[data-slot="dt-filter-group"]')).toBeInTheDocument()
    })

    it('has data-slot on clear-all button', () => {
      const { container } = renderActiveFilters({
        filters: { status: 'active', department: ['eng'] },
      })
      expect(container.querySelector('[data-slot="dt-clear-all-filters"]')).toBeInTheDocument()
    })
  })

  describe('className props', () => {
    it('applies groupClassName to filter groups', () => {
      renderActiveFilters({
        filters: { status: 'active' },
        props: { groupClassName: 'custom-group' },
      })

      const group = screen.getByTestId('dt-filter-group')
      expect(group.className).toContain('custom-group')
    })

    it('applies badgeClassName to badges', () => {
      renderActiveFilters({
        filters: { status: 'active' },
        props: { badgeClassName: 'custom-badge' },
      })

      // Badge is inside the filter group, after the label span
      const group = screen.getByTestId('dt-filter-group')
      const badge = group.querySelector('.custom-badge')
      expect(badge).toBeInTheDocument()
    })

    it('applies className to root container', () => {
      renderActiveFilters({
        filters: { status: 'active' },
        props: { className: 'custom-root' },
      })

      const root = screen.getByTestId('dt-active-filters')
      expect(root.className).toContain('custom-root')
    })
  })
})
