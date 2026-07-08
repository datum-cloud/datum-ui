import type { NormalizedFormState } from '../adapter-types'

// ============================================================================
// Shared form-state bases
// ============================================================================

/**
 * The canonical set of reactive form-state fields, shared by every render-prop
 * and context surface. Composes the adapter's {@link NormalizedFormState} and
 * adds the Form-tracked `isSubmitting` flag so the shape is defined once instead
 * of being hand-duplicated across Form.Root / Form.Custom / FormContext.
 */
export interface FormStateFields extends NormalizedFormState {
  /** Whether the form is currently submitting */
  isSubmitting: boolean
}

/**
 * Imperative form actions shared across render-prop / context surfaces.
 */
export interface FormActions {
  /** Programmatically submit the form */
  submit: () => void
  /** Reset form to default values */
  reset: () => void
}
