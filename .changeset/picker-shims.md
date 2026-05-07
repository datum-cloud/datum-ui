---
"@datum-cloud/datum-ui": patch
---

`CalendarDatePicker`, `DateTimePicker`, `TimePicker`, and `TimeRangePicker` are now thin adapter shims that delegate to the new unified `@datum-cloud/datum-ui/picker` family. Public APIs are unchanged - every existing prop, value shape, and `onChange` envelope is preserved by the shim, and each legacy test suite passes against its shim unchanged (with one mechanical update: `getByRole('button')` -> `getByRole('combobox')` to match the new picker trigger's improved ARIA semantics).

In development builds, each legacy component logs a one-time `console.warn` pointing at the replacement and the migration guide. The warning is silent in `production` and `test` builds.

The shims will remain through `0.10.x`. The legacy directories (`calendar-date-picker/`, `date-time-picker/`, `time-picker/`, `time-range-picker/`, `date-picker/`) are scheduled for removal in `1.0.0`, at which point importers will need to switch to `@datum-cloud/datum-ui/picker`. See `picker-migration.mdx` for the full upgrade path.

Two new picker primitives ship alongside to support legacy DateTimePicker UX: `Picker.TimeInputField` (typeable HH:mm input, distinct from the slot-dropdown `Picker.TimeInput`) and a `variant` prop on `Picker.TimezoneIndicator` (`'full'` default, `'compact'` for bare-name display). The `DateTimePicker` wrapper gains `timeInputMode` and `timezoneIndicatorVariant` props to drive these.
