import type {
  PickerCommit,
  PickerMode,
  PickerValueOf,
} from '../types'
import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import { resolveCommit } from '../utils/commit'
import { dateToHHmm } from '../utils/format'
import { dateToZoned } from '../utils/timezone'

// ─── State shape ────────────────────────────────────────────────────────

interface PickerStateInternal {
  /** Pending edits, may differ from the prop until apply() / immediate commit. */
  pendingValue: unknown
  /** Popover / sheet open. */
  open: boolean
  /** Highlighted preset chip key (cleared on manual edit). */
  selectedPresetKey?: string
  /** Calendar pane state for range mode. */
  monthFrom?: Date
  monthTo?: Date
}

type Action
  = | { type: 'SET_SINGLE_DATE', payload: Date | null }
    | { type: 'SET_SINGLE_TIME', payload: string | null }
    | { type: 'SET_SINGLE_DATETIME', payload: string | null }
    | { type: 'SET_RANGE', payload: { from: Date, to: Date } | null }
    | { type: 'SET_TIME_RANGE', payload: { from: string, to: string } | null }
    | { type: 'SET_DATETIME_RANGE', payload: { from: string, to: string } | null }
    | { type: 'SELECT_PRESET', payload: { pendingValue: unknown, key: string, monthFrom: Date, monthTo: Date } }
    | { type: 'SET_MONTH_FROM', payload: Date }
    | { type: 'SET_MONTH_TO', payload: Date }
    | { type: 'OPEN' }
    | { type: 'CLOSE' }
    | { type: 'RESET_TO', payload: unknown }
    | { type: 'CLEAR_PRESET' }

function reducer(state: PickerStateInternal, action: Action): PickerStateInternal {
  switch (action.type) {
    case 'SET_SINGLE_DATE':
    case 'SET_SINGLE_TIME':
    case 'SET_SINGLE_DATETIME':
    case 'SET_RANGE':
    case 'SET_TIME_RANGE':
    case 'SET_DATETIME_RANGE':
      return { ...state, pendingValue: action.payload, selectedPresetKey: undefined }
    case 'SELECT_PRESET':
      return {
        ...state,
        pendingValue: action.payload.pendingValue,
        selectedPresetKey: action.payload.key,
        monthFrom: action.payload.monthFrom,
        monthTo: action.payload.monthTo,
      }
    case 'SET_MONTH_FROM':
      return { ...state, monthFrom: action.payload }
    case 'SET_MONTH_TO':
      return { ...state, monthTo: action.payload }
    case 'OPEN':
      return { ...state, open: true }
    case 'CLOSE':
      return { ...state, open: false }
    case 'RESET_TO':
      return { ...state, pendingValue: action.payload, selectedPresetKey: undefined }
    case 'CLEAR_PRESET':
      return { ...state, selectedPresetKey: undefined }
    default:
      return state
  }
}

// ─── Hook ───────────────────────────────────────────────────────────────

interface UsePickerStateArgs<M extends PickerMode> {
  mode: M
  value: PickerValueOf<M>
  onChange: (value: PickerValueOf<M>) => void
  /** Default: `'apply'` for range modes, `'immediate'` for single. */
  commit?: PickerCommit
  /** IANA timezone — used by `selectPreset` to encode Date ranges into mode-specific value shapes. */
  timezone: string
}

/**
 * Convert a preset's `{ from: Date, to: Date }` (real UTC instants) into the
 * value shape that the picker's `mode` actually emits.
 *
 * - `date-range`: pass through (Dates).
 * - `datetime-range` / `date-range-time`: `.toISOString()` — instants already match.
 * - `time-range`: extract wall-clock `HH:mm` in the active timezone.
 * - single `date` / `datetime` / `time`: collapse the preset window to its
 *   end instant (`range.to`, typically "now") — a preset in single mode should
 *   set that instant, never wipe the value to `null`.
 */
function presetValueForMode(
  mode: PickerMode,
  range: { from: Date, to: Date },
  key: string,
  timezone: string,
): unknown {
  switch (mode) {
    case 'date-range':
      return { from: range.from, to: range.to, preset: key }
    case 'datetime-range':
    case 'date-range-time':
      return {
        from: range.from.toISOString(),
        to: range.to.toISOString(),
        preset: key,
      }
    case 'time-range':
      return {
        from: dateToHHmm(dateToZoned(range.from, timezone)),
        to: dateToHHmm(dateToZoned(range.to, timezone)),
        preset: key,
      }
    case 'date':
      return range.to
    case 'datetime':
      return range.to.toISOString()
    case 'time':
      return dateToHHmm(dateToZoned(range.to, timezone))
    default:
      return null
  }
}

/**
 * Structural equality for picker value shapes (null, Date, `HH:mm` string,
 * ISO string, or `{ from, to, preset? }`). Lets prop→pending sync compare by
 * content rather than object identity.
 */
function isSameValue(a: unknown, b: unknown): boolean {
  if (a === b)
    return true
  if (a == null || b == null)
    return a === b
  if (a instanceof Date && b instanceof Date)
    return a.getTime() === b.getTime()
  if (typeof a === 'object' && typeof b === 'object') {
    const av = a as Record<string, unknown>
    const bv = b as Record<string, unknown>
    return (
      isSameValue(av.from, bv.from)
      && isSameValue(av.to, bv.to)
      && av.preset === bv.preset
    )
  }
  return false
}

interface UsePickerStateReturn<M extends PickerMode> {
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

export function usePickerState<M extends PickerMode>({
  mode,
  value,
  onChange,
  commit,
  timezone,
}: UsePickerStateArgs<M>): UsePickerStateReturn<M> {
  const effectiveCommit: PickerCommit = resolveCommit(mode, commit)

  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    pendingValue: value as unknown,
    open: false,
    selectedPresetKey: undefined,
    monthFrom: undefined,
    monthTo: undefined,
  }))

  // Sync prop → pending when the value changes externally, but:
  //  - ignore a new object identity carrying identical content (inline
  //    `{ from, to }` props re-created every render) — content compare, not
  //    identity (BUG-081);
  //  - while the popover is open, don't clobber in-progress *uncommitted* edits
  //    (pending diverged from the last synced value) — that would wipe the
  //    user's half-picked range / preset highlight on any unrelated parent
  //    re-render (BUG-072). A genuine external value change with no pending
  //    edits still syncs (e.g. controlled value swapped programmatically).
  const lastSyncedValueRef = useRef(value)
  useEffect(() => {
    if (isSameValue(lastSyncedValueRef.current, value))
      return
    const hasUncommittedEdits = !isSameValue(state.pendingValue, lastSyncedValueRef.current)
    if (state.open && hasUncommittedEdits)
      return
    lastSyncedValueRef.current = value
    dispatch({ type: 'RESET_TO', payload: value })
  }, [value, state.open, state.pendingValue])

  // Refs for the fields the actions object reads at call time. Keeping the
  // moving parts out of the useMemo deps lets `actions` keep a stable
  // identity across renders, so downstream consumers using `actions` in
  // useEffect deps don't re-fire on every keystroke.
  const onChangeRef = useRef(onChange)
  const valueRef = useRef(value)
  const pendingValueRef = useRef(state.pendingValue)
  const effectiveCommitRef = useRef(effectiveCommit)
  const modeRef = useRef(mode)
  const timezoneRef = useRef(timezone)

  useEffect(() => {
    onChangeRef.current = onChange
    valueRef.current = value
    pendingValueRef.current = state.pendingValue
    effectiveCommitRef.current = effectiveCommit
    modeRef.current = mode
    timezoneRef.current = timezone
  })

  const commitValue = useCallback((next: unknown) => {
    onChangeRef.current(next as PickerValueOf<M>)
  }, [])

  const actions = useMemo(() => {
    const setSingleValue = (action: Action) => {
      dispatch(action)
      if (effectiveCommitRef.current === 'immediate') {
        commitValue((action as { payload: unknown }).payload)
        dispatch({ type: 'CLOSE' })
      }
    }

    return {
      setSingleDate: (d: Date | null) => setSingleValue({ type: 'SET_SINGLE_DATE', payload: d }),
      setSingleTime: (t: string | null) => setSingleValue({ type: 'SET_SINGLE_TIME', payload: t }),
      setSingleDatetime: (iso: string | null) => setSingleValue({ type: 'SET_SINGLE_DATETIME', payload: iso }),
      setRange: (r: { from: Date, to: Date } | null) => {
        dispatch({ type: 'SET_RANGE', payload: r })
        // react-day-picker reports the first calendar click as a same-day
        // range ({ from: d, to: d }). In immediate mode, committing+closing on
        // that first click makes multi-day selection impossible (BUG-143), so
        // wait until the two endpoints differ before auto-committing.
        if (
          effectiveCommitRef.current === 'immediate'
          && r !== null
          && r.from.getTime() !== r.to.getTime()
        ) {
          commitValue(r)
          dispatch({ type: 'CLOSE' })
        }
      },
      setTimeRange: (r: { from: string, to: string } | null) => {
        dispatch({ type: 'SET_TIME_RANGE', payload: r })
        if (effectiveCommitRef.current === 'immediate' && r !== null) {
          commitValue(r)
          dispatch({ type: 'CLOSE' })
        }
      },
      setDatetimeRange: (r: { from: string, to: string } | null) => {
        dispatch({ type: 'SET_DATETIME_RANGE', payload: r })
        if (effectiveCommitRef.current === 'immediate' && r !== null) {
          commitValue(r)
          dispatch({ type: 'CLOSE' })
        }
      },
      selectPreset: (range: { from: Date, to: Date }, key: string) => {
        const pendingValue = presetValueForMode(modeRef.current, range, key, timezoneRef.current)
        dispatch({
          type: 'SELECT_PRESET',
          payload: { pendingValue, key, monthFrom: range.from, monthTo: range.to },
        })
        // Presets always commit immediately, regardless of commit mode.
        commitValue(pendingValue)
        dispatch({ type: 'CLOSE' })
      },
      setMonthFrom: (d: Date) => dispatch({ type: 'SET_MONTH_FROM', payload: d }),
      setMonthTo: (d: Date) => dispatch({ type: 'SET_MONTH_TO', payload: d }),
      open: () => dispatch({ type: 'OPEN' }),
      close: () => dispatch({ type: 'CLOSE' }),
      apply: () => {
        commitValue(pendingValueRef.current)
        dispatch({ type: 'CLOSE' })
      },
      reset: () => dispatch({ type: 'RESET_TO', payload: valueRef.current }),
      cancel: () => {
        dispatch({ type: 'RESET_TO', payload: valueRef.current })
        dispatch({ type: 'CLOSE' })
      },
      clear: () => {
        dispatch({ type: 'RESET_TO', payload: null })
        commitValue(null)
      },
    }
  }, [commitValue])

  return {
    state: {
      pendingValue: state.pendingValue as PickerValueOf<M>,
      open: state.open,
      selectedPresetKey: state.selectedPresetKey,
      monthFrom: state.monthFrom,
      monthTo: state.monthTo,
    },
    actions,
  }
}
