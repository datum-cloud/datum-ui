import type { ReactNode } from 'react'
import type { AllowedStep, HourCycle, PickerCommit, PickerPreset } from '../types'

/**
 * Universal props every picker wrapper accepts. These all touch the
 * trigger / popover / sheet chrome — never the inner picker content.
 */
export interface UniversalPickerProps {
  /** Trigger label when value is null. */
  placeholder?: string
  /** Native disabled state — suppresses opening. */
  disabled?: boolean
  /** Show a Clear sub-button on the trigger when a value is set. Default `true`. */
  clearable?: boolean
  /** Class on the outermost trigger Button wrapper. */
  className?: string
  /** Class merged onto the trigger Button. */
  triggerClassName?: string
  /** Class merged onto the popover content (desktop only). */
  popoverClassName?: string
  /** id forwarded to the trigger Button. */
  id?: string
  /** When false, forces desktop popover even on mobile viewports. Default `true`. */
  responsive?: boolean
  /** Mobile sheet header title. */
  sheetTitle?: string
  /** Mobile sheet header description. */
  sheetDescription?: string
  /** Forwarded to ResponsivePopover.modal. */
  modal?: boolean
  /** Render-prop override for the trigger label. Receives the `pendingValue`. */
  triggerLabel?: (value: unknown) => ReactNode
  /**
   * Trigger leading icon. Pass a ReactNode to override the per-mode default
   * (calendar for date-bearing modes, clock for time-only modes), or `false`
   * to hide the icon entirely.
   */
  icon?: ReactNode | false
}

/**
 * Constraints that gate selectable dates. Apply to every wrapper that
 * renders a calendar (everything except the time-only modes).
 */
export interface DateBearingPickerProps {
  /** Disable past dates in the calendar AND filter past presets. */
  disablePast?: boolean
  /** Disable future dates in the calendar AND filter future presets. */
  disableFuture?: boolean
  /** Inclusive lower bound for selectable dates. */
  minDate?: Date
  /** Inclusive upper bound for selectable dates. */
  maxDate?: Date
  /**
   * date-fns format pattern for the date portion of the trigger label.
   * Examples: `'dd/MM/yyyy'`, `'EEE, MMM do'`, `'yyyy-MM-dd'`. Defaults to
   * a locale-aware `MMM dd, yyyy`-style rendering.
   */
  dateFormat?: string
}

/** Number of calendar months shown side-by-side. */
export interface CalendarMonthsPickerProps {
  numberOfMonths?: 1 | 2
}

/** Time-of-day controls for time-bearing modes. */
export interface TimeOfDayPickerProps {
  /** Time slot step in minutes. Default `15`. */
  step?: AllowedStep
  /** Display cycle for time labels. Default detected from locale. */
  hourCycle?: HourCycle
  /**
   * date-fns format pattern for the time portion of the trigger label.
   * Examples: `'HH:mm'`, `'hh:mm a'`, `'HH:mm:ss'`. When set, overrides
   * `hourCycle` for the trigger display.
   */
  timeFormat?: string
}

/**
 * Timezone props — only meaningful for the modes whose value is a UTC ISO string
 * (`datetime`, `datetime-range`, `date-range-time`).
 */
export interface TimezonePickerProps {
  /** IANA timezone name. Default: browser-detected. */
  timezone?: string
  /** Hide the always-on TZ indicator. */
  hideTimezone?: boolean
}

/** Preset rail — only meaningful when a wrapper renders `<PickerPresets />`. */
export interface PresetsPickerProps {
  /** Replace default presets entirely. */
  presets?: readonly PickerPreset[]
  /** Filter default presets by key. Ignored when `presets` is set. */
  excludePresets?: readonly string[]
}

/**
 * `commit` override — only exposed on wrappers where the choice is meaningful.
 *
 * Date + time combined modes (`datetime` / `datetime-range` / `date-range-time`)
 * are pinned to `'apply'` internally and intentionally don't extend this mixin:
 * picking a date alone shouldn't auto-commit a value with an unconfirmed
 * 00:00 time.
 */
export interface CommitOverridePickerProps {
  /** Override the default per-mode commit semantics (`'immediate'` | `'apply'`). */
  commit?: PickerCommit
}

/**
 * @deprecated Compose the per-feature mixin types instead — picking only
 * the ones a given wrapper actually wires through. Kept as a back-compat
 * alias of the previous union so existing consumers don't break.
 *
 * INTENTIONAL SCOPE: this alias mirrors the **previous** WrapperBaseProps
 * shape exactly. It excludes `numberOfMonths` (CalendarMonthsPickerProps),
 * `step`/`hourCycle`/`timeFormat` (TimeOfDayPickerProps), `timezone`
 * (TimezonePickerProps), and `dateFormat` because those props were never
 * on the old union — adding them here would silently widen the alias and
 * break the back-compat contract. Use the new mixins directly to opt in.
 */
export type WrapperBaseProps
  = & UniversalPickerProps
    & CommitOverridePickerProps
    & DateBearingPickerProps
    & PresetsPickerProps
    & Pick<TimezonePickerProps, 'hideTimezone'>
