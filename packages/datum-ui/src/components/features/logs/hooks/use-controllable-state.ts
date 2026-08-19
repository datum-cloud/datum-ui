import { useCallback, useState } from 'react'

export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: {
  value?: T
  defaultValue: T
  onChange?: (value: T) => void
}): [T, (value: T) => void] {
  const [internal, setInternal] = useState(defaultValue)
  const isControlled = value !== undefined
  const current = isControlled ? value : internal

  const setValue = useCallback((next: T) => {
    if (!isControlled)
      setInternal(next)
    onChange?.(next)
  }, [isControlled, onChange])

  return [current, setValue]
}
