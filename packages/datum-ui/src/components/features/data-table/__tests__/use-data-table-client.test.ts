import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useDataTableClient } from '../hooks/use-data-table-client'

interface TestRow {
  id: string
  name: string
  status: string
}

const testData: TestRow[] = [
  { id: '1', name: 'Pod A', status: 'running' },
  { id: '2', name: 'Pod B', status: 'pending' },
  { id: '3', name: 'Pod C', status: 'running' },
]

const testColumns = [
  { accessorKey: 'name' as const, header: 'Name' },
  { accessorKey: 'status' as const, header: 'Status' },
]

describe('useDataTableClient', () => {
  it('returns initial state with defaults', () => {
    const { result } = renderHook(() =>
      useDataTableClient({ data: testData, columns: testColumns }),
    )

    const state = result.current.store.getSnapshot()
    expect(state.data).toEqual(testData)
    expect(state.sorting).toEqual([])
    expect(state.filters).toEqual({})
    expect(state.search).toBe('')
    expect(state.rowSelection).toEqual({})
    expect(state.pageIndex).toBe(0)
    expect(state.pageSize).toBe(20)
  })

  it('updates sorting state', () => {
    const { result } = renderHook(() =>
      useDataTableClient({ data: testData, columns: testColumns }),
    )

    act(() => {
      result.current.store.setSorting([{ id: 'name', desc: false }])
    })

    expect(result.current.store.getSnapshot().sorting).toEqual([{ id: 'name', desc: false }])
  })

  it('manages filter state immutably', () => {
    const { result } = renderHook(() =>
      useDataTableClient({ data: testData, columns: testColumns }),
    )

    act(() => {
      result.current.store.setFilter('status', 'running')
    })

    expect(result.current.store.getSnapshot().filters).toEqual({ status: 'running' })

    act(() => {
      result.current.store.clearFilter('status')
    })

    expect(result.current.store.getSnapshot().filters).toEqual({})
  })

  it('manages search state', () => {
    const { result } = renderHook(() =>
      useDataTableClient({ data: testData, columns: testColumns }),
    )

    act(() => {
      result.current.store.setSearch('Pod A')
    })

    expect(result.current.store.getSnapshot().search).toBe('Pod A')

    act(() => {
      result.current.store.clearSearch()
    })

    expect(result.current.store.getSnapshot().search).toBe('')
  })

  it('manages pagination state', () => {
    const { result } = renderHook(() =>
      useDataTableClient({ data: testData, columns: testColumns, pageSize: 2 }),
    )

    expect(result.current.store.getSnapshot().pageSize).toBe(2)
    expect(result.current.store.getSnapshot().pageIndex).toBe(0)

    act(() => {
      result.current.store.setPageIndex(1)
    })

    expect(result.current.store.getSnapshot().pageIndex).toBe(1)
  })

  it('respects defaultSort and defaultFilters', () => {
    const { result } = renderHook(() =>
      useDataTableClient({
        data: testData,
        columns: testColumns,
        defaultSort: [{ id: 'name', desc: true }],
        defaultFilters: { status: 'running' },
      }),
    )

    const state = result.current.store.getSnapshot()
    expect(state.sorting).toEqual([{ id: 'name', desc: true }])
    expect(state.filters).toEqual({ status: 'running' })
  })

  it('clears all filters', () => {
    const { result } = renderHook(() =>
      useDataTableClient({
        data: testData,
        columns: testColumns,
        defaultFilters: { status: 'running', name: 'Pod' },
      }),
    )

    act(() => {
      result.current.store.clearAllFilters()
    })

    expect(result.current.store.getSnapshot().filters).toEqual({})
  })

  it('reads initial state from stateAdapter on mount', () => {
    const adapter = {
      read: () => ({
        sorting: [{ id: 'name', desc: true }],
        filters: { status: 'running' },
        search: 'test',
      }),
      write: () => {},
    }

    const { result } = renderHook(() =>
      useDataTableClient({
        data: testData,
        columns: testColumns,
        stateAdapter: adapter,
      }),
    )

    // Adapter hydration happens in a mount effect, so state should be synced
    const state = result.current.store.getSnapshot()
    expect(state.sorting).toEqual([{ id: 'name', desc: true }])
    expect(state.filters).toEqual({ status: 'running' })
    expect(state.search).toBe('test')
  })

  // Regression test for a bug that shipped past every store-only test: the
  // store clamps pageIndex and preserves rowSelection correctly, but the
  // real TanStack table has its own autoResetPageIndex behavior that (left
  // at its default) undoes the clamp a tick after setData runs, and that
  // reset routes through onPaginationChange into store.setPagination, which
  // also clears rowSelection. A test that only calls store methods directly
  // — never building a table instance, never reading getRowModel() — cannot
  // observe this: the store's own state is briefly correct and only TanStack
  // stomps on it asynchronously. This test builds the real table via
  // useDataTableClient, forces the row model to actually compute (which is
  // what triggers TanStack's onAfterUpdate reset hooks), and flushes the
  // microtask queue those hooks are scheduled on before asserting.
  it('preserves pageIndex and rowSelection through a real setData against the TanStack table', async () => {
    const getRowId = (row: TestRow) => row.id
    const { result } = renderHook(() =>
      useDataTableClient({ data: testData, columns: testColumns, pageSize: 1, getRowId }),
    )

    // First read establishes the row model baseline. table-core's
    // onAfterUpdate reset hooks skip their first run (see skipFirstRun in
    // @tanstack/table-core/utils.js) so this must happen before the state
    // under test is set, or the very first read would look like a "change".
    act(() => {
      result.current.table.getRowModel()
    })

    act(() => {
      // 3 rows at pageSize 1 -> pages 0..2. Page 2 is a real, non-zero page.
      result.current.store.setPageIndex(2)
      result.current.store.setRowSelection({ 1: true })
    })
    act(() => {
      result.current.table.getRowModel()
    })
    expect(result.current.store.getSnapshot().pageIndex).toBe(2)
    expect(result.current.store.getSnapshot().rowSelection).toEqual({ 1: true })

    // A real background data update — same row ids, changed field — the
    // exact scenario this feature exists for (a websocket / K8s watch tick).
    act(() => {
      result.current.store.setData(testData.map(row => ({ ...row, status: 'updated' })))
    })
    act(() => {
      // Forces the paginated -> core row model chain to recompute against
      // the new data reference. This is what actually invokes table-core's
      // onAfterUpdate hooks — merely calling store.setData does not, since
      // the table only recomputes lazily when a row model getter is read.
      result.current.table.getRowModel()
    })

    // TanStack schedules those reset hooks via queueMicrotask (see
    // @tanstack/table-core's renderPhaseReactivity), so nothing runs
    // synchronously with the getRowModel() call above. Flush the microtask
    // queue, and a macrotask tick for good measure, before asserting.
    await act(async () => {
      await Promise.resolve()
      await Promise.resolve()
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.store.getSnapshot().pageIndex).toBe(2)
    expect(result.current.store.getSnapshot().rowSelection).toEqual({ 1: true })
  })
})
