import { PickerCalendar } from './calendar'
import { PickerContent } from './content'
import { PickerApply, PickerCancel, PickerClear, PickerFooter, PickerReset } from './footer'
import { PickerPresets } from './presets'
import { Picker as PickerNamespace } from './root'
import { PickerTimeInput } from './time-input'
import { PickerTimezoneIndicator } from './timezone-indicator'
import { PickerTimezoneSelect } from './timezone-select'
import { PickerTrigger } from './trigger'

const Picker = Object.assign(PickerNamespace, {
  Trigger: PickerTrigger,
  Content: PickerContent,
  Calendar: PickerCalendar,
  TimeInput: PickerTimeInput,
  Presets: PickerPresets,
  Footer: PickerFooter,
  Apply: PickerApply,
  Reset: PickerReset,
  Cancel: PickerCancel,
  Clear: PickerClear,
  TimezoneIndicator: PickerTimezoneIndicator,
  TimezoneSelect: PickerTimezoneSelect,
})

export { Picker }
export { PickerContext, usePickerContext } from './context'
export type { PickerContextValue } from './context'
export { PickerCalendar }
export { PickerContent }
export { PickerApply, PickerCancel, PickerClear, PickerFooter, PickerReset }
export { PickerPresets }
export { PickerTimeInput }
export { PickerTimezoneIndicator }
export { PickerTimezoneSelect }
export { PickerTrigger }
