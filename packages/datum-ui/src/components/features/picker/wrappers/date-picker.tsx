import type {
  CalendarMonthsPickerProps,
  CommitOverridePickerProps,
  DateBearingPickerProps,
  UniversalPickerProps,
} from './types'
import { PickerCalendar } from '../components/calendar'
import { PickerContent } from '../components/content'
import { Picker } from '../components/root'
import { PickerTrigger } from '../components/trigger'
import { formatPickerValue } from '../utils/format-value'
import { DefaultFooter } from './internal/default-footer'

export interface DatePickerProps
  extends
  UniversalPickerProps,
  CommitOverridePickerProps,
  DateBearingPickerProps,
  CalendarMonthsPickerProps {
  value: Date | null
  onChange: (value: Date | null) => void
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  clearable = true,
  responsive = true,
  sheetTitle = 'Pick a date',
  numberOfMonths = 1,
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
  dateFormat,
}: DatePickerProps) {
  return (
    <Picker.Root
      mode="date"
      value={value}
      onChange={onChange}
      commit={commit}
      responsive={responsive}
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
            {v => triggerLabel ? triggerLabel(v) : formatPickerValue(v, 'date', { dateFormat })}
          </PickerTrigger>
        )}
        sheetTitle={sheetTitle}
        sheetDescription={sheetDescription}
        modal={modal}
        contentClassName={popoverClassName}
        footer={<DefaultFooter />}
      >
        <PickerCalendar
          numberOfMonths={numberOfMonths}
          minDate={minDate}
          maxDate={maxDate}
          disablePast={disablePast}
          disableFuture={disableFuture}
        />
      </PickerContent>
    </Picker.Root>
  )
}

DatePicker.displayName = 'DatePicker'
