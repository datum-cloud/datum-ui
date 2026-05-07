---
"@datum-cloud/datum-ui": minor
---

Adds a unified picker family at `@datum-cloud/datum-ui/picker`: seven opinionated wrappers (`DatePicker`, `DateRangePicker`, `TimePicker`, `TimeRangePicker`, `DateTimePicker`, `DateTimeRangePicker`, `DateRangeTimePicker`) plus the underlying primitives (`Picker.Root`, `Picker.Trigger`, `Picker.Content`, `Picker.Calendar`, `Picker.TimeInput`, `Picker.Presets`, `Picker.Footer`, `Picker.TimezoneIndicator`, `Picker.TimezoneSelect`).

The new family covers every realistic combination of date and time selection through a single mental model: native `Date` for date-only modes, `"HH:mm"` strings for time-only modes, and UTC ISO strings paired with a `timezone` prop for time-bearing modes. Range-mode `onChange` may include a `preset` key when the value came from a preset click - useful for URL hydration.

Helpers exported alongside: `formatPickerValue`, `isoToZonedDate`, `zonedDateToIso`, `getBrowserTimezone`, `formatTimezoneLabel`, `formatTimeLabel`, `parseTimeString`, `dateToYYYYMMDD`, `isValidTimeString`, plus the `usePickerContext` hook for primitive composition.

The change is purely additive. Existing `@datum-cloud/datum-ui/date-picker`, `@datum-cloud/datum-ui/date-time-picker`, and `@datum-cloud/datum-ui/time-picker` exports are unchanged in this release; they will become adapter shims with a development-only `@deprecated` warning in a follow-up minor release before the eventual `1.0.0` removal. See `picker-migration.mdx` for the full upgrade path.
