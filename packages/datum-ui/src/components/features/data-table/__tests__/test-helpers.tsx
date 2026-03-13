import type { RenderResult } from '@testing-library/react'
import type { ReactNode } from 'react'
import { render } from '@testing-library/react'
import { vi } from 'vitest'
import { DataTableStoreContext, TableInstanceContext } from '../core/data-table-context'
import { createDataTableStore } from '../core/store'

export const mockTable = {
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

export interface CreateTestStoreOptions {
  readonly filters?: Record<string, unknown>
  readonly search?: string
  readonly setFilter?: (...args: any[]) => void
  readonly clearFilter?: (...args: any[]) => void
  readonly clearAllFilters?: () => void
  readonly setSearch?: (...args: any[]) => void
  readonly clearSearch?: () => void
}

export function createTestStore(opts: CreateTestStoreOptions = {}) {
  const { filters = {} } = opts

  const store = createDataTableStore<Record<string, unknown>>({
    data: [],
    mode: 'client',
    defaultFilters: filters,
  })

  if (opts.search)
    store.setSearch(opts.search)
  if (opts.setFilter)
    vi.spyOn(store, 'setFilter').mockImplementation(opts.setFilter as any)
  if (opts.clearFilter)
    vi.spyOn(store, 'clearFilter').mockImplementation(opts.clearFilter as any)
  if (opts.clearAllFilters)
    vi.spyOn(store, 'clearAllFilters').mockImplementation(opts.clearAllFilters)
  if (opts.setSearch)
    vi.spyOn(store, 'setSearch').mockImplementation(opts.setSearch as any)
  if (opts.clearSearch)
    vi.spyOn(store, 'clearSearch').mockImplementation(opts.clearSearch)

  return store
}

export function renderWithStore(ui: ReactNode, opts: CreateTestStoreOptions = {}): RenderResult {
  const store = createTestStore(opts)

  function Wrapper({ children }: { readonly children: ReactNode }) {
    return (
      <DataTableStoreContext value={store}>
        <TableInstanceContext value={mockTable}>
          {children}
        </TableInstanceContext>
      </DataTableStoreContext>
    )
  }

  return render(ui, { wrapper: Wrapper })
}
