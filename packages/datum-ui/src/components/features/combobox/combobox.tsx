import type { ComboboxGroup, ComboboxOption, ComboboxProps } from './types'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@repo/shadcn/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@repo/shadcn/ui/popover'
import { CheckIcon, ChevronDown, X } from 'lucide-react'
import * as React from 'react'
import { cn } from '../../../utils/cn'

/**
 * Combobox - Single-select dropdown with search
 *
 * A simpler alternative to Autocomplete for basic select scenarios.
 * Supports grouped options and search filtering.
 *
 * @example
 * ```tsx
 * const options = [
 *   { value: '1', label: 'Option 1' },
 *   { value: '2', label: 'Option 2' },
 * ]
 *
 * <Combobox
 *   options={options}
 *   value={value}
 *   onChange={setValue}
 *   placeholder="Select an option"
 * />
 * ```
 */
export function Combobox({
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No options found.',
  disabled = false,
  className,
  triggerClassName,
  contentClassName,
  searchable = true,
  showDropdownArrow = true,
  clearable = false,
  id,
  'data-testid': testId,
  modal = true,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  // Determine if options are grouped
  const isGrouped = options.length > 0 && 'options' in options[0]!

  // Get all options (flatten if grouped)
  const allOptions = React.useMemo(() => {
    if (isGrouped) {
      return (options as ComboboxGroup[]).flatMap(group => group.options)
    }
    return options as ComboboxOption[]
  }, [options, isGrouped])

  // Find selected option
  const selectedOption = allOptions.find(opt => opt.value === value)

  const handleSelect = React.useCallback(
    (selectedValue: string) => {
      // Toggle selection if same value
      const newValue = selectedValue === value ? undefined : selectedValue
      onChange?.(newValue)
      setOpen(false)
    },
    [value, onChange],
  )

  const handleClear = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onChange?.(undefined)
    },
    [onChange],
  )

  return (
    <Popover open={open} onOpenChange={setOpen} modal={modal}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          id={id}
          data-testid={testId}
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm',
            'ring-offset-background placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            triggerClassName,
            className,
          )}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <div className="ml-2 flex shrink-0 items-center gap-1">
            {clearable && selectedOption && !disabled && (
              <X
                className="size-4 opacity-50 hover:opacity-100"
                onClick={handleClear}
              />
            )}
            {showDropdownArrow && (
              <ChevronDown className="size-4 opacity-50" />
            )}
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className={cn('popover-content-width-full p-0', contentClassName)}
        align="start"
      >
        <Command>
          {searchable && (
            <CommandInput placeholder={searchPlaceholder} className="h-9" />
          )}
          <CommandList className="max-h-[300px]">
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            {isGrouped
              ? (
                  (options as ComboboxGroup[]).map(group => (
                    <CommandGroup key={group.label} heading={group.label}>
                      {group.options.map(option => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          disabled={option.disabled}
                          onSelect={handleSelect}
                        >
                          {option.label}
                          <CheckIcon
                            className={cn(
                              'ml-auto size-4',
                              value === option.value ? 'opacity-100' : 'opacity-0',
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ))
                )
              : (
                  <CommandGroup>
                    {(options as ComboboxOption[]).map(option => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                        onSelect={handleSelect}
                      >
                        {option.label}
                        <CheckIcon
                          className={cn(
                            'ml-auto size-4',
                            value === option.value ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

Combobox.displayName = 'Combobox'
