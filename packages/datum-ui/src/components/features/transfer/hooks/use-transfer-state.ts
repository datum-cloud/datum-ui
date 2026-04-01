import type { TransferItem } from '../types'
import { useCallback, useEffect, useMemo, useState } from 'react'

interface UseTransferStateProps<T> {
  items: T[]
  value: string[]
  itemKey: keyof T | ((item: T) => string)
  itemLabel: keyof T | ((item: T) => string)
  itemGroup?: keyof T | ((item: T) => string | undefined)
}

interface UseTransferStateReturn<T> {
  // Items
  sourceItems: TransferItem<T>[]
  targetItems: TransferItem<T>[]

  // Filtered items (after search)
  filteredSourceItems: TransferItem<T>[]

  // Groups
  sourceGroups: string[]
  targetGroups: string[]

  // Search
  sourceSearch: string
  setSourceSearch: (search: string) => void
}

export function useTransferState<T>({
  items,
  value,
  itemKey,
  itemLabel,
  itemGroup,
}: UseTransferStateProps<T>): UseTransferStateReturn<T> {
  const [sourceSearch, setSourceSearch] = useState('')

  // Debounced search value
  const [debouncedSourceSearch, setDebouncedSourceSearch] = useState('')

  // Debounce source search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSourceSearch(sourceSearch)
    }, 300)

    return () => clearTimeout(timer)
  }, [sourceSearch])

  // Helper to get property value
  const getKey = useCallback(
    (item: T): string => {
      return typeof itemKey === 'function' ? itemKey(item) : String(item[itemKey])
    },
    [itemKey],
  )

  const getLabel = useCallback(
    (item: T): string => {
      return typeof itemLabel === 'function' ? itemLabel(item) : String(item[itemLabel])
    },
    [itemLabel],
  )

  const getGroup = useCallback(
    (item: T): string | undefined => {
      if (!itemGroup)
        return undefined
      return typeof itemGroup === 'function' ? itemGroup(item) : String(item[itemGroup])
    },
    [itemGroup],
  )

  // Convert items to TransferItem format
  const transferItems = useMemo((): TransferItem<T>[] => {
    return items.map(item => ({
      key: getKey(item),
      label: getLabel(item),
      group: getGroup(item),
      data: item,
    }))
  }, [items, getKey, getLabel, getGroup])

  // Separate into source and target
  const { sourceItems, targetItems } = useMemo(() => {
    const valueSet = new Set(value)

    return {
      sourceItems: transferItems.filter(item => !valueSet.has(item.key)),
      targetItems: transferItems.filter(item => valueSet.has(item.key)),
    }
  }, [transferItems, value])

  // Filter by search
  const filterItems = useCallback(
    (items: TransferItem<T>[], search: string): TransferItem<T>[] => {
      if (!search)
        return items

      const searchLower = search.toLowerCase()
      return items.filter(
        item =>
          item.label.toLowerCase().includes(searchLower)
          || item.group?.toLowerCase().includes(searchLower)
          || item.key.toLowerCase().includes(searchLower),
      )
    },
    [],
  )

  const filteredSourceItems = useMemo(
    () => filterItems(sourceItems, debouncedSourceSearch),
    [sourceItems, debouncedSourceSearch, filterItems],
  )

  // Extract groups
  const getGroups = useCallback((items: TransferItem<T>[]): string[] => {
    const groups = new Set<string>()
    items.forEach((item) => {
      if (item.group)
        groups.add(item.group)
    })
    return Array.from(groups).sort()
  }, [])

  const sourceGroups = useMemo(
    () => getGroups(filteredSourceItems),
    [filteredSourceItems, getGroups],
  )
  const targetGroups = useMemo(
    () => getGroups(targetItems),
    [targetItems, getGroups],
  )

  return {
    sourceItems,
    targetItems,
    filteredSourceItems,
    sourceGroups,
    targetGroups,
    sourceSearch,
    setSourceSearch,
  }
}
