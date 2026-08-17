import type { z } from 'zod'
import type { Normalizer } from './parse'
import * as React from 'react'
import {
  DEFAULT_DELIMITERS,
  normalizeTag,
  processPastedValues,
  splitByDelimiters,
  validateTag,
} from './parse'

/** How long a transient paste error stays visible before clearing (ms). */
const TRANSIENT_ERROR_MS = 3000

export interface UseTagsInputOptions {
  value: string[]
  onValueChange: (value: string[]) => void
  maxItems?: number
  minItems?: number
  delimiters?: string[]
  normalizer?: Normalizer
  validator?: z.ZodType<string>
  onValidationError?: (error: string | null) => void
  dir?: string
}

export interface UseTagsInputResult {
  inputValue: string
  setInputValue: React.Dispatch<React.SetStateAction<string>>
  activeIndex: number
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>
  validationError: string | null
  setValidationError: React.Dispatch<React.SetStateAction<string | null>>
  disableInput: boolean
  disableButton: boolean
  removeValue: (val: string) => void
  handlePaste: (e: React.ClipboardEvent<HTMLInputElement>) => void
  handleSelect: (e: React.SyntheticEvent<HTMLInputElement>) => void
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void
  mousePreventDefault: (e: React.MouseEvent) => void
}

/**
 * Owns all state and event handlers for {@link TagsInput}.
 *
 * Keeping this in a hook lets the pure parsing/validation logic live in
 * `parse.ts` while the component stays a thin provider + presentation layer.
 */
export function useTagsInput({
  value,
  onValueChange,
  maxItems,
  minItems,
  delimiters = DEFAULT_DELIMITERS,
  normalizer,
  validator,
  onValidationError,
  dir,
}: UseTagsInputOptions): UseTagsInputResult {
  const [activeIndex, setActiveIndex] = React.useState(-1)
  const [inputValue, setInputValue] = React.useState('')
  const [disableInput, setDisableInput] = React.useState(false)
  const [disableButton, setDisableButton] = React.useState(false)
  const [isValueSelected, setIsValueSelected] = React.useState(false)
  const [selectedValue, setSelectedValue] = React.useState('')
  const [validationError, setValidationError] = React.useState<string | null>(null)

  const parseMinItems = minItems ?? 0
  const parseMaxItems = maxItems ?? Infinity

  // Track any pending "auto-clear" timer so it can be cancelled on unmount or
  // whenever a newer error replaces it (prevents a stale timer wiping a fresh
  // error — BUG-044).
  const errorTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearErrorTimer = React.useCallback(() => {
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current)
      errorTimerRef.current = null
    }
  }, [])

  const setError = React.useCallback(
    (errorMessage: string | null) => {
      clearErrorTimer()
      setValidationError(errorMessage)
      onValidationError?.(errorMessage)
    },
    [clearErrorTimer, onValidationError],
  )

  const setTransientError = React.useCallback(
    (errorMessage: string) => {
      clearErrorTimer()
      setValidationError(errorMessage)
      onValidationError?.(errorMessage)
      errorTimerRef.current = setTimeout(() => {
        errorTimerRef.current = null
        setValidationError(null)
        onValidationError?.(null)
      }, TRANSIENT_ERROR_MS)
    },
    [clearErrorTimer, onValidationError],
  )

  // Cancel any pending timer on unmount.
  React.useEffect(() => clearErrorTimer, [clearErrorTimer])

  /**
   * Confirm a single value as a tag.
   * @returns `true` when a new tag was added, `false` otherwise.
   */
  const addValue = React.useCallback(
    (val: string): boolean => {
      setError(null)

      const normalized = normalizeTag(val, normalizer)
      if (!normalized)
        return false

      if (value.includes(normalized)) {
        setError('This tag already exists')
        return false
      }

      if (value.length >= parseMaxItems) {
        setError(`Maximum of ${parseMaxItems} tags allowed`)
        return false
      }

      const result = validateTag(normalized, validator)
      if (!result.ok) {
        setError(result.error ?? 'Invalid input')
        return false
      }

      onValueChange([...value, normalized])
      return true
    },
    [value, validator, parseMaxItems, normalizer, onValueChange, setError],
  )

  const removeValue = React.useCallback(
    (val: string) => {
      if (value.includes(val) && value.length > parseMinItems) {
        onValueChange(value.filter(item => item !== val))
      }
    },
    [value, parseMinItems, onValueChange],
  )

  const handlePaste = React.useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault()
      const pastedText = e.clipboardData.getData('text')

      if (!pastedText)
        return

      const values = splitByDelimiters(pastedText)
      if (values.length === 0)
        return

      // A single value behaves exactly like normal typed input.
      if (values.length === 1) {
        addValue(values[0]!)
        return
      }

      const { validValues, hadInvalid, exceededMax } = processPastedValues(
        values,
        value,
        { normalizer, validator, maxItems: parseMaxItems },
      )

      if (validValues.length > 0) {
        onValueChange([...value, ...validValues])
      }

      // Surface feedback about dropped values (BUG-160 / BUG-043).
      if (exceededMax) {
        setError(`Maximum of ${parseMaxItems} tags allowed`)
      }
      else if (hadInvalid && validator) {
        setTransientError('Some pasted values were invalid and skipped')
      }
      else if (validValues.length > 0) {
        setError(null)
      }
    },
    [value, addValue, normalizer, validator, parseMaxItems, onValueChange, setError, setTransientError],
  )

  const handleSelect = React.useCallback(
    (e: React.SyntheticEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement
      const selection = inputValue.substring(
        target.selectionStart ?? 0,
        target.selectionEnd ?? 0,
      )

      setSelectedValue(selection)
      setIsValueSelected(selection === inputValue)
    },
    [inputValue],
  )

  React.useEffect(() => {
    if (value.length - 1 >= parseMinItems) {
      setDisableButton(false)
    }
    else {
      setDisableButton(true)
    }
    if (value.length + 1 <= parseMaxItems) {
      setDisableInput(false)
    }
    else {
      setDisableInput(true)
    }
  }, [value, parseMinItems, parseMaxItems])

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation()

      const moveNext = () => {
        const nextIndex = activeIndex + 1 > value.length - 1 ? -1 : activeIndex + 1
        setActiveIndex(nextIndex)
      }

      const movePrev = () => {
        const prevIndex = activeIndex - 1 < 0 ? value.length - 1 : activeIndex - 1
        setActiveIndex(prevIndex)
      }

      const moveCurrent = () => {
        const newIndex
          = activeIndex - 1 <= 0 ? (value.length - 1 === 0 ? -1 : 0) : activeIndex - 1
        setActiveIndex(newIndex)
      }
      const target = e.currentTarget

      switch (e.key) {
        case 'ArrowLeft': {
          if (dir === 'rtl') {
            if (value.length > 0 && activeIndex !== -1) {
              moveNext()
            }
          }
          else {
            if (value.length > 0 && target.selectionStart === 0) {
              movePrev()
            }
          }
          break
        }

        case 'ArrowRight': {
          if (dir === 'rtl') {
            if (value.length > 0 && target.selectionStart === 0) {
              movePrev()
            }
          }
          else {
            if (value.length > 0 && activeIndex !== -1) {
              moveNext()
            }
          }
          break
        }

        case 'Backspace':
        case 'Delete': {
          if (value.length > 0) {
            if (activeIndex !== -1 && activeIndex < value.length) {
              removeValue(value[activeIndex]!)
              moveCurrent()
            }
            else {
              if (target.selectionStart === 0) {
                if (selectedValue === inputValue || isValueSelected) {
                  removeValue(value[value.length - 1]!)
                }
              }
            }
          }
          break
        }

        case 'Escape': {
          const newIndex = activeIndex === -1 ? value.length - 1 : -1
          setActiveIndex(newIndex)
          break
        }

        case 'Tab': {
          if (inputValue.trim() !== '') {
            e.preventDefault()
            addValue(inputValue)
            setInputValue('')
          }
          break
        }

        default: {
          if (delimiters.includes(e.key) && inputValue.trim() !== '') {
            e.preventDefault()
            addValue(inputValue)
            setInputValue('')
          }
          break
        }
      }
    },
    [
      activeIndex,
      value,
      inputValue,
      removeValue,
      dir,
      selectedValue,
      isValueSelected,
      addValue,
      delimiters,
    ],
  )

  const mousePreventDefault = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.currentTarget.value)
  }, [])

  const handleBlur = React.useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (inputValue.trim() === '')
        return

      const added = addValue(inputValue)
      setInputValue('')

      // When blur is caused by clicking a submit button, the state update from
      // adding the tag swallows the click. Only re-trigger the submit when a tag
      // was actually added — otherwise the original click proceeds normally and
      // re-clicking would double-submit (or submit an invalid pending tag).
      if (!added)
        return

      const relatedTarget = e.relatedTarget as HTMLElement | null
      const submitButton
        = relatedTarget?.getAttribute('type') === 'submit'
          ? relatedTarget
          : relatedTarget?.closest<HTMLElement>('button[type="submit"]')

      if (submitButton) {
        requestAnimationFrame(() => {
          submitButton.click()
        })
      }
    },
    [inputValue, addValue],
  )

  return {
    inputValue,
    setInputValue,
    activeIndex,
    setActiveIndex,
    validationError,
    setValidationError,
    disableInput,
    disableButton,
    removeValue,
    handlePaste,
    handleSelect,
    handleKeyDown,
    handleChange,
    handleBlur,
    mousePreventDefault,
  }
}
