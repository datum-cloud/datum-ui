import type {
  CalendarMonthsPickerProps,
  CommitOverridePickerProps,
  DateBearingPickerProps,
  PresetsPickerProps,
  UniversalPickerProps,
} from './types'
import { PickerCalendar } from '../components/calendar'
import { PickerContent } from '../components/content'
import { PickerPresets } from '../components/presets'
import { Picker } from '../components/root'
import { PickerTrigger } from '../components/trigger'
import { formatPickerValue } from '../utils/format-value'
import { DefaultFooter } from './internal/default-footer'

export interface DateRangePickerProps
  extends
  UniversalPickerProps,
  CommitOverridePickerProps,
  DateBearingPickerProps,
  CalendarMonthsPickerProps,
  PresetsPickerProps {
  value: { from: Date, to: Date } | null
  onChange: (value: { from: Date, to: Date } | null) => void
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = 'Pick a date range',
  clearable = true,
  responsive = true,
  sheetTitle = 'Pick a date range',
  numberOfMonths = 2,
  triggerLabel,
  icon,
  disabled,
  className,
  triggerClassName,
  popoverClassName,
  id,
  sheetDescription,
  modal,
  commit,
  disablePast,
  disableFuture,
  minDate,
  maxDate,
  presets,
  excludePresets,
  dateFormat,
}: DateRangePickerProps) {
  return (
    <Picker.Root
      mode="date-range"
      value={value}
      onChange={onChange}
      commit={commit}
      responsive={responsive}
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
            {v => triggerLabel ? triggerLabel(v) : formatPickerValue(v, 'date-range', { dateFormat })}
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
          <PickerCalendar
            numberOfMonths={numberOfMonths}
            minDate={minDate}
            maxDate={maxDate}
            disablePast={disablePast}
            disableFuture={disableFuture}
          />
        </div>
      </PickerContent>
    </Picker.Root>
  )
}

DateRangePicker.displayName = 'DateRangePicker'
