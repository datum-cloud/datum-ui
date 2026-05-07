import type { ReactNode } from 'react'
import type {
  AllowedStep,
  HourCycle,
  PickerCommit,
  PickerMode,
  PickerPreset,
  PickerValueOf,
} from '../types'
import type { PickerContextValue } from './context'
import { useCallback, useMemo, useRef } from 'react'
import { useBreakpoint } from '../../../../hooks/use-breakpoint'
import { useDateConstraints } from '../../../base/date-picker'
import { useKeyboardShortcuts } from '../hooks/use-keyboard-shortcuts'
import { usePickerState } from '../hooks/use-picker-state'
import { usePresets } from '../hooks/use-presets'
import { resolveCommit } from '../utils/commit'
import { getBrowserTimezone } from '../utils/timezone'
import { PickerContext } from './context'

export interface PickerRootProps<M extends PickerMode> {
  mode: M
  value: PickerValueOf<M>
  onChange: (value: PickerValueOf<M>) => void
  /** When `commit` is omitted, defaults to `'apply'` for range modes and `'immediate'` otherwise. */
  commit?: PickerCommit
  /** IANA timezone for time-bearing modes. Default: browser-detected. */
  timezone?: string
  /** Time slot step in minutes. Default `15`. */
  step?: AllowedStep
  /** Display cycle for time labels. Default detected from locale; falls back to `'24'`. */
  hourCycle?: HourCycle
  /** Hide the always-on timezone indicator. Default `false`. */
  hideTimezone?: boolean
  /** Force desktop popover even on mobile. Default `true` (responsive). */
  responsive?: boolean
  /** Custom preset list. When set, replaces defaults. */
  presets?: readonly PickerPreset[]
  /** Filter applied to default presets. Ignored when `presets` is set. */
  excludePresets?: readonly string[]
  /** Date constraints applied to calendar + preset filtering. */
  minDate?: Date
  maxDate?: Date
  disablePast?: boolean
  disableFuture?: boolean
  children: ReactNode
}

function detectHourCycle(): HourCycle {
  try {
    const opts = new Intl.DateTimeFormat(undefined, { hour: 'numeric' }).resolvedOptions() as
      Intl.ResolvedDateTimeFormatOptions & { hourCycle?: string }
    if (opts.hourCycle === 'h23' || opts.hourCycle === 'h24')
      return '24'
    return '12'
  }
  catch {
    return '24'
  }
}

export function PickerRoot<M extends PickerMode>({
  mode,
  value,
  onChange,
  commit,
  timezone: timezoneProp,
  step = 15,
  hourCycle: hourCycleProp,
  hideTimezone = false,
  responsive = true,
  presets: customPresets,
  excludePresets,
  minDate,
  maxDate,
  disablePast,
  disableFuture,
  children,
}: PickerRootProps<M>) {
  const rootRef = useRef<HTMLDivElement>(null)
  const breakpoint = useBreakpoint()
  const timezone = timezoneProp ?? getBrowserTimezone()
  const hourCycle = hourCycleProp ?? detectHourCycle()

  const { isDateDisabled } = useDateConstraints({
    minDate,
    maxDate,
    disablePast,
    disableFuture,
  })

  const presets = usePresets({
    mode,
    timezone,
    custom: customPresets,
    excludeKeys: excludePresets,
    isDateDisabled,
  })

  const { state, actions } = usePickerState({ mode, value, onChange, commit, timezone })
  const effectiveCommit = resolveCommit(mode, commit)

  const handlePresetSelect = useCallback(
    (preset: PickerPreset) => {
      const range = preset.getRange(timezone)
      actions.selectPreset(range, preset.key)
    },
    [timezone, actions],
  )

  // Bind preset keyboard shortcuts to the root element while open.
  useKeyboardShortcuts({
    rootRef,
    presets,
    onSelect: handlePresetSelect,
    enabled: state.open,
  })

  const ctx = useMemo<PickerContextValue<M>>(() => ({
    mode,
    timezone,
    effectiveCommit,
    hourCycle,
    step,
    hideTimezone,
    responsive,
    presets,
    rootRef,
    breakpoint,
    state,
    actions,
  }), [mode, timezone, effectiveCommit, hourCycle, step, hideTimezone, responsive, presets, breakpoint, state, actions])

  return (
    <PickerContext.Provider value={ctx as PickerContextValue}>
      <div ref={rootRef}>{children}</div>
    </PickerContext.Provider>
  )
}

PickerRoot.displayName = 'Picker.Root'

/**
 * Public namespace export. Subsequent tasks add Trigger, Content, etc.
 */
export const Picker = {
  Root: PickerRoot,
} as {
  Root: typeof PickerRoot
}
