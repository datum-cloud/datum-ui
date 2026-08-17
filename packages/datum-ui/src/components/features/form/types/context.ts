import type { NormalizedFieldMeta, NormalizedFormInstance } from '../adapter-types'
import type { FormActions, FormStateFields } from './core'

// ============================================================================
// Context Types
// ============================================================================

export interface FormContextValue<_T extends Record<string, unknown> = Record<string, unknown>>
  extends FormStateFields, FormActions {
  /** Normalized form instance */
  form: NormalizedFormInstance
  /** Field metadata accessor */
  fields: Record<string, NormalizedFieldMeta>
  /** Validation mode controlling when errors are displayed */
  mode: 'onChange' | 'onBlur' | 'onSubmit'
  /** Array of field names that are display-touched (for error filtering) */
  displayTouchedFields: string[]
  /** Mark a field as display-touched */
  markFieldTouched: (fieldName: string) => void
  /** Mark all fields as display-touched */
  markAllFieldsTouched: () => void
  /** Form ID */
  formId: string
}
