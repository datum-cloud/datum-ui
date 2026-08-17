import type {
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

  // Selection is tracked by the engine, so the trigger reflects the current
  // pick in BOTH controlled and uncontrolled mode (uncontrolled has no `value`).
  const selectedValue = picker.selection[0]
  const selectedOption = picker.selectedOptions[0]

  // Creatable: the user committed a value that isn't a real option. Show the raw
  // string in the trigger — never fabricate a partial `T`, which would hand a
  // consumer `renderValue` an object missing `T`'s declared fields.
  const createdValue
    = !selectedOption && creatable && selectedValue ? selectedValue : undefined

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
            selectedOption={selectedOption}
            createdValue={createdValue}
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
      {name && <input type="hidden" name={name} value={selectedValue ?? ''} />}
    </div>
  )
}

Autocomplete.displayName = 'Autocomplete'
