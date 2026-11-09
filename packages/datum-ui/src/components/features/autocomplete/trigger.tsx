import type { AutocompleteOption } from './autocomplete.types'
import { ChevronDown } from 'lucide-react'
import * as React from 'react'
import { cn } from '../../../utils/cn'
import { fieldIconClassName, fieldPlaceholderClassName, fieldTriggerClassName } from '../../../utils/field-styles'
import { Icon } from '../../icons/icon-wrapper'
import { LoaderOverlay } from '../loader-overlay'

interface TriggerProps {
  selectedOption: AutocompleteOption | undefined
  /**
   * Raw string for a creatable value not present in `options`. Rendered as plain
   * text so `renderValue` is never called with a fabricated partial option.
   */
  createdValue?: string
  renderValue?: (option: any) => React.ReactNode
  placeholder: string
  loading: boolean
  disabled: boolean
  open: boolean
  id?: string
  className?: string
}

function Trigger({ ref, selectedOption, createdValue, renderValue, placeholder, loading, disabled, open, id, className, ...rest }: TriggerProps & { ref?: React.RefObject<HTMLButtonElement | null> }) {
  let displayContent: React.ReactNode
  if (selectedOption) {
    displayContent = renderValue
      ? renderValue(selectedOption)
      : <span className="truncate">{selectedOption.label}</span>
  }
  else if (createdValue) {
    displayContent = <span className="truncate">{createdValue}</span>
  }
  else {
    displayContent = <span className={cn('truncate', fieldPlaceholderClassName)}>{placeholder}</span>
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
        fieldTriggerClassName,
        'relative h-10 justify-between py-2',
        (disabled || loading) && 'cursor-not-allowed opacity-50',
        className,
      )}
      {...rest}
    >
      {loading && <LoaderOverlay />}
      <div className="min-w-0 flex-1">{displayContent}</div>
      <Icon icon={ChevronDown} className={fieldIconClassName} aria-hidden="true" />
    </button>
  )
}

Trigger.displayName = 'AutocompleteTrigger'

export { Trigger }
