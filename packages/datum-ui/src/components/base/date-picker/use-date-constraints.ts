import type { DateConstraints } from './types'
import { endOfDay, startOfDay } from 'date-fns'
import { useCallback, useMemo } from 'react'

export interface UseDateConstraintsReturn {
  effectiveMinDate: Date | undefined
  effectiveMaxDate: Date | undefined
  isDateDisabled: (date: Date) => boolean
}

export function useDateConstraints({
  minDate,
  maxDate,
  disablePast,
  disableFuture,
}: DateConstraints): UseDateConstraintsReturn {
  const today = useMemo(() => new Date(), [])

  const effectiveMinDate = useMemo(() => {
    let min = minDate
    if (disablePast) {
      const todayStart = startOfDay(today)
      min = min ? (min > todayStart ? min : todayStart) : todayStart
    }
    return min
  }, [minDate, disablePast, today])

  const effectiveMaxDate = useMemo(() => {
    let max = maxDate
    if (disableFuture) {
      const todayEnd = endOfDay(today)
      max = max ? (max < todayEnd ? max : todayEnd) : todayEnd
    }
    return max
  }, [maxDate, disableFuture, today])

  const isDateDisabled = useCallback(
    (date: Date) => {
      if (effectiveMinDate && date < effectiveMinDate)
        return true
      if (effectiveMaxDate && date > effectiveMaxDate)
        return true
      return false
    },
    [effectiveMinDate, effectiveMaxDate],
  )

  return { effectiveMinDate, effectiveMaxDate, isDateDisabled }
}
