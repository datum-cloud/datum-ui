import type { CommitOverridePickerProps, TimeOfDayPickerProps, UniversalPickerProps } from './types'
import { Clock } from 'lucide-react'
import { PickerContent } from '../components/content'
import { Picker } from '../components/root'
import { PickerTimeInput } from '../components/time-input'
import { PickerTrigger } from '../components/trigger'
import { formatPickerValue } from '../utils/format-value'
import { DefaultFooter } from './internal/default-footer'

const DEFAULT_TIME_ICON = <Clock className="text-muted-foreground size-4 shrink-0" />

export interface TimePickerProps
  extends UniversalPickerProps, CommitOverridePickerProps, TimeOfDayPickerProps {
  value: string | null
  onChange: (value: string | null) => void
  /** Inclusive min slot, format `"HH:mm"`. */
  minTime?: string
  /** Inclusive max slot, format `"HH:mm"`. */
  maxTime?: string
}

export function TimePicker({
  value,
  onChange,
  placeholder = 'Pick a time',
  clearable = true,
  responsive = true,
  sheetTitle = 'Pick a time',
  step = 15,
  hourCycle,
  minTime,
  maxTime,
  timeFormat,
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
}: TimePickerProps) {
  return (
    <Picker.Root
      mode="time"
      value={value}
      onChange={onChange}
      commit={commit}
      responsive={responsive}
      step={step}
      hourCycle={hourCycle}
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
            icon={icon ?? DEFAULT_TIME_ICON}
          >
            {v => triggerLabel ? triggerLabel(v) : formatPickerValue(v, 'time', { hourCycle, timeFormat })}
          </PickerTrigger>
        )}
        sheetTitle={sheetTitle}
        sheetDescription={sheetDescription}
        modal={modal}
        contentClassName={popoverClassName}
        footer={<DefaultFooter />}
      >
        <PickerTimeInput target="single" min={minTime} max={maxTime} />
      </PickerContent>
    </Picker.Root>
  )
}

TimePicker.displayName = 'TimePicker'
