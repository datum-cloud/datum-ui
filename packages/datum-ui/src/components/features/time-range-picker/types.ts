// app/modules/datum-ui/components/time-range-picker/types.ts

/**
 * Time range value - stores UTC timestamps
 * All from/to values are ISO 8601 UTC strings (e.g., '2024-01-15T04:00:00Z')
 *
 * @deprecated Use the `{ from, to, preset? }` envelope emitted by
 * `DateTimeRangePicker` from `@datum-cloud/datum-ui/picker` instead. Kept
 * for the legacy `@datum-cloud/datum-ui/time-range-picker` shim, removed
 * in 1.0.0. See `picker-migration.mdx`.
 */
export interface TimeRangeValue {
  /** Type of range selection */
  type: 'preset' | 'custom'

  /** For preset type: the preset key (e.g., 'today', '24h', '7d') */
  preset?: string

  /** Start time in UTC ISO format (e.g., '2024-01-15T04:00:00Z') */
  from: string

  /** End time in UTC ISO format (e.g., '2024-01-15T08:00:00Z') */
  to: string
}

/**
 * Date range for internal use (actual Date objects)
 *
 * @deprecated Use the `{ from: Date, to: Date }` shape from
 * `@datum-cloud/datum-ui/picker` (or `react-day-picker`'s `DateRange`).
 * Removed in 1.0.0 alongside the legacy time-range-picker shim.
 */
export interface DateRange {
  from: Date
  to: Date
}

/**
 * Preset configuration with dynamic range calculation
 *
 * @deprecated Use `PickerPreset` from `@datum-cloud/datum-ui/picker`
 * instead. The new shape no longer requires a `shortcut` and uses the
 * picker's standard `{ from: Date, to: Date }` range.
 */
export interface PresetConfig {
  /** Unique key for the preset */
  key: string
  /** Display label (e.g., 'Last 24 hours') */
  label: string
  /** Keyboard shortcut (e.g., 'D' for Today) */
  shortcut: string
  /**
   * Function to calculate the date range based on user's timezone
   * Returns dates that will be converted to UTC for storage/API
   */
  getRange: (timezone: string) => DateRange
}

/**
 * Timezone option for selector
 *
 * @deprecated Use the timezone helpers from `@datum-cloud/datum-ui/picker`
 * (`getBrowserTimezone`, `formatTimezoneLabel`). Removed in 1.0.0.
 */
export interface TimezoneOption {
  /** Timezone identifier (e.g., 'Asia/Jakarta') */
  value: string
  /** Display label (e.g., 'Asia/Jakarta (UTC+07:00)') */
  label: string
  /** UTC offset string (e.g., '+07:00') */
  offset: string
}

/**
 * API time range format (what gets sent to the API)
 * Always in UTC ISO format
 *
 * @deprecated Project-specific API shape; emit `{ startTime, endTime }`
 * from your own caller code rather than depending on this picker-internal
 * type. Removed in 1.0.0.
 */
export interface ApiTimeRange {
  /** Start time in UTC (e.g., '2024-01-15T04:00:00Z') */
  startTime: string
  /** End time in UTC (e.g., '2024-01-16T08:00:00Z') */
  endTime: string
}
