import type { ReactNode, RefObject } from 'react'

/** Base shape for any option presented by the picker. */
export interface OptionPickerOption {
  /** Unique identifier — this is what is selected and emitted via onValueChange. */
  value: string
  /** Display text shown to the user. Also used for built-in substring filtering. */
  label: string
  /** Optional secondary text shown below the label in the default renderer. */
  description?: string
  /** Prevent this option from being toggled. */
  disabled?: boolean
}

/** Grouped options — a labelled heading with its own options array. */
export interface OptionPickerGroup<T extends OptionPickerOption = OptionPickerOption> {
  label: string
  options: T[]
}

/**
 * Detect whether an options prop is grouped.
 *
 * Treats empty arrays as flat (zero-option lists do not need group headings).
 */
export function isGroupedOptions<T extends OptionPickerOption>(
  options: T[] | OptionPickerGroup<T>[],
): options is OptionPickerGroup<T>[] {
  if (options.length === 0)
    return false
  const first = options[0]!
  return 'options' in first
}

/** Internal helper — flatten grouped or flat options into a single array. */
export function flattenOptions<T extends OptionPickerOption>(
  options: T[] | OptionPickerGroup<T>[],
): T[] {
  return isGroupedOptions(options) ? options.flatMap(g => g.options) : options
}

// ---------- Hook types ----------

export interface UseOptionPickerArgs<
  T extends OptionPickerOption,
  Multiple extends boolean,
> {
  options: T[] | OptionPickerGroup<T>[]
  multiple: Multiple
  value?: Multiple extends true ? string[] : string
  defaultValue?: Multiple extends true ? string[] : string
  onValueChange?: Multiple extends true
    ? (values: string[]) => void
    : (value: string) => void
  /**
   * When provided, disables internal filtering. The engine surfaces the
   * current search string and calls this on changes; the consumer is
   * expected to filter `options` itself.
   */
  onSearchChange?: (search: string) => void
  /** Show a "Use '<search>'" row when the search does not match any option. Single mode only. */
  creatable?: boolean
  creatableLabel?: (search: string) => ReactNode
  /** Single-select only. Auto-close on selection. Default: true. */
  closeOnSelect?: Multiple extends true ? false | undefined : boolean
  open: boolean
  onOpenChange: (open: boolean) => void
}

export interface UseOptionPickerReturn<T extends OptionPickerOption> {
  search: string
  setSearch: (s: string) => void
  filteredOptions: T[] | OptionPickerGroup<T>[]
  hasMatches: boolean
  isSelected: (value: string) => boolean
  toggle: (value: string) => void
  clear: () => void
  hasSelection: boolean
  creatableValue: string | null
  listRef: RefObject<HTMLDivElement | null>
}

// ---------- OptionList component prop types ----------

export interface OptionListProps<T extends OptionPickerOption> {
  picker: UseOptionPickerReturn<T>
  searchPlaceholder?: string
  disableSearch?: boolean
  emptyContent?: ReactNode
  renderOption?: (option: T, isSelected: boolean) => ReactNode
  header?: ReactNode
  footer?: ReactNode
  loading?: boolean
  virtualize?: boolean
  itemSize?: number
  listClassName?: string
}
