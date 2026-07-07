import type { AutocompleteOption } from '../autocomplete'
import type { AutosearchProps } from './autosearch.types'
import { AlertCircle, Loader2, X } from 'lucide-react'
import * as React from 'react'
import { cn } from '../../../utils/cn'
import { Button } from '../../base/button'
import { Input } from '../../base/input'
import { OptionList, useOptionPicker } from '../../base/option-picker'
import { ResponsivePopover } from '../../base/responsive-popover'
import { Tooltip } from '../../base/tooltip'

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

  // Rendering
  placeholder = 'Search for an option',
  emptyMessage = 'No results found.',
  emptyContent,

  // Behavior
  loading = false,
  modal = false,
  responsive = true,
  sheetTitle,

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
  const [open, setOpen] = React.useState(false)
  const [persistedOption, setPersistedOption] = React.useState<AutocompleteOption | null>(null)
  const [searchExecuted, setSearchExecuted] = React.useState(false)

  const searchDebounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  // ===== Debounced onSearch forwarding =====
  // The engine's onSearchChange disables internal filtering (correct — consumer owns results).
  // We wrap it so the actual onSearch callback fires after the debounce delay.
  const onSearchChangeForEngine = React.useCallback(
    (query: string) => {
      const normalized = query.trim()

      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current)
        searchDebounceRef.current = null
      }

      // A fresh query invalidates any previously-executed search until the
      // debounce fires, so stale single-result payloads can't auto-select.
      setSearchExecuted(false)

      if (!normalized) {
        onSearch?.('')
        return
      }

      searchDebounceRef.current = setTimeout(() => {
        setSearchExecuted(true)
        onSearch?.(normalized)
        searchDebounceRef.current = null
      }, searchDebounceMs)
    },
    [onSearch, searchDebounceMs],
  )

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current)
        searchDebounceRef.current = null
      }
    }
  }, [])

  // ===== Engine =====
  const picker = useOptionPicker<AutocompleteOption>({
    multiple: false,
    options,
    value,
    onValueChange: (selected: string) => {
      const option = options.find(o => o.value === selected) ?? null
      setPersistedOption(option)
      onValueChange?.(selected)
      // setSearch('') already forwards onSearch('') and resets searchExecuted
      // via onSearchChangeForEngine — calling them again would double-fire.
      picker.setSearch('')
    },
    // Passing onSearchChange disables internal filtering — consumer owns the results list.
    onSearchChange: onSearchChangeForEngine,
    closeOnSelect: true,
    open,
    onOpenChange: setOpen,
  })

  // ===== Open / close logic =====
  // Open only when there's a search query, no value selected, and results > 1
  const hasSearch = Boolean(picker.search.trim())
  // Open the popover for multiple results, OR for a lone disabled result — that
  // one option is not auto-selected, so it would otherwise be invisible.
  const singleDisabledResult = options.length === 1 && Boolean(options[0]?.disabled)
  const showResults = hasSearch && !value && (options.length > 1 || singleDisabledResult)
  const showNoResults = hasSearch && !loading && options.length === 0 && searchExecuted

  // Open popover when input has content
  React.useEffect(() => {
    if (hasSearch && !value) {
      setOpen(true)
    }
    else if (!hasSearch) {
      setOpen(false)
    }
  }, [hasSearch, value])

  // Auto-select single result — only for the search the user actually ran.
  // Gating on !loading && searchExecuted stops a stale/in-flight 1-item payload
  // (e.g. a debounced earlier query) from committing a selection unprompted.
  React.useEffect(() => {
    if (value || !hasSearch || loading || !searchExecuted)
      return

    if (options.length === 1 && !options[0]!.disabled) {
      const option = options[0]!
      setPersistedOption(option)
      onValueChange?.(option.value)
      // setSearch('') forwards onSearch('') and resets searchExecuted.
      picker.setSearch('')
      setOpen(false)
    }
  }, [options, value, hasSearch, loading, searchExecuted]) // eslint-disable-line react/exhaustive-deps

  // ===== Clear =====
  const handleClear = React.useCallback(() => {
    setPersistedOption(null)
    // setSearch('') forwards onSearch('') and resets searchExecuted.
    picker.setSearch('')
    setOpen(false)
    onValueChange?.('')
  }, [onValueChange, picker])

  // ===== Derived state =====
  const selectedOption = options.find(opt => opt.value === value) ?? persistedOption
  const selectedLabel = selectedOption?.label ?? ''
  const selectedDescription = selectedOption?.description ?? ''

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
            <ResponsivePopover
              open={open && showResults}
              onOpenChange={setOpen}
              responsive={responsive}
              modal={modal}
              sheetTitle={sheetTitle ?? placeholder ?? 'Search'}
              align="start"
              side="bottom"
              contentClassName={cn('popover-content-width-full', contentClassName)}
              onOpenAutoFocus={event => event.preventDefault()}
              trigger={(
                <div className="relative">
                  <Input
                    id={id}
                    placeholder={placeholder}
                    value={picker.search}
                    onChange={(e) => {
                      picker.setSearch(e.target.value)
                    }}
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
              )}
            >
              <OptionList<AutocompleteOption>
                picker={picker}
                disableSearch
                emptyContent={emptyContent ?? emptyMessage}
                loading={loading}
              />
            </ResponsivePopover>
          )}
    </div>
  )
}

Autosearch.displayName = 'Autosearch'
