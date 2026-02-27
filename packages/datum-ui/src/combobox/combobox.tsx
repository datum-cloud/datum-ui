import * as React from 'react';
import { cn } from '@repo/shadcn/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@repo/shadcn/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@repo/shadcn/ui/popover';
import { Check, ChevronsUpDown, Loader2, X } from 'lucide-react';

export interface ComboboxOption {
  value: string;
  label: string;
  count?: number;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  clearable?: boolean;
  showAllOption?: boolean;
  allOptionLabel?: string;
}

const Combobox = ({
  options,
  value,
  onValueChange,
  placeholder = 'Select an option...',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No results found.',
  disabled = false,
  loading = false,
  className,
  clearable = false,
  showAllOption = false,
  allOptionLabel = 'All',
}: ComboboxProps) => {
  const [open, setOpen] = React.useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (selectedValue: string) => {
    onValueChange(selectedValue === value ? '' : selectedValue);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange('');
  };

  const displayLabel = loading
    ? 'Loading...'
    : value === ''
      ? placeholder
      : (selectedOption?.label ?? placeholder);

  const isPlaceholder = loading || value === '' || !selectedOption;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* Wrapper div carries border/bg styling so the clear button can sit alongside the trigger */}
      <div
        className={cn(
          'flex h-9 w-full items-center overflow-hidden rounded-lg',
          'border border-input-border bg-input-background/50',
          'focus-within:border-input-focus-border focus-within:shadow-(--input-focus-shadow)',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}>
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            disabled={disabled}
            className={cn(
              'flex min-w-0 flex-1 items-center gap-2 px-3 py-2 text-sm',
              'focus-visible:outline-none',
              isPlaceholder ? 'text-input-placeholder' : 'text-input-foreground',
            )}>
            <span className="flex min-w-0 flex-1 items-center gap-2 truncate">
              {loading && <Loader2 className="size-4 shrink-0 animate-spin opacity-50" />}
              <span className="truncate">{displayLabel}</span>
            </span>
            <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>
        {clearable && value && !loading && (
          <button
            type="button"
            aria-label="Clear selection"
            disabled={disabled}
            onClick={handleClear}
            className="flex shrink-0 items-center px-2 opacity-50 hover:opacity-100 focus-visible:outline-none">
            <X className="size-3.5" />
          </button>
        )}
      </div>
      <PopoverContent
        className="p-0"
        align="start"
        style={{ width: 'var(--radix-popover-trigger-width)' }}>
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {showAllOption && (
                <CommandItem
                  value="__all__"
                  onSelect={() => { onValueChange(''); setOpen(false); }}
                  className="flex items-center justify-between">
                  <span>{allOptionLabel}</span>
                  {value === '' && <Check className="size-4 shrink-0" />}
                </CommandItem>
              )}
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={handleSelect}
                  className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span>{option.label}</span>
                    {option.count !== undefined && (
                      <span className="text-muted-foreground text-xs">({option.count})</span>
                    )}
                  </span>
                  {value === option.value && <Check className="size-4 shrink-0" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

Combobox.displayName = 'Combobox';

export { Combobox };
