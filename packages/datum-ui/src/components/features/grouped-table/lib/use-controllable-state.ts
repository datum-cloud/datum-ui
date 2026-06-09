import { useCallback, useState } from 'react'

export type Updater<T> = T | ((prev: T) => T)

/**
 * Uncontrolled-by-default state with an optional controlled override.
 * When `controlled` is undefined the hook owns the value; otherwise the prop wins.
 * `onChange` always fires. Accepts TanStack-style updater functions.
 */
export function useControllableState<T>(
  controlled: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): readonly [T, (next: Updater<T>) => void] {
  const [internal, setInternal] = useState<T>(defaultValue)
  const isControlled = controlled !== undefined
  const value: T = isControlled ? controlled : internal

  const setValue = useCallback(
    (next: Updater<T>) => {
      const resolved
        = typeof next === 'function' ? (next as (prev: T) => T)(value) : next
      if (!isControlled)
        setInternal(resolved)
      onChange?.(resolved)
    },
    [isControlled, onChange, value],
  )

  return [value, setValue] as const
}
