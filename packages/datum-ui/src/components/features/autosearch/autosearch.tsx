import type { AutocompleteOption } from '../autocomplete/autocomplete.types'
import type { AutosearchProps } from './autosearch.types'
import { AlertCircle, Check, Loader2, X } from 'lucide-react'
import * as React from 'react'
import { cn } from '../../../utils/cn'
import { Button } from '../../base/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '../../base/command'
import { Input } from '../../base/input'
import { Popover, PopoverContent, PopoverTrigger } from '../../base/popover'
import { Tooltip } from '../../base/tooltip'
import { defaultAutosearchValue } from './autosearch.types'

/**
 * Autosearch - Search-first input with dropdown results
 *
 * A text input that opens a popover with search results as you type.
 * Different from Autocomplete which shows all options upfront.
 *
 * @example Basic usage
 * ```tsx
 * <Autosearch
 *   options={users}
 *   value={selectedUser}
 *   onValueChange={setSelectedUser}
 *   onSearch={handleSearch}
 *   placeholder="Search users..."
 * />
 * ```
 *
 * @example With loading state
 * ```tsx
 * <Autosearch
 *   options={searchResults}
 *   value={selected}
 *   onValueChange={setSelected}
 *   onSearch={debouncedSearch}
 *   loading={isSearching}
 *   placeholder="Type to search..."
 * />
 * ```
 */
export function Autosearch({
  // Data
  options = [],

  // Controlled value
  value,
  onValueChange,

  // Search
  onSearch,
  searchDebounceMs = 300,
  getValue = defaultAutosearchValue,

  // Rendering
  placeholder = 'Search for an option',
  emptyMessage = 'No results found.',
  emptyContent,

  // Behavior
  loading = false,
  modal = false,

  // State
  disabled = false,
  name,
  id,

  // Styling
  className,
  inputClassName,
  contentClassName,
  selectedClassName,
}: AutosearchProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const [persistedOption, setPersistedOption] = React.useState<AutocompleteOption | null>(null)
  const [searchExecuted, setSearchExecuted] = React.useState(false)

  const searchDebounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  // ===== Search handling =====

  const handleSearchChange = (inputValue: string) => {
    setSearchQuery(inputValue)
    const normalized = inputValue.trim()

    // Clear existing timeout
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current)
      searchDebounceRef.current = null
    }

    // Empty search - close popover and reset
    if (!normalized) {
      onSearch?.('')
      setOpen(false)
      setSearchExecuted(false)
      return
    }

    // Open popover and schedule search
    setOpen(true)
    searchDebounceRef.current = setTimeout(() => {
      setSearchExecuted(true)
      onSearch?.(normalized)
      searchDebounceRef.current = null
    }, searchDebounceMs)
  }

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current)
        searchDebounceRef.current = null
      }
    }
  }, [])

  // ===== Selection handling =====

  const handleSelect = React.useCallback(
    (option: AutocompleteOption) => {
      setPersistedOption(option)
      onValueChange?.(option.value)
      setSearchQuery('')
      onSearch?.('')
      setOpen(false)
      setSearchExecuted(false)
    },
    [onValueChange, onSearch],
  )

  const handleClear = React.useCallback(() => {
    setPersistedOption(null)
    setSearchQuery('')
    onSearch?.('')
    setOpen(false)
    setSearchExecuted(false)
    onValueChange?.('')
  }, [onValueChange, onSearch])

  // Auto-select single result
  React.useEffect(() => {
    const normalized = searchQuery.trim()
    if (value || !normalized)
      return

    if (options.length === 1 && !options[0]!.disabled) {
      handleSelect(options[0]!)
    }
  }, [searchQuery, options, value, handleSelect])

  // ===== Derived state =====

  const normalizedQuery = searchQuery.trim()
  const hasSearch = Boolean(normalizedQuery)
  const showResults = hasSearch && !value && options.length > 1
  const selectedOption = options.find(opt => opt.value === value) ?? persistedOption
  const selectedLabel = selectedOption?.label ?? ''
  const selectedDescription = selectedOption?.description ?? ''
  const showNoResults = hasSearch && !loading && options.length === 0 && searchExecuted

  // ===== Render =====

  return (
    <div className={cn('relative', className)}>
      {/* Hidden input for form submission */}
      {name && <input type="hidden" name={name} value={value ?? ''} />}

      {/* Selected state: Show card with clear button */}
      {value
        ? (
            <div
              className={cn(
                'bg-muted/10 border-border flex items-center justify-between gap-2 rounded-md border px-3 py-1 pr-1',
                selectedClassName,
              )}
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium">{selectedLabel}</span>
                {selectedDescription && (
                  <span className="text-muted-foreground text-xs">{selectedDescription}</span>
                )}
              </div>
              <Button
                size="small"
                type="tertiary"
                theme="borderless"
                onClick={handleClear}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )
        : (
          /* Search state: Show input with popover */
            <Popover open={open && showResults} onOpenChange={setOpen} modal={modal}>
              <PopoverTrigger asChild>
                <div className="relative">
                  <Input
                    id={id}
                    placeholder={placeholder}
                    value={searchQuery}
                    onChange={e => handleSearchChange(e.target.value)}
                    disabled={disabled}
                    autoComplete="off"
                    className={cn('w-full pr-10', inputClassName)}
                  />

                  {/* Loading spinner */}
                  {loading && (
                    <Loader2 className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin" />
                  )}

                  {/* No results indicator */}
                  {showNoResults && (
                    <Tooltip message={emptyMessage}>
                      <span className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2">
                        <AlertCircle className="text-destructive h-4 w-4" />
                      </span>
                    </Tooltip>
                  )}
                </div>
              </PopoverTrigger>

              <PopoverContent
                className={cn('popover-content-width-full p-0', contentClassName)}
                side="bottom"
                align="start"
                onOpenAutoFocus={event => event.preventDefault()}
              >
                <Command>
                  <CommandList>
                    {loading
                      ? (
                          <CommandEmpty>Searching...</CommandEmpty>
                        )
                      : options.length === 0
                        ? (
                            <CommandEmpty>{emptyContent ?? emptyMessage}</CommandEmpty>
                          )
                        : (
                            <CommandGroup>
                              {options.map(option => (
                                <CommandItem
                                  key={option.value}
                                  value={getValue(option)}
                                  onSelect={() => handleSelect(option)}
                                  disabled={option.disabled}
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium">{option.label}</span>
                                    {option.description && (
                                      <span className="text-muted-foreground text-xs">{option.description}</span>
                                    )}
                                  </div>
                                  <Check
                                    className={cn(
                                      'ml-auto h-4 w-4',
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
          )}
    </div>
  )
}

Autosearch.displayName = 'Autosearch'
