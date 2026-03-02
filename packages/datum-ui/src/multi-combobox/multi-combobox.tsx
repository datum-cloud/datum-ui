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

export interface MultiComboboxOption {
  value: string;
  label: string;
  count?: number;
}

export interface MultiComboboxProps {
  options: MultiComboboxOption[];
  values: string[];
  onValuesChange: (values: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  maxDisplayed?: number;
}

const MultiCombobox = ({
  options,
  values,
  onValuesChange,
  placeholder = 'Select options...',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No results found.',
  disabled = false,
  loading = false,
  className,
  maxDisplayed = 2,
}: MultiComboboxProps) => {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (selectedValue: string) => {
    if (values.includes(selectedValue)) {
      onValuesChange(values.filter((v) => v !== selectedValue));
    } else {
      onValuesChange([...values, selectedValue]);
    }
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValuesChange([]);
  };

  const buildTriggerLabel = (): string => {
    if (loading) return 'Loading...';
    if (values.length === 0) return placeholder;
    if (values.length <= maxDisplayed) {
      return values
        .map((v) => options.find((opt) => opt.value === v)?.label ?? v)
        .join(', ');
    }
    const displayed = values
      .slice(0, maxDisplayed)
      .map((v) => options.find((opt) => opt.value === v)?.label ?? v)
      .join(', ');
    return `${displayed} +${values.length - maxDisplayed} more`;
  };

  const isPlaceholder = loading || values.length === 0;
  const triggerLabel = buildTriggerLabel();

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
            aria-label={isPlaceholder ? placeholder : `Selected: ${triggerLabel}`}
            disabled={disabled}
            className={cn(
              'flex min-w-0 flex-1 items-center gap-2 px-3 py-2 text-sm',
              'focus-visible:outline-none',
              isPlaceholder ? 'text-input-placeholder' : 'text-input-foreground',
            )}>
            <span className="flex min-w-0 flex-1 items-center gap-2 truncate">
              {loading && <Loader2 className="size-4 shrink-0 animate-spin opacity-50" />}
              <span className="truncate">{triggerLabel}</span>
            </span>
            <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>
        {values.length > 0 && !loading && (
          <button
            type="button"
            aria-label="Clear all selections"
            disabled={disabled}
            onClick={handleClearAll}
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
              {options.map((option) => {
                const isSelected = values.includes(option.value);
                return (
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
                    {isSelected && <Check className="size-4 shrink-0" />}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

MultiCombobox.displayName = 'MultiCombobox';

export { MultiCombobox };
