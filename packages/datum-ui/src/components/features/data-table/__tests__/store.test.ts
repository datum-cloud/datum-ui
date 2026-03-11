import { describe, expect, it, vi } from 'vitest'
import { createDataTableStore } from '../core/store'

const sampleData = [
  { id: '1', name: 'Alice', department: 'Engineering', status: 'active' },
  { id: '2', name: 'Bob', department: 'Design', status: 'inactive' },
  { id: '3', name: 'Charlie', department: 'Engineering', status: 'active' },
]

describe('createDataTableStore', () => {
  it('creates store with initial state', () => {
    const store = createDataTableStore({ data: sampleData, mode: 'client' })
    const state = store.getSnapshot()
    expect(state.data).toBe(sampleData)
    expect(state.filteredData).toBe(sampleData)
    expect(state.sorting).toEqual([])
    expect(state.filters).toEqual({})
    expect(state.search).toBe('')
    expect(state.rowSelection).toEqual({})
    expect(state.pageIndex).toBe(0)
    expect(state.pageSize).toBe(20)
    expect(state.mode).toBe('client')
    expect(state.isLoading).toBe(false)
    expect(state.error).toBeNull()
    expect(state.inlineContents).toEqual([])
  })

  it('uses default sort and filters from options', () => {
    const store = createDataTableStore({
      data: sampleData,
      mode: 'client',
      defaultSort: [{ id: 'name', desc: false }],
      defaultFilters: { status: 'active' },
      pageSize: 10,
    })
    const state = store.getSnapshot()
    expect(state.sorting).toEqual([{ id: 'name', desc: false }])
    expect(state.filters).toEqual({ status: 'active' })
    expect(state.pageSize).toBe(10)
  })
})

describe('store actions', () => {
  it('setSorting updates sorting and resets rowSelection', () => {
    const store = createDataTableStore({ data: sampleData, mode: 'client' })
    store.setRowSelection({ 1: true })
    store.setSorting([{ id: 'name', desc: true }])
    const state = store.getSnapshot()
    expect(state.sorting).toEqual([{ id: 'name', desc: true }])
    expect(state.rowSelection).toEqual({})
  })

  it('setFilter updates filters and recomputes filteredData', () => {
    const store = createDataTableStore({ data: sampleData, mode: 'client' })
    store.registerFilter('department', 'checkbox')
    store.setFilter('department', ['Engineering'])
    const state = store.getSnapshot()
    expect(state.filters).toEqual({ department: ['Engineering'] })
    expect(state.filteredData).toHaveLength(2)
    expect(state.rowSelection).toEqual({})
  })

  it('clearFilter removes a single filter', () => {
    const store = createDataTableStore({ data: sampleData, mode: 'client' })
    store.registerFilter('department', 'checkbox')
    store.registerFilter('status', 'select')
    store.setFilter('department', ['Engineering'])
    store.setFilter('status', 'active')
    store.clearFilter('department')
    const state = store.getSnapshot()
    expect(state.filters).toEqual({ status: 'active' })
  })

  it('clearAllFilters removes all filters', () => {
    const store = createDataTableStore({ data: sampleData, mode: 'client' })
    store.setFilter('department', ['Engineering'])
    store.setFilter('status', 'active')
    store.clearAllFilters()
    expect(store.getSnapshot().filters).toEqual({})
  })

  it('setSearch updates search and resets rowSelection + pageIndex', () => {
    const store = createDataTableStore({
      data: sampleData,
      mode: 'client',
      searchableColumns: ['name'],
    })
    store.setPageIndex(2)
    store.setRowSelection({ 1: true })
    store.setSearch('alice')
    const state = store.getSnapshot()
    expect(state.search).toBe('alice')
    expect(state.filteredData).toHaveLength(1)
    expect(state.rowSelection).toEqual({})
    expect(state.pageIndex).toBe(0)
  })

  it('setPageIndex updates pageIndex and resets rowSelection', () => {
    const store = createDataTableStore({ data: sampleData, mode: 'client' })
    store.setRowSelection({ 1: true })
    store.setPageIndex(3)
    const state = store.getSnapshot()
    expect(state.pageIndex).toBe(3)
    expect(state.rowSelection).toEqual({})
  })

  it('setPageSize updates pageSize, resets pageIndex and rowSelection', () => {
    const store = createDataTableStore({ data: sampleData, mode: 'client' })
    store.setPageIndex(2)
    store.setRowSelection({ 1: true })
    store.setPageSize(50)
    const state = store.getSnapshot()
    expect(state.pageSize).toBe(50)
    expect(state.pageIndex).toBe(0)
    expect(state.rowSelection).toEqual({})
  })

  it('setData updates data, recomputes filteredData, and resets pageIndex', () => {
    const store = createDataTableStore({ data: sampleData, mode: 'client' })
    store.registerFilter('department', 'checkbox')
    store.setFilter('department', ['Design'])
    store.setPageIndex(2)
    expect(store.getSnapshot().filteredData).toHaveLength(1)

    const newData = [...sampleData, { id: '4', name: 'Diana', department: 'Design', status: 'pending' }]
    store.setData(newData)
    expect(store.getSnapshot().filteredData).toHaveLength(2)
    expect(store.getSnapshot().pageIndex).toBe(0)
    expect(store.getSnapshot().rowSelection).toEqual({})
  })

  it('setRowSelection does NOT reset rowSelection', () => {
    const store = createDataTableStore({ data: sampleData, mode: 'client' })
    store.setRowSelection({ 1: true, 2: true })
    expect(store.getSnapshot().rowSelection).toEqual({ 1: true, 2: true })
  })

  it('setLoading and setError update loading state', () => {
    const store = createDataTableStore({ data: [], mode: 'server' })
    store.setLoading(true)
    expect(store.getSnapshot().isLoading).toBe(true)
    store.setError(new Error('fetch failed'))
    expect(store.getSnapshot().error?.message).toBe('fetch failed')
    store.setLoading(false)
    expect(store.getSnapshot().isLoading).toBe(false)
  })
})

describe('store subscriptions', () => {
  it('notifies subscribers on state change', () => {
    const store = createDataTableStore({ data: sampleData, mode: 'client' })
    const listener = vi.fn()
    store.subscribe(listener)
    store.setSorting([{ id: 'name', desc: true }])
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('unsubscribe stops notifications', () => {
    const store = createDataTableStore({ data: sampleData, mode: 'client' })
    const listener = vi.fn()
    const unsub = store.subscribe(listener)
    unsub()
    store.setSorting([{ id: 'name', desc: true }])
    expect(listener).not.toHaveBeenCalled()
  })

  it('notifies even when value is unchanged (no dedup at store level)', () => {
    const store = createDataTableStore({ data: sampleData, mode: 'client' })
    const listener = vi.fn()
    store.subscribe(listener)
    store.setSorting([])
    expect(listener).toHaveBeenCalledTimes(1)
  })
})

describe('filter registration', () => {
  it('registerFilter affects filteredData computation', () => {
    const store = createDataTableStore({ data: sampleData, mode: 'client' })
    store.setFilter('department', ['Engineering'])
    expect(store.getSnapshot().filteredData).toHaveLength(3)

    store.registerFilter('department', 'checkbox')
    expect(store.getSnapshot().filteredData).toHaveLength(2)
  })

  it('unregisterFilter removes strategy and recomputes', () => {
    const store = createDataTableStore({ data: sampleData, mode: 'client' })
    store.registerFilter('department', 'checkbox')
    store.setFilter('department', ['Engineering'])
    expect(store.getSnapshot().filteredData).toHaveLength(2)

    store.unregisterFilter('department')
    expect(store.getSnapshot().filteredData).toHaveLength(3)
  })
})

describe('inline content', () => {
  it('registerInlineContent adds entry', () => {
    const store = createDataTableStore({ data: sampleData, mode: 'client' })
    const entry = {
      id: 'test-1',
      position: 'top' as const,
      open: true,
      onClose: vi.fn(),
      render: () => null,
    }
    store.registerInlineContent(entry)
    expect(store.getSnapshot().inlineContents).toHaveLength(1)
    expect(store.getSnapshot().inlineContents[0]!.id).toBe('test-1')
  })

  it('registerInlineContent updates existing entry by id', () => {
    const store = createDataTableStore({ data: sampleData, mode: 'client' })
    store.registerInlineContent({
      id: 'test-1',
      position: 'top' as const,
      open: true,
      onClose: vi.fn(),
      render: () => null,
    })
    store.registerInlineContent({
      id: 'test-1',
      position: 'top' as const,
      open: false,
      onClose: vi.fn(),
      render: () => null,
    })
    expect(store.getSnapshot().inlineContents).toHaveLength(1)
    expect(store.getSnapshot().inlineContents[0]!.open).toBe(false)
  })

  it('unregisterInlineContent removes entry', () => {
    const store = createDataTableStore({ data: sampleData, mode: 'client' })
    store.registerInlineContent({
      id: 'test-1',
      position: 'top' as const,
      open: true,
      onClose: vi.fn(),
      render: () => null,
    })
    store.unregisterInlineContent('test-1')
    expect(store.getSnapshot().inlineContents).toHaveLength(0)
  })
})

describe('server mode', () => {
  it('does not apply filters in server mode', () => {
    const store = createDataTableStore({ data: sampleData, mode: 'server' })
    store.registerFilter('department', 'checkbox')
    store.setFilter('department', ['Engineering'])
    expect(store.getSnapshot().filteredData).toBe(sampleData)
  })

  it('setData in server mode mirrors data to filteredData', () => {
    const store = createDataTableStore({ data: sampleData, mode: 'server' })
    const newData = [{ id: '4', name: 'Diana', department: 'Design', status: 'pending' }]
    store.setData(newData)
    expect(store.getSnapshot().filteredData).toBe(newData)
  })
})
