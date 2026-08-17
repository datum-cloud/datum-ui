import type { ButtonProps } from '../../..'
import type { NormalizedFieldMeta, NormalizedFormInstance } from '../adapter-types'
import type { FormActions, FormStateFields } from './core'

// ============================================================================
// Input Component Types
// ============================================================================

export interface FormInputProps extends Omit<React.ComponentProps<'input'>, 'name'> {
  /** Input type */
  type?:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'tel'
    | 'url'
    | 'search'
    | 'date'
    | 'time'
    | 'datetime-local'
}

export interface FormTextareaProps extends Omit<React.ComponentProps<'textarea'>, 'name'> {
  /** Number of visible rows */
  rows?: number
}

export interface FormSelectProps {
  /** Placeholder text when no value selected */
  placeholder?: string
  /** Disable the select */
  disabled?: boolean
  /** Additional CSS classes */
  className?: string
  /** Select options as children */
  children: React.ReactNode
}

export interface FormSelectItemProps {
  /** Option value */
  value: string
  /** Option label */
  children: React.ReactNode
  /** Disable this option */
  disabled?: boolean
}

export interface FormCheckboxProps {
  /** Inline label next to checkbox */
  label?: string
  /** Disable the checkbox */
  disabled?: boolean
  /** Additional CSS classes */
  className?: string
}

export interface FormSwitchProps {
  /** Inline label next to switch */
  label?: string
  /** Disable the switch */
  disabled?: boolean
  /** Additional CSS classes */
  className?: string
}

export interface FormRadioGroupProps {
  /** Layout orientation */
  orientation?: 'horizontal' | 'vertical'
  /** Disable all radio items */
  disabled?: boolean
  /** Additional CSS classes */
  className?: string
  /** Radio items as children */
  children: React.ReactNode
}

export interface FormRadioItemProps {
  /** Radio value */
  value: string
  /** Radio label */
  label: string
  /** Optional description */
  description?: string
  /** Disable this radio item */
  disabled?: boolean
}

export interface FormCopyBoxProps {
  /** Display variant: 'default' shows Copy button, 'icon-only' shows icon */
  variant?: 'default' | 'icon-only'
  /** Custom className for the wrapper */
  className?: string
  /** Custom className for the content area */
  contentClassName?: string
  /** Custom className for the button */
  buttonClassName?: string
  /** Placeholder text when value is empty */
  placeholder?: string
}

// ============================================================================
// Submit & Error Types
// ============================================================================

export interface FormSubmitProps extends ButtonProps {
  /** Button content */
  children: React.ReactNode
  /** Text to show while loading */
  loadingText?: string
}

export interface FormButtonProps {
  /** Button content */
  children: React.ReactNode
  /** Click handler */
  onClick?: () => void
  /** Button variant */
  type?: ButtonProps['type']
  /** Button theme */
  theme?: ButtonProps['theme']
  /** Button size */
  size?: ButtonProps['size']
  /** Disable the button */
  disabled?: boolean
  /** Additional CSS classes */
  className?: string
  /** Whether to disable the button when form is submitting (default: true) */
  disableOnSubmit?: boolean
}

export interface FormErrorProps {
  /** Error message or render function */
  children?: React.ReactNode | ((errors: string[]) => React.ReactNode)
  /** Additional CSS classes */
  className?: string
}

export interface FormDescriptionProps {
  /** Description content */
  children: React.ReactNode
  /** Additional CSS classes */
  className?: string
}

// ============================================================================
// Advanced Component Types
// ============================================================================

export interface FormWhenProps {
  /** Field name to watch */
  field: string
  /** Render when field equals this value */
  is?: unknown
  /** Render when field does not equal this value */
  isNot?: unknown
  /** Render when field value is in array */
  in?: unknown[]
  /** Render when field value is not in array */
  notIn?: unknown[]
  /** Children to render conditionally */
  children: React.ReactNode
}

export interface FormFieldArrayProps {
  /** Array field name */
  name: string
  /** Render function with array helpers */
  children: (props: FormFieldArrayRenderProps) => React.ReactNode
}

export interface FormFieldArrayRenderProps {
  /** Array of field items with id and key */
  fields: Array<{ id: string, key: string, name: string }>
  /** Add a new item to the array */
  append: (value?: Record<string, unknown>) => void
  /** Remove an item at index */
  remove: (index: number) => void
  /** Move an item from one index to another */
  move: (from: number, to: number) => void
}

export interface FormCustomProps {
  /** Render function with form context */
  children: (context: FormCustomRenderProps) => React.ReactNode
}

export interface FormCustomRenderProps extends FormStateFields, FormActions {
  /** Normalized form instance */
  form: NormalizedFormInstance
  /** All field metadata */
  fields: Record<string, NormalizedFieldMeta>
}
