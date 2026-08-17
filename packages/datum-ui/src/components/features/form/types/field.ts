import type { NormalizedFieldMeta, NormalizedFieldState, NormalizedFormInstance } from '../adapter-types'

// ============================================================================
// Field Types
// ============================================================================

/**
 * Render props passed to Form.Field when using render function pattern
 */
export interface FormFieldRenderProps {
  /** Normalized field state with value and control methods */
  field: NormalizedFieldState
  /** Input control for programmatic value updates */
  control: {
    value: unknown
    change: (value: unknown) => void
    blur: () => void
    focus: () => void
  }
  /** Field meta information */
  meta: {
    name: string
    id: string
    errors: string[]
    required: boolean
    disabled: boolean
  }
  /** Access to all form fields */
  fields: Record<string, NormalizedFieldMeta>
  /** Form instance */
  form: NormalizedFormInstance
  /** Whether form is currently submitting */
  isSubmitting: boolean
}

export interface FormFieldProps {
  /** Field name - supports nested paths like "address.city" */
  name: string
  /**
   * Form children - can be either:
   * - ReactNode: Standard input components (Form.Input, Form.Select, etc.)
   * - Render function: For custom components needing field access
   *
   * @example Standard usage
   * ```tsx
   * <Form.Field name="email" label="Email">
   *   <Form.Input type="email" />
   * </Form.Field>
   * ```
   *
   * @example Render function for custom components
   * ```tsx
   * <Form.Field name="role" label="Role">
   *   {({ control, meta, fields }) => (
   *     <CustomSelect
   *       value={control.value}
   *       onChange={control.change}
   *     />
   *   )}
   * </Form.Field>
   * ```
   */
  children: React.ReactNode | ((props: FormFieldRenderProps) => React.ReactNode)

  // Labels & Help Text
  /** Field label */
  label?: string | React.ReactNode
  /** Helper description below the field */
  description?: string | React.ReactNode
  /** Tooltip information */
  tooltip?: string | React.ReactNode

  // State
  /** Mark field as required (shows asterisk) */
  required?: boolean
  /** Disable the field */
  disabled?: boolean
  /** Whether to render field errors (default: true) */
  showErrors?: boolean

  // Styling
  /** Additional CSS classes for the field wrapper */
  className?: string
  /** Additional CSS classes for the label */
  labelClassName?: string
}

export interface FormFieldContextValue {
  /** Field name */
  name: string
  /** Field ID for accessibility */
  id: string
  /** Field errors */
  errors: string[]
  /** Whether the field is required */
  required: boolean
  /** Whether the field is disabled */
  disabled: boolean
  /** Normalized field state (available when adapter provides it) */
  fieldState: NormalizedFieldState | null
}

// ============================================================================
// Field Hook Return Types
// ============================================================================

export interface UseFieldReturn {
  /** Normalized field state */
  field: NormalizedFieldState
  /** Input control for programmatic updates */
  control: {
    value: unknown
    change: (value: unknown) => void
    blur: () => void
    focus: () => void
  }
  /** Field meta information */
  meta: {
    name: string
    id: string
    errors: string[]
    required: boolean
    disabled: boolean
  }
  /** Field errors */
  errors: string[]
}

export interface UseWatchReturn<T = unknown> {
  /** Current field value */
  value: T
}
