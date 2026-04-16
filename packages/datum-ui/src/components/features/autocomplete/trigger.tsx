import type { AutocompleteOption } from './autocomplete.types'
import { ChevronDown } from 'lucide-react'
import * as React from 'react'
import { cn } from '../../../utils/cn'
import { LoaderOverlay } from '../loader-overlay'

interface TriggerProps {
  selectedOption: AutocompleteOption | undefined
  renderValue?: (option: any) => React.ReactNode
  placeholder: string
  loading: boolean
  disabled: boolean
  open: boolean
  id?: string
  className?: string
}

function Trigger({ ref, selectedOption, renderValue, placeholder, loading, disabled, open, id, className, ...rest }: TriggerProps & { ref?: React.RefObject<HTMLButtonElement | null> }) {
  let displayContent: React.ReactNode
  if (!selectedOption) {
    displayContent = <span className="text-muted-foreground">{placeholder}</span>
  }
  else if (renderValue) {
    displayContent = renderValue(selectedOption)
  }
  else {
    displayContent = <span className="truncate">{selectedOption.label}</span>
  }

  return (
    <button
      ref={ref}
      type="button"
      id={id}
      role="combobox"
      aria-expanded={open}
      disabled={disabled || loading}
      className={cn(
        'text-input-foreground placeholder:text-input-placeholder',
        'border-input-border bg-input-background/50 relative flex h-10 w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-all',
        'focus-visible:border-input-focus-border focus-visible:shadow-(--input-focus-shadow)',
        'focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-hidden',
        'aria-invalid:border-destructive',
        (disabled || loading) && 'cursor-not-allowed opacity-50',
        className,
      )}
      {...rest}
    >
      {loading && <LoaderOverlay />}
      <div className="min-w-0 flex-1">{displayContent}</div>
      <ChevronDown className="text-muted-foreground ml-2 size-4 shrink-0" />
    </button>
  )
}

Trigger.displayName = 'AutocompleteTrigger'

export { Trigger }
