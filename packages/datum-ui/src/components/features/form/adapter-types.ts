import type { z } from 'zod'

// ============================================================================
// Normalized Types (adapter-agnostic)
// ============================================================================

export interface NormalizedFieldMeta {
  /** Unique field ID for accessibility */
  id: string
  /** Validation errors for this field */
  errors: string[]
  /** Whether the field is required (derived from schema) */
  required: boolean
  /** Whether the field value differs from its default value */
  isDirty: boolean
  /** Whether the field has been focused and blurred */
  isTouched: boolean
}

export interface NormalizedFieldState extends NormalizedFieldMeta {
  /** Field name (supports dot-notation paths) */
  name: string
  /** Current field value (native JS type: string, boolean, number, etc.) */
  value: unknown
  /** Update the field value */
  change: (value: unknown) => void
  /** Mark field as blurred (triggers validation in onBlur mode) */
  blur: () => void
  /** Focus the field */
  focus: () => void
  /**
   * Optional props object for uncontrolled inputs (Conform uses hidden inputs).
   * When present, spread onto native `<input>` elements instead of using value/change.
   * When absent, components fall back to controlled mode (value + change).
   */
  inputProps?: Record<string, unknown>
}

export interface NormalizedFieldArray {
  /** Array of field items with id, key, and name prefix */
  items: Array<{ id: string, key: string, name: string }>
  /** Append a new item to the array */
  append: (defaultValue?: Record<string, unknown>) => void
  /** Remove an item at the given index */
  remove: (index: number) => void
  /** Move an item from one index to another */
  move: (from: number, to: number) => void
}

export interface NormalizedFormState {
  /** Whether any field value differs from its default value */
  isDirty: boolean
  /** Whether the form currently passes validation */
  isValid: boolean
  /** Whether the form has been submitted at least once */
  isSubmitted: boolean
  /** Number of times the form has been submitted */
  submitCount: number
  /** Record of which fields have been modified from defaults */
  dirtyFields: Record<string, boolean>
  /** Record of which fields have been focused and blurred */
  touchedFields: Record<string, boolean>
}

export interface NormalizedFormInstance {
  /** Form ID */
  id: string
  /** Field metadata keyed by field name */
  fields: Record<string, NormalizedFieldMeta>
  /** Props to spread on the <form> element (id, onSubmit, noValidate, etc.) */
  formProps: Record<string, unknown>
  /** Reactive form-level state (dirty, valid, submitted, etc.) */
  formState: NormalizedFormState
  /** Programmatically submit the form */
  submit: () => void
  /** Reset the form to default values */
  reset: () => void
  /** Get all current form values (for stepper prev() save-without-validate) */
  getValues: () => Record<string, unknown>
  /** The raw underlying library instance (opaque - never read by shared components) */
  raw: unknown
}

// ============================================================================
// Adapter Creation Props
// ============================================================================

export interface CreateFormProps {
  /** Zod schema for validation */
  schema: z.ZodType
  /** Default values for form fields */
  defaultValues?: Record<string, unknown>
  /** Validation mode */
  mode: 'onBlur' | 'onChange' | 'onSubmit'
  /** Form ID */
  id?: string
  /**
   * Submit handler called with validated data.
   * When absent, the form submits natively (server-side / framework integration).
   */
  onSubmit?: (data: Record<string, unknown>) => void | Promise<void>
  /** Form ref callback for programmatic submit via requestSubmit */
  formRef?: React.RefObject<HTMLFormElement | null>
}

// ============================================================================
// Adapter Interface
// ============================================================================

export interface FormAdapter {
  /** Display name for error messages (e.g., "Conform", "React Hook Form") */
  name: string

  /** Create a new form instance. Called once per Form.Root mount. */
  useCreateForm: (props: CreateFormProps) => NormalizedFormInstance

  /**
   * Resolve a field by dot-notation path and return its normalized state.
   * Must be called within the adapter's FormProvider.
   */
  useField: (name: string) => NormalizedFieldState

  /** Watch a single field's value reactively. */
  useWatch: (name: string) => unknown

  /** Watch multiple fields' values reactively. */
  useWatchAll: (names: string[]) => Record<string, unknown>

  /** Get field array helpers for a given array field name. */
  useFieldArray: (name: string) => NormalizedFieldArray

  /**
   * Provider component that wraps the form element.
   * Provides library-specific context (e.g., ConformFormProvider, RHF FormProvider).
   */
  FormProvider: React.ComponentType<{ instance: NormalizedFormInstance, children: React.ReactNode }>
}
