import type {
  CalendarMonthsPickerProps,
  DateBearingPickerProps,
  TimeOfDayPickerProps,
  TimezonePickerProps,
  UniversalPickerProps,
} from './types'
import { PickerCalendar } from '../components/calendar'
import { PickerContent } from '../components/content'
import { Picker } from '../components/root'
import { PickerTimeInput } from '../components/time-input'
import { PickerTimeInputField } from '../components/time-input-field'
import { PickerTimezoneIndicator } from '../components/timezone-indicator'
import { PickerTrigger } from '../components/trigger'
import { formatPickerValue } from '../utils/format-value'
import { DefaultFooter } from './internal/default-footer'

export interface DateTimePickerProps
  extends
  UniversalPickerProps,
  DateBearingPickerProps,
  CalendarMonthsPickerProps,
  TimezonePickerProps,
  TimeOfDayPickerProps {
  value: string | null
  onChange: (value: string | null) => void
  /**
   * `'slot'` (default) renders the embedded time slot dropdown.
   * `'input'` renders a typeable HH:mm input via `Picker.TimeInputField`.
   */
  timeInputMode?: 'slot' | 'input'
  /**
   * `'full'` (default) renders the full TZ indicator below the time input.
   * `'compact'` renders just the bare timezone identifier.
   */
  timezoneIndicatorVariant?: 'full' | 'compact'
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = 'Pick a date & time',
  clearable = true,
  responsive = true,
  sheetTitle = 'Pick a date & time',
  timezone,
  step = 15,
  hourCycle,
  numberOfMonths = 1,
  hideTimezone = false,
  timeInputMode = 'slot',
  timezoneIndicatorVariant = 'full',
  triggerLabel,
  icon,
  disabled,
  className,
  triggerClassName,
  popoverClassName,
  id,
  sheetDescription,
  modal,
  disablePast,
  disableFuture,
  minDate,
  maxDate,
  dateFormat,
  timeFormat,
}: DateTimePickerProps) {
  return (
    <Picker.Root
      mode="datetime"
      value={value}
      onChange={onChange}
      responsive={responsive}
      timezone={timezone}
      step={step}
      hourCycle={hourCycle}
      hideTimezone={hideTimezone}
      presets={[]}
      disablePast={disablePast}
      disableFuture={disableFuture}
      minDate={minDate}
      maxDate={maxDate}
    >
      <PickerContent
        trigger={(
          <PickerTrigger
            placeholder={placeholder}
            clearable={clearable}
            disabled={disabled}
            className={className}
            triggerClassName={triggerClassName}
            id={id}
            icon={icon}
          >
            {v => triggerLabel ? triggerLabel(v) : formatPickerValue(v, 'datetime', { timezone, hourCycle, dateFormat, timeFormat })}
          </PickerTrigger>
        )}
        sheetTitle={sheetTitle}
        sheetDescription={sheetDescription}
        modal={modal}
        contentClassName={popoverClassName}
        footer={<DefaultFooter />}
      >
        <div className="flex flex-col">
          <PickerCalendar
            numberOfMonths={numberOfMonths}
            minDate={minDate}
            maxDate={maxDate}
            disablePast={disablePast}
            disableFuture={disableFuture}
          />
          <div className="border-t p-3">
            {timeInputMode === 'input'
              ? <PickerTimeInputField />
              : <PickerTimeInput target="embedded-from" />}
          </div>
          <PickerTimezoneIndicator variant={timezoneIndicatorVariant} />
        </div>
      </PickerContent>
    </Picker.Root>
  )
}

DateTimePicker.displayName = 'DateTimePicker'
