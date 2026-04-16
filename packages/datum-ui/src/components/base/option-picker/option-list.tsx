import type React from 'react'
import type { OptionListProps, OptionPickerOption } from './types'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@repo/shadcn/ui/command'
import { useVirtualizer } from '@tanstack/react-virtual'
import { CheckIcon } from 'lucide-react'
import { LoaderOverlay } from '../../features/loader-overlay'
import { isGroupedOptions } from './types'

function defaultRenderOption<T extends OptionPickerOption>(
  option: T,
  isSelected: boolean,
) {
  return (
    <>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate">{option.label}</span>
        {option.description && (
          <span className="text-muted-foreground truncate text-xs">{option.description}</span>
        )}
      </div>
      {isSelected && (
        <CheckIcon className="text-primary ml-auto size-4 shrink-0" />
      )}
    </>
  )
}

export function OptionList<T extends OptionPickerOption>({
  picker,
  searchPlaceholder,
  disableSearch,
  emptyContent,
  renderOption,
  header,
  footer,
  loading,
  virtualize,
  itemSize = 36,
  listClassName,
}: OptionListProps<T>) {
  const { filteredOptions, search, setSearch, isSelected, toggle, creatableValue } = picker
  const grouped = isGroupedOptions(filteredOptions)
  const row = renderOption ?? defaultRenderOption

  // Virtualization for flat lists only. When grouped options are passed
  // alongside virtualize=true, fall back to standard rendering.
  const canVirtualize = virtualize && !grouped

  return (
    <Command shouldFilter={false}>
      {header}
      {!disableSearch && (
        <CommandInput
          className="!text-xs placeholder:text-xs"
          placeholder={searchPlaceholder}
          value={search}
          onValueChange={setSearch}
        />
      )}
      <CommandList ref={picker.listRef} className={listClassName}>
        {loading && <LoaderOverlay />}
        <CommandEmpty>{emptyContent ?? 'No results found.'}</CommandEmpty>

        {grouped
          ? (
              filteredOptions.map(group => (
                <CommandGroup key={group.label} heading={group.label}>
                  {group.options.map(option => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                      onSelect={() => toggle(option.value)}
                    >
                      {row(option, isSelected(option.value))}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))
            )
          : canVirtualize
            ? (
                <VirtualCommandGroup
                  options={filteredOptions}
                  isSelected={isSelected}
                  toggle={toggle}
                  renderOption={row}
                  listRef={picker.listRef}
                  itemSize={itemSize}
                />
              )
            : (
                <CommandGroup>
                  {filteredOptions.map(option => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                      onSelect={() => toggle(option.value)}
                    >
                      {row(option, isSelected(option.value))}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

        {creatableValue && (
          <CommandGroup>
            <CommandItem
              value={`__create_${creatableValue}`}
              onSelect={() => toggle(creatableValue)}
            >
              <span>
                Use &quot;
                {creatableValue}
                &quot;
              </span>
            </CommandItem>
          </CommandGroup>
        )}
      </CommandList>
      {footer}
    </Command>
  )
}

// ---------- Virtualized subcomponent ----------

interface VirtualCommandGroupProps<T extends OptionPickerOption> {
  options: T[]
  isSelected: (v: string) => boolean
  toggle: (v: string) => void
  renderOption: (option: T, isSelected: boolean) => React.ReactNode
  listRef: React.RefObject<HTMLDivElement | null>
  itemSize: number
}

function VirtualCommandGroup<T extends OptionPickerOption>({
  options,
  isSelected,
  toggle,
  renderOption,
  listRef,
  itemSize,
}: VirtualCommandGroupProps<T>) {
  const virtualizer = useVirtualizer({
    count: options.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => itemSize,
    overscan: 8,
  })

  return (
    <CommandGroup>
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const option = options[virtualRow.index]!
          return (
            <div
              key={option.value}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <CommandItem
                value={option.value}
                disabled={option.disabled}
                onSelect={() => toggle(option.value)}
              >
                {renderOption(option, isSelected(option.value))}
              </CommandItem>
            </div>
          )
        })}
      </div>
    </CommandGroup>
  )
}
