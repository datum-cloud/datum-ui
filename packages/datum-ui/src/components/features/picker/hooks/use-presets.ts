import type { PickerMode, PickerPreset } from '../types'
import { useMemo } from 'react'
import { getDefaultPresets } from '../presets/defaults'

interface UsePresetsArgs {
  mode: PickerMode
  timezone: string
  /** Caller-supplied presets. When set, replaces defaults entirely. */
  custom?: readonly PickerPreset[]
  /** Filter applied to defaults — ignored when `custom` is supplied. */
  excludeKeys?: readonly string[]
  /** Used to filter out presets whose range falls on a disabled date. */
  isDateDisabled: (date: Date) => boolean
}

/**
 * Resolve the effective list of presets for a picker.
 *
 * Resolution order:
 *   1. If `custom` is provided, use it as-is (no exclusion, no constraint check).
 *   2. Otherwise: defaults for `mode`, minus `excludeKeys`, minus presets
 *      whose `getRange(timezone).from` or `.to` is rejected by `isDateDisabled`.
 *
 * Returns a memoized array; identity-stable when inputs haven't changed.
 */
export function usePresets({
  mode,
  timezone,
  custom,
  excludeKeys,
  isDateDisabled,
}: UsePresetsArgs): readonly PickerPreset[] {
  return useMemo(() => {
    if (custom)
      return custom

    const base = getDefaultPresets(mode)
    const excludeSet = new Set(excludeKeys ?? [])

    return base.filter((preset) => {
      if (excludeSet.has(preset.key))
        return false
      const range = preset.getRange(timezone)
      if (isDateDisabled(range.from))
        return false
      if (isDateDisabled(range.to))
        return false
      return true
    })
  }, [mode, timezone, custom, excludeKeys, isDateDisabled])
}
