// app/modules/datum-ui/components/time-range-picker/index.ts
//
// @deprecated The entire `@datum-cloud/datum-ui/time-range-picker` barrel
// is deprecated. Use `@datum-cloud/datum-ui/picker` (DateTimeRangePicker /
// TimeRangePicker / Picker.* primitives) instead. Removed in 1.0.0. See
// `picker-migration.mdx`.

/** @deprecated Use the picker family from `@datum-cloud/datum-ui/picker`. */
export { AbsoluteRangePanel, CustomRangePanel } from './components/absolute-range-panel'

// Sub-components (for advanced customization)
/** @deprecated Use the picker family from `@datum-cloud/datum-ui/picker`. */
export { QuickRangesPanel } from './components/quick-ranges-panel'

/** @deprecated Use `Picker.TimezoneSelect` from `@datum-cloud/datum-ui/picker`. */
export { TimezoneSelector } from './components/timezone-selector'

// Presets
/** @deprecated Use the new picker's `presets` prop (`PickerPreset[]`). */
export {
  DEFAULT_PRESETS,
  getDefaultPreset,
  getPresetByKey,
  getPresetByShortcut,
  getPresetRange,
} from './presets'

// Main component
export { TimeRangePicker, type TimeRangePickerProps } from './time-range-picker'
// Types
export type {
  ApiTimeRange,
  DateRange,
  PresetConfig,
  TimeRangeValue,
  TimezoneOption,
} from './types'
// Utilities
/** @deprecated Use the timezone / format helpers exported from `@datum-cloud/datum-ui/picker`. */
export {
  createTimezoneOption,
  formatDateForInput,
  formatSingleTimeDisplay,
  // Formatting
  formatTimeRangeDisplay,
  formatTimezoneLabel,
  formatUtcForDisplay,
  getBrowserTimezone,
  getDefaultTimezoneOptions,
  getShortTimezoneDisplay,
  // Timezone
  getTimezoneOffset,
  localInputStringToUtc,
  // API
  toApiTimeRange,
  utcStringToZonedDate,
  utcToLocalInputString,
  zonedDateToUtcString,
} from './utils'
