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
 *
 * A group carries an `options` array and, unlike an option, has no `value`.
 * Checking for the *absence* of `value` (plus an actual `options` array) avoids
 * misclassifying flat custom option types that happen to declare their own
 * `options` field as metadata.
 */
export function isGroupedOptions<T extends OptionPickerOption>(
  options: T[] | OptionPickerGroup<T>[],
): options is OptionPickerGroup<T>[] {
  if (options.length === 0)
    return false
  const first = options[0]!
  return (
    'options' in first
    && Array.isArray((first as { options?: unknown }).options)
    && !('value' in first)
  )
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
  /**
   * Extract the emitted/selected id from an option. Default: `option.value`.
   * Lets the engine be reused for custom option shapes (see Transfer).
   */
  getOptionValue?: (option: T) => string
  /**
   * Extract the display + internal-filter text from an option.
   * Default: `option.label`.
   */
  getOptionLabel?: (option: T) => string
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
  /**
   * The resolved selected ids — the single source of truth for selection.
   * Consumers should read this instead of maintaining a parallel mirror.
   */
  selection: string[]
  /**
   * The resolved selected options (subset of `options`), in selection order.
   * Ids present in `selection` but absent from `options` (e.g. freshly created
   * values) are omitted.
   */
  selectedOptions: T[]
  creatableValue: string | null
  /** Custom renderer for the creatable row label, forwarded from args. */
  creatableLabel?: (search: string) => ReactNode
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
