import * as React from 'react';
import { cn } from '@repo/shadcn/lib/utils';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@repo/shadcn/ui/popover';
import { ListFilterIcon, PlusIcon } from 'lucide-react';

export interface FilterOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface AddFilterDropdownProps {
  availableFilters: FilterOption[];
  activeFilterIds: string[];
  onAddFilter: (filterId: string) => void;
  hasActiveFilters?: boolean;
  disabled?: boolean;
  className?: string;
}

const AddFilterDropdown = ({
  availableFilters,
  activeFilterIds,
  onAddFilter,
  hasActiveFilters = false,
  disabled = false,
  className,
}: AddFilterDropdownProps) => {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (filterId: string) => {
    const isActive = activeFilterIds.includes(filterId);
    if (!isActive) {
      onAddFilter(filterId);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label={hasActiveFilters ? 'Filters' : 'Add filters'}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={cn(
            'inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-md px-2.5 text-xs font-medium',
            'border border-border bg-transparent text-muted-foreground',
            'hover:bg-accent hover:text-accent-foreground',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
            'transition-colors',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
        >
          {hasActiveFilters ? (
            <ListFilterIcon className="size-3.5" aria-hidden="true" />
          ) : (
            <PlusIcon className="size-3.5" aria-hidden="true" />
          )}
          {hasActiveFilters ? 'Filters' : 'Add Filters'}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-48 p-1" align="start">
        <div role="menu" aria-label="Available filters">
          {availableFilters.length === 0 ? (
            <p className="px-2 py-1.5 text-xs text-muted-foreground">No filters available</p>
          ) : (
            availableFilters.map((filter) => {
              const isActive = activeFilterIds.includes(filter.id);
              return (
                <button
                  key={filter.id}
                  role="menuitem"
                  type="button"
                  disabled={isActive}
                  onClick={() => handleSelect(filter.id)}
                  className={cn(
                    'flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm',
                    'hover:bg-accent hover:text-accent-foreground',
                    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                    'transition-colors',
                    isActive && 'cursor-default opacity-40 hover:bg-transparent hover:text-current'
                  )}
                >
                  {filter.icon && (
                    <span className="flex size-4 items-center justify-center" aria-hidden="true">
                      {filter.icon}
                    </span>
                  )}
                  <span>{filter.label}</span>
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

AddFilterDropdown.displayName = 'AddFilterDropdown';

export { AddFilterDropdown };
