/**
 * Picker mode — discriminator for the 7 useful cells of the date×time matrix.
 * (8 cells exist; single-date+time-range collapses into datetime-range with same-day from/to.)
 */
export type PickerMode
  = | 'date' // single date, no time
    | 'date-range' // date range, no time
    | 'time' // single time-of-day
    | 'time-range' // time-of-day range
    | 'datetime' // single instant (UTC ISO + display TZ)
    | 'datetime-range' // instant range (covers single-day and multi-day)
    | 'date-range-time' // date range with single time-of-day on each end

/** When does onChange fire? */
export type PickerCommit = 'immediate' | 'apply'

/** A preset is a labeled, TZ-aware range factory. */
export interface PickerPreset {
  /** Stable identifier — persisted in emitted value for URL hydration. */
  key: string
  /** Display label (user-facing). */
  label: string
  /** Optional keyboard shortcut (single character; case-insensitive). */
  shortcut?: string
  /** Compute the range in the user's selected timezone. Lazy and TZ-aware. */
  getRange: (timezone: string) => { from: Date, to: Date }
}

// ─── Per-mode value types ──────────────────────────────────────────────

export type DateValue = Date | null

export type DateRangeValue = {
  from: Date
  to: Date
  /** Set when the range came from a preset click. Undefined for manual ranges. */
  preset?: string
} | null

/** Time-of-day in `"HH:mm"` 24-hour format. Display formatting is separate. */
export type TimeValue = string | null

export type TimeRangeValue = {
  from: string
  to: string
  preset?: string
} | null

/** Datetime as UTC ISO string. Display timezone is a separate prop. */
export type DatetimeValue = string | null

export type DatetimeRangeValue = {
  from: string
  to: string
  preset?: string
} | null

export type DateRangeTimeValue = {
  from: string
  to: string
  preset?: string
} | null

// ─── Mode → value type mapping ─────────────────────────────────────────

export interface PickerValueMap {
  'date': DateValue
  'date-range': DateRangeValue
  'time': TimeValue
  'time-range': TimeRangeValue
  'datetime': DatetimeValue
  'datetime-range': DatetimeRangeValue
  'date-range-time': DateRangeTimeValue
}

export type PickerValueOf<M extends PickerMode> = PickerValueMap[M]

// ─── Convenience predicates ────────────────────────────────────────────

export const RANGE_MODES = [
  'date-range',
  'time-range',
  'datetime-range',
  'date-range-time',
] as const satisfies readonly PickerMode[]

export type RangeMode = typeof RANGE_MODES[number]

export const TIME_BEARING_MODES = [
  'time',
  'time-range',
  'datetime',
  'datetime-range',
  'date-range-time',
] as const satisfies readonly PickerMode[]

export type TimeBearingMode = typeof TIME_BEARING_MODES[number]

export const DATE_BEARING_MODES = [
  'date',
  'date-range',
  'datetime',
  'datetime-range',
  'date-range-time',
] as const satisfies readonly PickerMode[]

export type DateBearingMode = typeof DATE_BEARING_MODES[number]

// Static assertion: every PickerMode appears in at least one of
// DATE_BEARING_MODES ∪ TIME_BEARING_MODES. Adding a new mode without
// classifying it here is a compile-time error.
type _ModeAxisCoverage = Exclude<PickerMode, DateBearingMode | TimeBearingMode> extends never ? true : never
const _modeAxisCoverage: _ModeAxisCoverage = true
void _modeAxisCoverage

export function isRangeMode(mode: PickerMode): mode is RangeMode {
  return (RANGE_MODES as readonly PickerMode[]).includes(mode)
}

export function isTimeBearingMode(mode: PickerMode): mode is TimeBearingMode {
  return (TIME_BEARING_MODES as readonly PickerMode[]).includes(mode)
}

export function isDateBearingMode(mode: PickerMode): mode is DateBearingMode {
  return (DATE_BEARING_MODES as readonly PickerMode[]).includes(mode)
}

// ─── Hour cycle ────────────────────────────────────────────────────────

export type HourCycle = '12' | '24'

// ─── Allowed step values for time slot generation ──────────────────────

export const ALLOWED_STEPS = [1, 5, 10, 15, 30, 60] as const
export type AllowedStep = typeof ALLOWED_STEPS[number]
