import type { z } from 'zod'
import type { Normalizer } from './parse'
import * as React from 'react'
import { cn } from '../../../utils/cn'
import { DEFAULT_DELIMITERS } from './parse'
import { TagInputField } from './tag-input-field'
import { useTagsInput } from './use-tags-input'

interface TagsInputProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string[]
  onValueChange: (value: string[]) => void
  placeholder?: string
  maxItems?: number
  minItems?: number
  /**
   * Keys that trigger tag confirmation. Defaults to ['Enter', ','].
   * Extend for specific use cases, e.g. [',', 'Enter', ';', ' '] for emails.
   */
  delimiters?: string[]
  /**
   * Optional function to normalize a tag value before validation and adding.
   * Runs after trimming. Returning a falsy value rejects the tag.
   * Useful for case normalization, e.g. (v) => v.toLowerCase()
   */
  normalizer?: Normalizer
  /**
   * Optional Zod schema for validating individual tag values
   */
  validator?: z.ZodType<string>
  /**
   * Optional callback for handling validation errors externally
   * This is useful when integrating with form libraries like conform-to
   */
  onValidationError?: (error: string | null) => void
  /**
   * Optional external error message to display
   * This is useful when the error comes from a form library like conform-to
   */
  error?: string | string[]
  /**
   * Whether to show validation errors inline
   * Set to false when handling errors externally with onValidationError
   */
  showValidationErrors?: boolean
  name?: string
  key?: string
}

interface TagsInputContextProps {
  value: string[]
  onValueChange: (value: any) => void
  inputValue: string
  setInputValue: React.Dispatch<React.SetStateAction<string>>
  activeIndex: number
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>
  validator?: z.ZodType<string>
  validationError: string | null
  setValidationError: React.Dispatch<React.SetStateAction<string | null>>
}

const TagInputContext = React.createContext<TagsInputContextProps | null>(null)

export function TagsInput({ ref, value, onValueChange, placeholder, maxItems, minItems, className, dir, delimiters = DEFAULT_DELIMITERS, normalizer, validator, onValidationError, error, showValidationErrors = true, name, key, ...props }: TagsInputProps & { ref?: React.RefObject<HTMLDivElement | null> }) {
  const input = useTagsInput({
    value,
    onValueChange,
    maxItems,
    minItems,
    delimiters,
    normalizer,
    validator,
    onValidationError,
    dir,
  })

  const {
    inputValue,
    setInputValue,
    activeIndex,
    setActiveIndex,
    validationError,
    setValidationError,
  } = input

  const contextValue = React.useMemo(
    () => ({
      value,
      onValueChange,
      inputValue,
      setInputValue,
      activeIndex,
      setActiveIndex,
      validator,
      validationError,
      setValidationError,
    }),
    [value, onValueChange, inputValue, setInputValue, activeIndex, setActiveIndex, validator, validationError, setValidationError],
  )

  return (
    <TagInputContext value={contextValue}>
      <div
        {...props}
        ref={ref}
        dir={dir}
        className={cn(
          'border-input-border bg-input-background/50 text-input-foreground flex min-h-10 flex-wrap items-center gap-1 overflow-hidden rounded-lg border px-3 py-2 transition-all',
          activeIndex === -1
            ? 'focus-within:border-input-focus-border focus-within:shadow-(--input-focus-shadow) focus-within:ring-0 focus-within:ring-offset-0 focus-within:outline-hidden'
            : 'focus-within:ring-0 focus-within:ring-offset-0 focus-within:outline-hidden',
          className,
        )}
        suppressHydrationWarning
      >
        {/* Show validation errors if enabled or show external errors */}
        {((showValidationErrors && validationError) || error) && (
          <div className="mb-1 w-full text-sm text-red-500">
            {error ? (Array.isArray(error) ? error[0] : error) : validationError}
          </div>
        )}

        <TagInputField value={value} placeholder={placeholder} input={input} />
      </div>
      {/* Hidden input for form submission. The visible wrapper above already
          carries any consumer-provided `id` (via `...props`), so the select must
          not duplicate it — a duplicate DOM id breaks label association and a11y
          tooling (BUG-158). */}
      <select
        name={name}
        key={key}
        multiple
        value={value}
        defaultValue={undefined}
        className="absolute top-0 left-0 h-0 w-0"
        onChange={() => undefined}
      >
        <option value=""></option>
        {value.map((option, idx) => (
          <option key={`${option}-${idx}`} value={option} />
        ))}
      </select>
    </TagInputContext>
  )
}

TagsInput.displayName = 'TagsInput'
