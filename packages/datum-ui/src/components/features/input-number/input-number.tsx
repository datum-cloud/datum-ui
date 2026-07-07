import type { NumericFormatProps } from 'react-number-format'
import { Button } from '@repo/shadcn/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useCallback, useEffect, useRef } from 'react'
import { NumericFormat } from 'react-number-format'
import { Input } from '../..'
import { useControllableState } from '../../base/hooks'
import { Icon } from '../../icons/icon-wrapper'

export interface NumberInputProps extends Omit<NumericFormatProps, 'value' | 'onValueChange'> {
  stepper?: number
  thousandSeparator?: string
  placeholder?: string
  defaultValue?: number
  min?: number
  max?: number
  value?: number // Controlled value
  suffix?: string
  prefix?: string
  onValueChange?: (value: number | undefined) => void
  fixedDecimalScale?: boolean
  decimalScale?: number
}

export function InputNumber({ ref, stepper, thousandSeparator, placeholder, defaultValue, min = -Infinity, max = Infinity, onValueChange, fixedDecimalScale = false, decimalScale = 0, suffix, prefix, value: controlledValue, ...props }: NumberInputProps & { ref?: React.RefObject<HTMLInputElement | null> }) {
  const internalRef = useRef<HTMLInputElement>(null) // Create an internal ref
  const combinedRef = ref || internalRef // Use provided ref or internal ref

  // Uncontrolled by default; the `value` prop takes over when provided. The
  // shared hook replaces the prior prop-into-useState-plus-sync-effect pattern,
  // so the displayed value tracks `controlledValue` without an effect.
  // `onValueChange` is emitted explicitly (not via the hook's onChange) to keep
  // NumericFormat as the single emit source for uncontrolled edits and avoid
  // double-firing on programmatic value changes.
  const [value, setValue] = useControllableState<number | undefined>(controlledValue, defaultValue)
  const isControlled = controlledValue !== undefined

  const step = stepper ?? 1
  const clampValue = useCallback(
    (n: number) => Math.min(Math.max(n, min), max),
    [min, max],
  )

  const handleIncrement = useCallback(() => {
    const next = clampValue((value ?? 0) + step)
    if (isControlled)
      onValueChange?.(next)
    else
      setValue(next)
  }, [value, step, clampValue, onValueChange, isControlled, setValue])

  const handleDecrement = useCallback(() => {
    const next = clampValue((value ?? 0) - step)
    if (isControlled)
      onValueChange?.(next)
    else
      setValue(next)
  }, [value, step, clampValue, onValueChange, isControlled, setValue])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement === (combinedRef as React.RefObject<HTMLInputElement>).current) {
        if (e.key === 'ArrowUp') {
          handleIncrement()
        }
        else if (e.key === 'ArrowDown') {
          handleDecrement()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleIncrement, handleDecrement, combinedRef])

  const handleChange = (values: { value: string, floatValue: number | undefined }) => {
    const newValue = values.floatValue
    // Controlled: let the consumer drive the value; if they reject the update
    // NumericFormat reverts to the controlled value instead of desyncing.
    if (!isControlled) {
      setValue(newValue)
    }
    onValueChange?.(newValue)
  }

  const handleBlur = () => {
    if (value === undefined)
      return
    const clamped = clampValue(value)
    if (clamped === value)
      return
    if (isControlled)
      onValueChange?.(clamped)
    else
      setValue(clamped)
  }

  return (
    <div className="flex items-center">
      <NumericFormat
        value={value ?? ''}
        onValueChange={handleChange}
        thousandSeparator={thousandSeparator}
        decimalScale={decimalScale}
        fixedDecimalScale={fixedDecimalScale}
        allowNegative={min < 0}
        valueIsNumericString
        onBlur={handleBlur}
        max={max}
        min={min}
        suffix={suffix}
        prefix={prefix}
        customInput={Input}
        placeholder={placeholder}
        className="relative [appearance:textfield] rounded-r-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        getInputRef={combinedRef} // Use combined ref
        {...props}
      />
      <div className="flex flex-col">
        <Button
          type="button"
          aria-label="Increase value"
          className="border-input h-5 rounded-l-none rounded-br-none border-b-[0.5px] border-l-0 px-2 focus-visible:relative"
          variant="outline"
          onClick={handleIncrement}
          disabled={value === max}
        >
          <Icon icon={ChevronUp} size={15} />
        </Button>
        <Button
          type="button"
          aria-label="Decrease value"
          className="border-input h-5 rounded-l-none rounded-tr-none border-t-[0.5px] border-l-0 px-2 focus-visible:relative"
          variant="outline"
          onClick={handleDecrement}
          disabled={value === min}
        >
          <Icon icon={ChevronDown} size={15} />
        </Button>
      </div>
    </div>
  )
}

InputNumber.displayName = 'InputNumber'
