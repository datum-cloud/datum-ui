import * as React from 'react';
import { cn } from '@repo/shadcn/lib/utils';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@repo/shadcn/ui/popover';
import { CalendarIcon, ChevronDownIcon } from 'lucide-react';
import { Button } from '../button';
import { Input } from '../input';
import { Label } from '../label';

export interface TimeRangePreset {
  key: string;
  label: string;
}

export interface TimeRangeDropdownProps {
  presets: TimeRangePreset[];
  selectedPreset: string;
  onPresetSelect: (presetKey: string) => void;
  onCustomRangeApply: (start: string, end: string) => void;
  customStart?: string;
  customEnd?: string;
  disabled?: boolean;
  className?: string;
  displayLabel?: string;
}

const CUSTOM_RANGE_KEY = 'custom';

const TimeRangeDropdown = ({
  presets,
  selectedPreset,
  onPresetSelect,
  onCustomRangeApply,
  customStart = '',
  customEnd = '',
  disabled = false,
  className,
  displayLabel,
}: TimeRangeDropdownProps) => {
  const id = React.useId();
  const [open, setOpen] = React.useState(false);
  const [showCustom, setShowCustom] = React.useState(
    selectedPreset === CUSTOM_RANGE_KEY
  );
  const [localStart, setLocalStart] = React.useState(customStart);
  const [localEnd, setLocalEnd] = React.useState(customEnd);

  // Sync external customStart/customEnd into local state when popover opens
  React.useEffect(() => {
    if (open) {
      setLocalStart(customStart);
      setLocalEnd(customEnd);
      setShowCustom(selectedPreset === CUSTOM_RANGE_KEY);
    }
  }, [open, customStart, customEnd, selectedPreset]);

  const selectedPresetLabel = React.useMemo(() => {
    if (displayLabel) return displayLabel;
    if (selectedPreset === CUSTOM_RANGE_KEY) {
      if (customStart && customEnd) {
        return `${customStart} – ${customEnd}`;
      }
      return 'Custom range';
    }
    const found = presets.find((p) => p.key === selectedPreset);
    return found?.label ?? 'Select range';
  }, [displayLabel, selectedPreset, customStart, customEnd, presets]);

  const handlePresetClick = (key: string) => {
    if (key === CUSTOM_RANGE_KEY) {
      setShowCustom(true);
    } else {
      onPresetSelect(key);
      setShowCustom(false);
      setOpen(false);
    }
  };

  const handleCustomApply = () => {
    if (localStart && localEnd) {
      onCustomRangeApply(localStart, localEnd);
      setOpen(false);
    }
  };

  const handleCustomKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCustomApply();
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label={`Time range: ${selectedPresetLabel}. Click to change.`}
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
          <CalendarIcon className="size-3.5" aria-hidden="true" />
          <span className="max-w-40 truncate">{selectedPresetLabel}</span>
          <ChevronDownIcon
            className={cn('size-3.5 transition-transform', open && 'rotate-180')}
            aria-hidden="true"
          />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-56 p-1" align="start">
        {!showCustom ? (
          <div role="menu" aria-label="Time range presets">
            {presets.map((preset) => {
              const isSelected = selectedPreset === preset.key;
              return (
                <button
                  key={preset.key}
                  role="menuitemradio"
                  aria-checked={isSelected}
                  type="button"
                  onClick={() => handlePresetClick(preset.key)}
                  className={cn(
                    'flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm',
                    'hover:bg-accent hover:text-accent-foreground',
                    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                    'transition-colors',
                    isSelected && 'bg-accent text-accent-foreground font-medium'
                  )}
                >
                  {preset.label}
                </button>
              );
            })}
            <div className="my-1 border-t border-border" aria-hidden="true" />
            <button
              role="menuitemradio"
              aria-checked={selectedPreset === CUSTOM_RANGE_KEY}
              type="button"
              onClick={() => handlePresetClick(CUSTOM_RANGE_KEY)}
              className={cn(
                'flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm',
                'hover:bg-accent hover:text-accent-foreground',
                'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                'transition-colors',
                selectedPreset === CUSTOM_RANGE_KEY && 'bg-accent text-accent-foreground font-medium'
              )}
            >
              Custom range
            </button>
          </div>
        ) : (
          <div className="p-2 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor={`${id}-start`} className="text-xs">
                Start
              </Label>
              <Input
                id={`${id}-start`}
                type="datetime-local"
                value={localStart}
                onChange={(e) => setLocalStart(e.target.value)}
                onKeyDown={handleCustomKeyDown}
                className="h-8 text-xs"
                aria-label="Custom range start date and time"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`${id}-end`} className="text-xs">
                End
              </Label>
              <Input
                id={`${id}-end`}
                type="datetime-local"
                value={localEnd}
                onChange={(e) => setLocalEnd(e.target.value)}
                onKeyDown={handleCustomKeyDown}
                className="h-8 text-xs"
                aria-label="Custom range end date and time"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                htmlType="button"
                type="secondary"
                theme="outline"
                size="xs"
                onClick={() => setShowCustom(false)}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                htmlType="button"
                type="primary"
                theme="solid"
                size="xs"
                disabled={!localStart || !localEnd}
                onClick={handleCustomApply}
                className="flex-1"
              >
                Apply
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

TimeRangeDropdown.displayName = 'TimeRangeDropdown';

export { TimeRangeDropdown };
