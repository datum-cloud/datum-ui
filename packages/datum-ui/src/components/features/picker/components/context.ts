import type { RefObject } from 'react'
import type { BreakpointTier } from '../../../../hooks/use-breakpoint'
import type {
  AllowedStep,
  HourCycle,
  PickerCommit,
  PickerMode,
  PickerPreset,
  PickerValueOf,
} from '../types'
import { createContext, useContext } from 'react'

export interface PickerContextValue<M extends PickerMode = PickerMode> {
  mode: M
  timezone: string
  effectiveCommit: PickerCommit
  hourCycle: HourCycle
  step: AllowedStep
  hideTimezone: boolean
  responsive: boolean
  presets: readonly PickerPreset[]
  /** Element reference for keyboard shortcut scoping. */
  rootRef: RefObject<HTMLDivElement | null>
  /** Current viewport bucket — drives mobile sheet decisions in primitives. */
  breakpoint: BreakpointTier
  state: {
    pendingValue: PickerValueOf<M>
    open: boolean
    selectedPresetKey: string | undefined
    monthFrom: Date | undefined
    monthTo: Date | undefined
  }
  actions: {
    setSingleDate: (d: Date | null) => void
    setSingleTime: (t: string | null) => void
    setSingleDatetime: (iso: string | null) => void
    setRange: (r: { from: Date, to: Date } | null) => void
    setTimeRange: (r: { from: string, to: string } | null) => void
    setDatetimeRange: (r: { from: string, to: string } | null) => void
    selectPreset: (range: { from: Date, to: Date }, key: string) => void
    setMonthFrom: (d: Date) => void
    setMonthTo: (d: Date) => void
    open: () => void
    close: () => void
    apply: () => void
    reset: () => void
    cancel: () => void
    clear: () => void
  }
}

export const PickerContext = createContext<PickerContextValue | null>(null)

/** Throws when used outside `<Picker.Root>` — enforces compound-component discipline. */
export function usePickerContext<M extends PickerMode = PickerMode>(): PickerContextValue<M> {
  const ctx = useContext(PickerContext)
  if (!ctx) {
    throw new Error('Picker primitives must be rendered inside <Picker.Root>')
  }
  return ctx as PickerContextValue<M>
}
