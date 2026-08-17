import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useTransferState } from '../use-transfer-state'

interface TestItem {
  id: string
  name: string
  group?: string
}

describe('useTransferState', () => {
  const items: TestItem[] = [
    { id: '1', name: 'Item 1', group: 'Group A' },
    { id: '2', name: 'Item 2', group: 'Group A' },
    { id: '3', name: 'Item 3', group: 'Group B' },
    { id: '4', name: 'Item 4', group: 'Group B' },
  ]

  it('separates items into source and target panels', () => {
    const { result } = renderHook(() =>
      useTransferState({
        items,
        value: ['1', '3'],
        itemKey: 'id',
        itemLabel: 'name',
        itemGroup: 'group',
      }),
    )

    expect(result.current.sourceItems).toHaveLength(2)
    expect(result.current.targetItems).toHaveLength(2)

    expect(result.current.sourceItems.map(i => i.key)).toEqual(['2', '4'])
    expect(result.current.targetItems.map(i => i.key)).toEqual(['1', '3'])
  })

  it('filters items by search query', async () => {
    const { result } = renderHook(() =>
      useTransferState({
        items,
        value: [],
        itemKey: 'id',
        itemLabel: 'name',
      }),
    )

    act(() => {
      result.current.setSourceSearch('Item 1')
    })

    // Wait for debounce (300ms)
    await waitFor(
      () => {
        expect(result.current.filteredSourceItems).toHaveLength(1)
      },
      { timeout: 500 },
    )

    expect(result.current.filteredSourceItems[0]?.key).toBe('1')
  })

  it('groups items by group property', () => {
    const { result } = renderHook(() =>
      useTransferState({
        items,
        value: [],
        itemKey: 'id',
        itemLabel: 'name',
        itemGroup: 'group',
      }),
    )

    expect(result.current.sourceGroups).toEqual(['Group A', 'Group B'])
  })

  it('treats missing group values as ungrouped, not a literal "undefined" group', () => {
    const mixed: TestItem[] = [
      { id: '1', name: 'Item 1', group: 'Group A' },
      { id: '2', name: 'Item 2' },
    ]

    const { result } = renderHook(() =>
      useTransferState({
        items: mixed,
        value: [],
        itemKey: 'id',
        itemLabel: 'name',
        itemGroup: 'group',
      }),
    )

    expect(result.current.sourceGroups).toEqual(['Group A'])
    expect(result.current.sourceItems.find(i => i.key === '2')?.group).toBeUndefined()
  })
})
