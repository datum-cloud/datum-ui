import * as React from 'react';
import { cn } from '@repo/shadcn/lib/utils';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@repo/shadcn/ui/popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@repo/shadcn/ui/command';
import { CheckIcon, XIcon } from 'lucide-react';
import { Input } from '../input';

export interface FilterChipOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterChipProps {
  label: string;
  values: string[];
  options?: FilterChipOption[];
  onValuesChange: (values: string[]) => void;
  onClear: () => void;
  inputMode?: 'typeahead' | 'text';
  autoOpen?: boolean;
  onPopoverClose?: () => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
}

const FilterChip = ({
  label,
  values,
  options = [],
  onValuesChange,
  onClear,
  inputMode = 'typeahead',
  autoOpen = false,
  onPopoverClose,
  placeholder = 'Any',
  searchPlaceholder = 'Search...',
  disabled = false,
  className,
}: FilterChipProps) => {
  const [open, setOpen] = React.useState(autoOpen);
  const [textInputValue, setTextInputValue] = React.useState(values[0] ?? '');

  // Sync text input value when values prop changes externally
  React.useEffect(() => {
    if (inputMode === 'text') {
      setTextInputValue(values[0] ?? '');
    }
  }, [values, inputMode]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen && onPopoverClose) {
      onPopoverClose();
    }
  };

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClear();
  };

  const handleToggleOption = (optionValue: string) => {
    const next = values.includes(optionValue)
      ? values.filter((v) => v !== optionValue)
      : [...values, optionValue];
    onValuesChange(next);
  };

  const handleTextApply = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onValuesChange(textInputValue ? [textInputValue] : []);
      setOpen(false);
    }
  };

  const displayValue = values.length === 0 ? placeholder : values.join(', ');
  const hasValues = values.length > 0;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <div
        className={cn(
          'inline-flex h-7 items-center overflow-hidden rounded-full border border-border bg-muted text-xs font-medium',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
        data-slot="filter-chip"
      >
        {/* Label + value trigger */}
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            aria-label={`${label}: ${displayValue}. Click to edit filter.`}
            aria-haspopup="listbox"
            aria-expanded={open}
            className={cn(
              'flex h-full cursor-pointer items-center gap-1 pl-2.5 pr-1.5 text-left',
              'hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
              'transition-colors',
              disabled && 'pointer-events-none'
            )}
          >
            <span className="text-muted-foreground">{label}:</span>
            <span className={cn('truncate max-w-32', hasValues ? 'text-foreground' : 'text-muted-foreground')}>
              {displayValue}
            </span>
          </button>
        </PopoverTrigger>

        {/* Clear button */}
        <button
          type="button"
          onClick={handleClear}
          disabled={disabled}
          aria-label={`Clear ${label} filter`}
          className={cn(
            'flex h-full cursor-pointer items-center px-1.5',
            'hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
            'border-l border-border transition-colors',
            disabled && 'pointer-events-none'
          )}
        >
          <XIcon className="size-3" aria-hidden="true" />
        </button>
      </div>

      <PopoverContent
        className="w-64 p-0"
        align="start"
      >
        {inputMode === 'typeahead' ? (
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>No options found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = values.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => handleToggleOption(option.value)}
                      aria-selected={isSelected}
                    >
                      <span
                        className={cn(
                          'mr-2 flex size-4 items-center justify-center rounded-sm border border-primary',
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50'
                        )}
                        aria-hidden="true"
                      >
                        {isSelected && <CheckIcon className="size-3" />}
                      </span>
                      <span className="flex-1">{option.label}</span>
                      {option.count !== undefined && (
                        <span className="ml-auto text-xs text-muted-foreground">
                          {option.count}
                        </span>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        ) : (
          <div className="p-3">
            <Input
              autoFocus
              value={textInputValue}
              onChange={(e) => setTextInputValue(e.target.value)}
              onKeyDown={handleTextApply}
              placeholder={placeholder}
              aria-label={`${label} filter value`}
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Press Enter to apply
            </p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

FilterChip.displayName = 'FilterChip';

export { FilterChip };
