import type {
  CalendarMonthsPickerProps,
  DateBearingPickerProps,
  PresetsPickerProps,
  TimeOfDayPickerProps,
  TimezonePickerProps,
  UniversalPickerProps,
} from './types'
import { PickerCalendar } from '../components/calendar'
import { PickerContent } from '../components/content'
import { PickerPresets } from '../components/presets'
import { Picker } from '../components/root'
import { PickerTimeInput } from '../components/time-input'
import { PickerTimezoneIndicator } from '../components/timezone-indicator'
import { PickerTrigger } from '../components/trigger'
import { formatPickerValue } from '../utils/format-value'
import { DefaultFooter } from './internal/default-footer'

export interface DateRangeTimePickerProps
  extends
  UniversalPickerProps,
  DateBearingPickerProps,
  CalendarMonthsPickerProps,
  TimezonePickerProps,
  TimeOfDayPickerProps,
  PresetsPickerProps {
  value: { from: string, to: string } | null
  onChange: (value: { from: string, to: string } | null) => void
}

export function DateRangeTimePicker({
  value,
  onChange,
  placeholder = 'Pick a date range with time',
  clearable = true,
  responsive = true,
  sheetTitle = 'Pick a date range with time',
  timezone,
  step = 15,
  hourCycle,
  numberOfMonths = 2,
  hideTimezone = false,
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
  presets,
  excludePresets,
  dateFormat,
  timeFormat,
}: DateRangeTimePickerProps) {
  return (
    <Picker.Root
      mode="date-range-time"
      value={value}
      onChange={onChange}
      responsive={responsive}
      timezone={timezone}
      step={step}
      hourCycle={hourCycle}
      hideTimezone={hideTimezone}
      presets={presets}
      excludePresets={excludePresets}
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
            {v => triggerLabel ? triggerLabel(v) : formatPickerValue(v, 'date-range-time', { timezone, hourCycle, dateFormat, timeFormat })}
          </PickerTrigger>
        )}
        sheetTitle={sheetTitle}
        sheetDescription={sheetDescription}
        modal={modal}
        contentClassName={popoverClassName}
        footer={<DefaultFooter />}
      >
        <div className="flex flex-col md:flex-row">
          <PickerPresets />
          <div className="flex flex-col">
            <PickerCalendar
              numberOfMonths={numberOfMonths}
              minDate={minDate}
              maxDate={maxDate}
              disablePast={disablePast}
              disableFuture={disableFuture}
            />
            <div className="border-t p-3">
              <div className="text-muted-foreground mb-1 text-xs">Time of day</div>
              <PickerTimeInput target="embedded-from" />
            </div>
            <PickerTimezoneIndicator />
          </div>
        </div>
      </PickerContent>
    </Picker.Root>
  )
}

DateRangeTimePicker.displayName = 'DateRangeTimePicker'
