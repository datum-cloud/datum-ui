import type { PickerCommit, PickerMode } from '../types'
import { isDateBearingMode, isRangeMode, isTimeBearingMode } from '../types'

/**
 * Resolves the effective commit semantics for a picker.
 *
 * - Date + time combined modes (`datetime` / `datetime-range` /
 *   `date-range-time`) **always** commit on Apply, regardless of the
 *   caller-supplied override. Picking a date alone shouldn't publish a
 *   value with an unconfirmed 00:00 time — the user needs to set the
 *   time too, then explicitly Apply. The wrappers don't expose a
 *   `commit` prop for these modes; primitive consumers can still pass
 *   one through `Picker.Root` but it's silently overridden here.
 * - Range modes (`date-range`, `time-range`) default to `'apply'`.
 * - Everything else defaults to `'immediate'`.
 */
export function resolveCommit(mode: PickerMode, commit: PickerCommit | undefined): PickerCommit {
  if (isDateBearingMode(mode) && isTimeBearingMode(mode))
    return 'apply'
  return commit ?? (isRangeMode(mode) ? 'apply' : 'immediate')
}
