import type { z } from 'zod'
import * as React from 'react'
import { getFieldConstraints } from '../utils/get-field-constraints'

export interface UseDisplayTouchedReturn {
  /** Array of field names that have been display-touched */
  displayTouchedFields: string[]
  /** Mark a single field as display-touched */
  markFieldTouched: (fieldName: string) => void
  /** Mark all schema fields as display-touched (e.g. on submit attempt) */
  markAllFieldsTouched: () => void
}

/**
 * Shared display-level touched tracking, independent of adapter-specific blur tracking.
 *
 * "Display-touched" controls whether a field's errors are shown in the UI.
 * This is separate from the adapter's `isTouched` (which tracks focusout events).
 *
 * Used by both RHF and Conform adapters to provide consistent error display
 * behaviour across validation modes (onChange, onBlur, onSubmit).
 */
export function useDisplayTouched(schema: z.ZodType): UseDisplayTouchedReturn {
  const [touchedSet, setTouchedSet] = React.useState<Set<string>>(new Set())

  const markFieldTouched = React.useCallback((fieldName: string) => {
    setTouchedSet((prev) => {
      if (prev.has(fieldName))
        return prev
      const next = new Set(prev)
      next.add(fieldName)
      return next
    })
  }, [])

  const markAllFieldsTouched = React.useCallback(() => {
    const allFieldNames = Object.keys(getFieldConstraints(schema))
    setTouchedSet(new Set(allFieldNames))
  }, [schema])

  const displayTouchedFields = React.useMemo(
    () => Array.from(touchedSet),
    [touchedSet],
  )

  return { displayTouchedFields, markFieldTouched, markAllFieldsTouched }
}
