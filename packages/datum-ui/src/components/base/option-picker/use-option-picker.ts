import type {
  OptionPickerGroup,
  OptionPickerOption,
  UseOptionPickerArgs,
  UseOptionPickerReturn,
} from './types'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useControllableState } from '../hooks/use-controllable-state'
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
    creatableLabel,
    closeOnSelect = true,
    onOpenChange,
    getOptionValue: getOptionValueProp,
    getOptionLabel: getOptionLabelProp,
  } = args

  // Accessors default to the standard `value`/`label` fields but can be
  // overridden so the engine works with custom option shapes.
  const getOptionValue = useMemo(
    () => getOptionValueProp ?? ((o: T) => o.value),
    [getOptionValueProp],
  )
  const getOptionLabel = useMemo(
    () => getOptionLabelProp ?? ((o: T) => o.label),
    [getOptionLabelProp],
  )

  // Normalize the controlled value to the internal `string[]` shape. Memoized so
  // the selection reference stays stable across renders while `value` is unchanged.
  const controlledSelection = useMemo<string[] | undefined>(() => {
    if (value === undefined)
      return undefined
    return Array.isArray(value) ? value : [value]
  }, [value])

  // Single source of truth for the selection via the shared controllable-state
  // hook: uncontrolled by default, the `value` prop takes over when provided.
  // `onValueChange` is emitted explicitly (below) because single-mode emits a
  // string while the internal state is always `string[]`.
  const [selection, setSelection] = useControllableState<string[]>(
    controlledSelection,
    defaultValue === undefined
      ? []
      : Array.isArray(defaultValue)
        ? defaultValue
        : [defaultValue],
  )

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
        setSelection(next)
        ;(onValueChange as ((values: string[]) => void) | undefined)?.(next)
      }
      else {
        setSelection([v])
        ;(onValueChange as ((val: string) => void) | undefined)?.(v)
        if (closeOnSelect)
          onOpenChange(false)
      }
    },
    [multiple, selection, selectionSet, setSelection, onValueChange, closeOnSelect, onOpenChange],
  )

  const clear = useCallback(() => {
    if (!multiple)
      return
    setSelection([])
    ;(onValueChange as ((values: string[]) => void) | undefined)?.([])
  }, [multiple, setSelection, onValueChange])

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
          options: g.options.filter(o => getOptionLabel(o).toLowerCase().includes(q)),
        }))
        .filter(g => g.options.length > 0)
    }
    return options.filter(o => getOptionLabel(o).toLowerCase().includes(q))
  }, [options, search, onSearchChange, getOptionLabel])

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
    const lowered = trimmed.toLowerCase()
    // Dedup against BOTH labels and values: a created id that collides with an
    // existing option's value would otherwise emit an id the consumer thinks is
    // new while marking the existing option selected.
    const exactMatch = all.some(
      o =>
        getOptionLabel(o).toLowerCase() === lowered
        || getOptionValue(o).toLowerCase() === lowered,
    )
    return exactMatch ? null : trimmed
  }, [creatable, multiple, search, options, getOptionLabel, getOptionValue])

  const hasSelection = selection.length > 0

  // Resolved selected options in selection order — the ONE read path so
  // consumers don't rebuild a parallel source of truth. Ids without a matching
  // option (e.g. freshly created values) are dropped.
  const selectedOptions = useMemo(() => {
    const all = flattenOptions(options)
    const byValue = new Map(all.map(o => [getOptionValue(o), o] as const))
    return selection
      .map(v => byValue.get(v))
      .filter((o): o is T => o !== undefined)
  }, [options, selection, getOptionValue])

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
    selection,
    selectedOptions,
    creatableValue,
    creatableLabel,
    listRef,
  }
}
