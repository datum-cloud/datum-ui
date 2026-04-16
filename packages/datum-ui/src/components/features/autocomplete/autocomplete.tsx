import type {
  AutocompleteGroup,
  AutocompleteOption,
  AutocompleteProps,
} from './autocomplete.types'
import * as React from 'react'
import { cn } from '../../../utils/cn'
import { OptionList, useOptionPicker } from '../../base/option-picker'
import { ResponsivePopover } from '../../base/responsive-popover'
import { Trigger } from './trigger'

/**
 * Autocomplete - A searchable select component
 *
 * Standalone, form-agnostic combobox built on ResponsivePopover + OptionList engine.
 * Supports flat/grouped options, virtualization, custom rendering, and async search.
 *
 * @example Basic usage
 * ```tsx
 * <Autocomplete
 *   value={country}
 *   onValueChange={setCountry}
 *   options={countries}
 *   placeholder="Select country..."
 * />
 * ```
 *
 * @example Async search
 * ```tsx
 * <Autocomplete
 *   value={userId}
 *   onValueChange={setUserId}
 *   options={users ?? []}
 *   onSearchChange={setSearch}
 *   loading={isLoading}
 *   placeholder="Search users..."
 * />
 * ```
 */
export function Autocomplete<T extends AutocompleteOption = AutocompleteOption>({
  options,
  value,
  onValueChange,
  onSearchChange,
  searchPlaceholder = 'Search...',
  disableSearch = false,
  renderOption,
  renderValue,
  placeholder = 'Select...',
  emptyContent = 'No results found',
  footer,
  creatable = false,
  creatableLabel,
  virtualize = false,
  itemSize = 36,
  loading = false,
  modal = false,
  responsive = true,
  sheetTitle,
  disabled = false,
  name,
  id,
  className,
  triggerClassName,
  contentClassName,
  listClassName,
}: AutocompleteProps<T>) {
  const [open, setOpen] = React.useState(false)

  const picker = useOptionPicker<T>({
    multiple: false,
    options,
    value,
    onValueChange,
    onSearchChange,
    creatable,
    creatableLabel,
    closeOnSelect: true,
    open,
    onOpenChange: setOpen,
  })

  const flatOptions = React.useMemo(() => {
    if (
      Array.isArray(options)
      && options.length > 0
      && 'options' in (options[0] as object)
    ) {
      return (options as AutocompleteGroup<T>[]).flatMap(g => g.options)
    }
    return options as T[]
  }, [options])

  // When creatable and value doesn't match any option, show raw value in trigger
  const displayOption = React.useMemo(() => {
    const found = flatOptions.find(o => o.value === value)
    if (found)
      return found
    if (creatable && value)
      return { value, label: value } as T
    return undefined
  }, [flatOptions, value, creatable])

  return (
    <div className={cn('relative', className)}>
      <ResponsivePopover
        open={open}
        onOpenChange={setOpen}
        modal={modal}
        responsive={responsive}
        sheetTitle={sheetTitle ?? placeholder ?? 'Search'}
        contentClassName={cn('popover-content-width-full', contentClassName)}
        align="start"
        trigger={(
          <Trigger
            selectedOption={displayOption}
            renderValue={renderValue}
            placeholder={placeholder}
            loading={loading}
            disabled={disabled}
            open={open}
            id={id}
            className={triggerClassName}
          />
        )}
      >
        <OptionList<T>
          picker={picker}
          searchPlaceholder={searchPlaceholder}
          disableSearch={disableSearch}
          emptyContent={emptyContent}
          renderOption={renderOption}
          footer={footer}
          loading={loading}
          virtualize={virtualize}
          itemSize={itemSize}
          listClassName={listClassName}
        />
      </ResponsivePopover>

      {/* Hidden input for non-Conform usage (plain HTML forms) */}
      {name && <input type="hidden" name={name} value={value ?? ''} />}
    </div>
  )
}

Autocomplete.displayName = 'Autocomplete'
