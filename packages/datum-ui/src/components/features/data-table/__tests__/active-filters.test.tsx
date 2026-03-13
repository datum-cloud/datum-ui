/// <reference types="@testing-library/jest-dom/vitest" />
import type { ActiveFiltersProps } from '../types'
import type { CreateTestStoreOptions } from './test-helpers'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DataTableActiveFilters } from '../components/active-filters'
import { renderWithStore } from './test-helpers'

interface RenderOpts extends CreateTestStoreOptions {
  readonly props?: Partial<ActiveFiltersProps>
}

function renderActiveFilters(opts: RenderOpts = {}) {
  const { props = {}, ...storeOpts } = opts
  return renderWithStore(<DataTableActiveFilters {...props} />, storeOpts)
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
        formatFilterValue: {
          status: (value: string) => value.toUpperCase(),
        },
      },
    })

    expect(screen.getByText('ACTIVE')).toBeInTheDocument()
  })

  it('falls back to String(value) for columns without a formatter', () => {
    renderActiveFilters({
      filters: { status: 'active', department: 'engineering' },
      props: {
        filterLabels: { status: 'Status', department: 'Department' },
        formatFilterValue: {
          status: (value: string) => value.toUpperCase(),
        },
      },
    })

    expect(screen.getByText('ACTIVE')).toBeInTheDocument()
    expect(screen.getByText('engineering')).toBeInTheDocument()
  })

  it('supports dot-notation keys in formatFilterValue', () => {
    renderActiveFilters({
      filters: { 'status.approval': 'Pending' },
      props: {
        filterLabels: { 'status.approval': 'Approval' },
        formatFilterValue: {
          'status.approval': (value: string) => `[${value}]`,
        },
      },
    })

    expect(screen.getByText('[Pending]')).toBeInTheDocument()
  })

  it('falls back to column key when filterLabels not provided', () => {
    renderActiveFilters({ filters: { status: 'active' } })

    expect(screen.getByText('status')).toBeInTheDocument()
  })

  // ── Exclude filters ──

  describe('excludeFilters', () => {
    it('hides excluded filter keys from display', () => {
      renderActiveFilters({
        filters: { status: 'active', department: ['engineering'] },
        props: {
          excludeFilters: ['status'],
          filterLabels: { status: 'Status', department: 'Department' },
        },
      })

      expect(screen.queryByText('Status')).toBeNull()
      expect(screen.getByText('Department')).toBeInTheDocument()
      expect(screen.getByText('engineering')).toBeInTheDocument()
    })

    it('hides multiple excluded filter keys', () => {
      renderActiveFilters({
        filters: { status: 'active', department: ['engineering'], role: 'admin' },
        props: {
          excludeFilters: ['status', 'role'],
          filterLabels: { status: 'Status', department: 'Department', role: 'Role' },
        },
      })

      expect(screen.queryByText('Status')).toBeNull()
      expect(screen.queryByText('Role')).toBeNull()
      expect(screen.getByText('Department')).toBeInTheDocument()
    })

    it('renders nothing when all filters are excluded and no search', () => {
      const { container } = renderActiveFilters({
        filters: { status: 'active' },
        props: { excludeFilters: ['status'] },
      })

      expect(container.querySelector('[data-slot="dt-active-filters"]')).toBeNull()
    })

    it('still shows search when all filters are excluded', () => {
      renderActiveFilters({
        filters: { status: 'active' },
        search: 'hello',
        props: { excludeFilters: ['status'] },
      })

      expect(screen.getByText('Search')).toBeInTheDocument()
      expect(screen.getByText('hello')).toBeInTheDocument()
      expect(screen.queryByText('status')).toBeNull()
    })

    it('does not affect clear-all group count', () => {
      renderActiveFilters({
        filters: { status: 'active', department: ['engineering'], role: 'admin' },
        props: {
          excludeFilters: ['status'],
          filterLabels: { department: 'Department', role: 'Role' },
        },
      })

      // 2 visible groups (department + role), so clear-all should appear
      expect(screen.getByTestId('dt-clear-all-filters')).toBeInTheDocument()
    })

    it('hides search badge when "search" is in excludeFilters', () => {
      renderActiveFilters({
        filters: { status: 'active' },
        search: 'hello',
        props: {
          excludeFilters: ['search'],
          filterLabels: { status: 'Status' },
        },
      })

      expect(screen.queryByText('Search')).toBeNull()
      expect(screen.queryByText('hello')).toBeNull()
      expect(screen.getByText('Status')).toBeInTheDocument()
    })

    it('renders nothing when all filters and search are excluded', () => {
      const { container } = renderActiveFilters({
        filters: { status: 'active' },
        search: 'hello',
        props: { excludeFilters: ['status', 'search'] },
      })

      expect(container.querySelector('[data-slot="dt-active-filters"]')).toBeNull()
    })
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
