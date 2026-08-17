import type * as React from 'react'
import type { UseTagsInputResult } from './use-tags-input'
import { X as RemoveIcon } from 'lucide-react'
import { Badge, Input } from '../..'
import { cn } from '../../../utils/cn'
import { Icon } from '../../icons/icon-wrapper'

interface TagInputFieldProps {
  value: string[]
  placeholder?: string
  input: UseTagsInputResult
}

/**
 * Presentational layer for {@link TagsInput}: renders the tag chips and the
 * text input, wiring them to the handlers produced by `useTagsInput`.
 */
export function TagInputField({ value, placeholder, input }: TagInputFieldProps) {
  const {
    inputValue,
    activeIndex,
    setActiveIndex,
    disableInput,
    disableButton,
    removeValue,
    handleKeyDown,
    handlePaste,
    handleBlur,
    handleSelect,
    handleChange,
    mousePreventDefault,
  } = input

  return (
    <>
      {value.map((item, index) => (
        <Badge
          tabIndex={activeIndex !== -1 ? 0 : activeIndex}
          key={item}
          aria-disabled={disableButton}
          data-active={activeIndex === index}
          className={cn(
            'data-[active=\'true\']:ring-muted-foreground relative flex items-center gap-1 truncate rounded px-1 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 data-[active=\'true\']:ring-2',
          )}
          type="secondary"
        >
          <span className="text-xs">{item}</span>
          <button
            type="button"
            aria-label={`Remove ${item} option`}
            aria-roledescription="button to remove option"
            disabled={disableButton}
            onMouseDown={mousePreventDefault}
            onClick={() => removeValue(item)}
            className="disabled:cursor-not-allowed"
          >
            <span className="sr-only">
              Remove
              {item}
              {' '}
              option
            </span>
            <Icon icon={RemoveIcon} className="hover:stroke-destructive h-4 w-4" />
          </button>
        </Badge>
      ))}
      <Input
        tabIndex={0}
        aria-label="input tag"
        disabled={disableInput}
        // A chip is active: keep the field controlled but non-editable so React
        // never warns about a `value` without `onChange` (BUG-159).
        readOnly={activeIndex !== -1}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onBlur={handleBlur}
        value={inputValue}
        onSelect={handleSelect}
        onChange={handleChange}
        placeholder={placeholder}
        onClick={() => setActiveIndex(-1)}
        className={cn(
          'text-input-foreground h-6 min-w-fit flex-1 border-0 bg-transparent p-0 py-1 shadow-none',
          'placeholder:text-input-placeholder',
          'focus-visible:border-transparent focus-visible:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0',
          activeIndex !== -1 && 'caret-transparent',
        )}
      />
    </>
  )
}

TagInputField.displayName = 'TagInputField'
