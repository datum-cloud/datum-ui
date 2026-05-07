import type { OptionPickerOption } from '../../../base/option-picker'
import type { AllowedStep, HourCycle } from '../types'
import { useMemo } from 'react'
import { formatTimeLabel, parseTimeString } from '../utils/format'

interface UseTimeSlotsArgs {
  /** Inclusive lower bound in `HH:mm`. Default `"00:00"`. */
  min?: string
  /** Inclusive upper bound in `HH:mm`. Default `"23:59"`. */
  max?: string
  /** Step in minutes. Default `15`. */
  step?: AllowedStep
  /** Display label cycle. Default `'24'`. */
  hourCycle?: HourCycle
}

function timeToMinutes(t: string): number | null {
  const parsed = parseTimeString(t)
  return parsed ? parsed.h * 60 + parsed.m : null
}

function minutesToTime(total: number): string {
  const h = Math.floor(total / 60)
  const m = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/**
 * Generate an `OptionPickerOption[]` of HH:mm slots for the slot-dropdown UI.
 *
 * Slots are produced in pure minute arithmetic — DST is not considered (slots
 * are wall-clock times of day, independent of any specific calendar date).
 */
export function useTimeSlots({
  min,
  max,
  step = 15,
  hourCycle = '24',
}: UseTimeSlotsArgs): OptionPickerOption[] {
  return useMemo(() => {
    const minMinutes = min ? (timeToMinutes(min) ?? 0) : 0
    const maxMinutes = max ? (timeToMinutes(max) ?? 23 * 60 + 59) : 23 * 60 + 59
    const slots: OptionPickerOption[] = []
    for (let m = minMinutes; m <= maxMinutes; m += step) {
      if (m >= 24 * 60)
        break
      const value = minutesToTime(m)
      slots.push({ value, label: formatTimeLabel(value, hourCycle) })
    }
    return slots
  }, [min, max, step, hourCycle])
}
