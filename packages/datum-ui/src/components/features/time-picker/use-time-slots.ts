import type { OptionPickerOption } from '../../base/option-picker'
import { useMemo } from 'react'

interface UseTimeSlotsArgs {
  min?: string
  max?: string
  step?: number
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h! * 60 + m!
}

function minutesToTime(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function formatTimeLabel(time: string): string {
  const [hStr, mStr] = time.split(':')
  let h = Number(hStr)
  const m = mStr
  const period = h >= 12 ? 'PM' : 'AM'
  if (h === 0)
    h = 12
  else if (h > 12)
    h -= 12
  return `${h}:${m} ${period}`
}

export function useTimeSlots({ min, max, step = 15 }: UseTimeSlotsArgs): OptionPickerOption[] {
  return useMemo(() => {
    const minMinutes = min ? timeToMinutes(min) : 0
    const maxMinutes = max ? timeToMinutes(max) : 23 * 60 + 59
    const slots: OptionPickerOption[] = []

    for (let m = minMinutes; m <= maxMinutes; m += step) {
      if (m >= 24 * 60)
        break
      const value = minutesToTime(m)
      slots.push({ value, label: formatTimeLabel(value) })
    }

    return slots
  }, [min, max, step])
}
