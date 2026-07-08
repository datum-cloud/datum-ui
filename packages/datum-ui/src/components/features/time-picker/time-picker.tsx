import type { TimePickerProps } from './types'
import { useDeprecationWarning } from '../_shared'
import { TimePicker as PickerTimePicker } from '../picker'

const STEP_VALUES = [1, 5, 10, 15, 30, 60] as const
type AllowedStep = (typeof STEP_VALUES)[number]

function normalizeStep(step: number | undefined): AllowedStep {
  if (step === undefined)
    return 15
  return (STEP_VALUES as readonly number[]).includes(step) ? (step as AllowedStep) : 15
}

/**
 * @deprecated Use `TimePicker` from `@datum-cloud/datum-ui/picker` instead.
 * This adapter shim ships through 0.10.x and is removed in 1.0.0. See
 * `picker-migration.mdx`.
 */
export function TimePicker({
  value,
  onChange,
  min,
  max,
  step,
  placeholder,
  disabled,
  className,
  id,
  name,
  responsive = true,
  sheetTitle,
}: TimePickerProps) {
  useDeprecationWarning('TimePicker (legacy)', 'TimePicker')

  return (
    <>
      <PickerTimePicker
        value={value ?? null}
        onChange={(next) => { onChange?.(next ?? '') }}
        placeholder={placeholder ?? 'Select time'}
        sheetTitle={sheetTitle ?? placeholder ?? 'Select time'}
        responsive={responsive}
        disabled={disabled}
        className={className}
        triggerClassName={className}
        id={id}
        step={normalizeStep(step)}
        hourCycle="12"
        minTime={min}
        maxTime={max}
      />
      {name && <input type="hidden" name={name} value={value ?? ''} readOnly />}
    </>
  )
}

TimePicker.displayName = 'TimePicker'
