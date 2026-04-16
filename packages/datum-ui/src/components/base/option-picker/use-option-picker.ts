import type {
  OptionPickerGroup,
  OptionPickerOption,
  UseOptionPickerArgs,
  UseOptionPickerReturn,
} from './types'
import { useCallback, useMemo, useRef, useState } from 'react'
import { flattenOptions, isGroupedOptions } from './types'

export function useOptionPicker<T extends OptionPickerOption>(
  args: UseOptionPickerArgs<T, true>,
): UseOptionPickerReturn<T>
export function useOptionPicker<T extends OptionPickerOption>(
  args: UseOptionPickerArgs<T, false>,
): UseOptionPickerReturn<T>
export function useOptionPicker<T extends OptionPickerOption>(
  args: UseOptionPickerArgs<T, boolean>,
): UseOptionPickerReturn<T> {
  const {
    options,
    multiple,
    value,
    defaultValue,
    onValueChange,
    onSearchChange,
    creatable = false,
    closeOnSelect = true,
    onOpenChange,
  } = args

  const [internalValue, setInternalValue] = useState<string[]>(() => {
    if (value !== undefined) {
      return Array.isArray(value) ? value : [value]
    }
    if (defaultValue !== undefined) {
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue]
    }
    return []
  })

  const selection = useMemo(() => {
    if (value === undefined)
      return internalValue
    return Array.isArray(value) ? value : [value]
  }, [value, internalValue])

  const selectionSet = useMemo(() => new Set(selection), [selection])

  const [search, setSearchState] = useState('')

  const setSearch = useCallback(
    (next: string) => {
      setSearchState(next)
      onSearchChange?.(next)
    },
    [onSearchChange],
  )

  const isSelected = useCallback((v: string) => selectionSet.has(v), [selectionSet])

  const toggle = useCallback(
    (v: string) => {
      if (multiple) {
        const next = selectionSet.has(v)
          ? selection.filter(x => x !== v)
          : [...selection, v]
        if (value === undefined)
          setInternalValue(next)
        ;(onValueChange as ((values: string[]) => void) | undefined)?.(next)
      }
      else {
        if (value === undefined)
          setInternalValue([v])
        ;(onValueChange as ((val: string) => void) | undefined)?.(v)
        if (closeOnSelect)
          onOpenChange(false)
      }
    },
    [multiple, selection, selectionSet, value, onValueChange, closeOnSelect, onOpenChange],
  )

  const clear = useCallback(() => {
    if (!multiple)
      return
    if (value === undefined)
      setInternalValue([])
    ;(onValueChange as ((values: string[]) => void) | undefined)?.([])
  }, [multiple, value, onValueChange])

  // Internal filter — only runs when onSearchChange is NOT provided.
  const filteredOptions = useMemo(() => {
    if (onSearchChange || !search)
      return options
    const q = search.toLowerCase().trim()
    if (!q)
      return options

    if (isGroupedOptions<T>(options)) {
      return options
        .map((g): OptionPickerGroup<T> => ({
          label: g.label,
          options: g.options.filter(o => o.label.toLowerCase().includes(q)),
        }))
        .filter(g => g.options.length > 0)
    }
    return options.filter(o => o.label.toLowerCase().includes(q))
  }, [options, search, onSearchChange])

  const hasMatches = useMemo(() => {
    if (isGroupedOptions<T>(filteredOptions)) {
      return filteredOptions.some(g => g.options.length > 0)
    }
    return filteredOptions.length > 0
  }, [filteredOptions])

  const creatableValue = useMemo<string | null>(() => {
    if (!creatable || multiple)
      return null
    const trimmed = search.trim()
    if (!trimmed)
      return null
    const all = flattenOptions(options)
    const exactMatch = all.some(o => o.label.toLowerCase() === trimmed.toLowerCase())
    return exactMatch ? null : trimmed
  }, [creatable, multiple, search, options])

  const hasSelection = selection.length > 0

  const listRef = useRef<HTMLDivElement | null>(null)

  return {
    search,
    setSearch,
    filteredOptions,
    hasMatches,
    isSelected,
    toggle,
    clear,
    hasSelection,
    creatableValue,
    listRef,
  }
}
