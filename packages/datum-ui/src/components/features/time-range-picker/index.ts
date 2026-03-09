// app/modules/datum-ui/components/time-range-picker/index.ts

export { AbsoluteRangePanel, CustomRangePanel } from './components/absolute-range-panel'

// Sub-components (for advanced customization)
export { QuickRangesPanel } from './components/quick-ranges-panel'

export { TimezoneSelector } from './components/timezone-selector'

// Presets
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
