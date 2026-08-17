import { useEffect, useState } from 'react'

/** Default debounce delay for search inputs, in milliseconds. */
export const DEFAULT_SEARCH_DEBOUNCE_MS = 300

/**
 * Controlled search input with debounced propagation.
 *
 * Mirrors an external `value` locally so typing feels instant, re-syncs when the
 * external value changes (e.g. cleared elsewhere), and pushes local edits back
 * through `onChange` only after `delay` ms of inactivity.
 *
 * Returns a `[inputValue, setInputValue]` tuple for binding to an input element.
 *
 * @param value - The controlled/external search value.
 * @param onChange - Called with the debounced local value when it diverges.
 * @param delay - Debounce delay in milliseconds. Defaults to 300ms.
 */
export function useDebouncedSearchInput(
  value: string,
  onChange: (value: string) => void,
  delay: number = DEFAULT_SEARCH_DEBOUNCE_MS,
): readonly [string, (next: string) => void] {
  const [inputValue, setInputValue] = useState(value)

  // Re-sync local state when the external value changes.
  useEffect(() => {
    setInputValue(value)
  }, [value])

  // Push local edits back to the consumer after the debounce window.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== value)
        onChange(inputValue)
    }, delay)

    return () => clearTimeout(timer)
  }, [inputValue, value, delay, onChange])

  return [inputValue, setInputValue] as const
}
