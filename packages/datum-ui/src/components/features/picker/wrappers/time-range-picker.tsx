import type { CommitOverridePickerProps, TimeOfDayPickerProps, UniversalPickerProps } from './types'
import { Clock } from 'lucide-react'
import { PickerContent } from '../components/content'
import { Picker } from '../components/root'
import { PickerTimeInput } from '../components/time-input'
import { PickerTrigger } from '../components/trigger'
import { formatPickerValue } from '../utils/format-value'
import { DefaultFooter } from './internal/default-footer'

const DEFAULT_TIME_ICON = <Clock className="text-muted-foreground size-4 shrink-0" />

export interface TimeRangePickerProps
  extends UniversalPickerProps, CommitOverridePickerProps, TimeOfDayPickerProps {
  value: { from: string, to: string } | null
  onChange: (value: { from: string, to: string } | null) => void
}

export function TimeRangePicker({
  value,
  onChange,
  placeholder = 'Pick a time range',
  clearable = true,
  responsive = true,
  sheetTitle = 'Pick a time range',
  step = 15,
  hourCycle,
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
}: TimeRangePickerProps) {
  return (
    <Picker.Root
      mode="time-range"
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
            {v => triggerLabel ? triggerLabel(v) : formatPickerValue(v, 'time-range', { hourCycle, timeFormat })}
          </PickerTrigger>
        )}
        sheetTitle={sheetTitle}
        sheetDescription={sheetDescription}
        modal={modal}
        contentClassName={popoverClassName}
        footer={<DefaultFooter />}
      >
        <div className="flex gap-2 p-3">
          <div className="flex-1">
            <div className="text-muted-foreground mb-1 text-xs">From</div>
            <PickerTimeInput target="range-from" />
          </div>
          <div className="flex-1">
            <div className="text-muted-foreground mb-1 text-xs">To</div>
            <PickerTimeInput target="range-to" />
          </div>
        </div>
      </PickerContent>
    </Picker.Root>
  )
}

TimeRangePicker.displayName = 'TimeRangePicker'
