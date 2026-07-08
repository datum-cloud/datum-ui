import type { z } from 'zod'
import type { NormalizedFieldMeta, NormalizedFormInstance } from '../adapter-types'
import type { FormActions, FormStateFields } from './core'
import type { FormTelemetry } from './telemetry'

// ============================================================================
// Form.Root Types
// ============================================================================

/**
 * Render props passed to Form.Root when using render function pattern
 */
export interface FormRootRenderProps extends FormStateFields, FormActions {
  /** Normalized form instance */
  form: NormalizedFormInstance
  /** All form fields with their normalized metadata */
  fields: Record<string, NormalizedFieldMeta>
  /** Validation mode controlling when errors are displayed */
  mode: 'onChange' | 'onBlur' | 'onSubmit'
}

export interface FormRootProps<T extends z.ZodType> {
  /** Zod schema for validation */
  schema: T
  /**
   * Form children - can be either:
   * - ReactNode: Standard form content
   * - Render function: For accessing form state (form, fields, isSubmitting, etc.)
   *
   * @example Standard usage
   * ```tsx
   * <Form.Root schema={schema}>
   *   <Form.Field name="email"><Form.Input /></Form.Field>
   *   <Form.Submit>Save</Form.Submit>
   * </Form.Root>
   * ```
   *
   * @example Render function for form state access
   * ```tsx
   * <Form.Root schema={schema}>
   *   {({ form, fields, isSubmitting }) => (
   *     <>
   *       <Form.Field name="email"><Form.Input /></Form.Field>
   *       <Button disabled={isSubmitting} onClick={() => form.update({...})}>
   *         Cancel
   *       </Button>
   *     </>
   *   )}
   * </Form.Root>
   * ```
   */
  children: React.ReactNode | ((props: FormRootRenderProps) => React.ReactNode)

  // Submission
  /** Client-side submit handler */
  onSubmit?: (data: z.infer<T>) => void | Promise<void>
  /** React Router action path for server-side submission */
  action?: string
  /** HTTP method for form submission */
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

  /**
   * Custom form component to render (defaults to native `<form>`).
   * Use to integrate with framework-specific forms (e.g. React Router's `<Form>`).
   */
  formComponent?: React.ElementType

  // Configuration
  /** Unique form ID */
  id?: string
  /**
   * Form name for analytics and error tracking.
   * Used in telemetry callbacks to identify which form the user interacted with.
   * @example "http-proxy-create", "dns-zone-edit", "project-settings"
   */
  name?: string
  /**
   * Optional telemetry callbacks for form lifecycle tracking.
   * When omitted, forms work silently without any tracking.
   */
  telemetry?: FormTelemetry
  /** Default values for form fields */
  defaultValues?: Partial<z.infer<T>>
  /** When to validate: onBlur, onChange, or onSubmit */
  mode?: 'onBlur' | 'onChange' | 'onSubmit'
  /**
   * External submitting state - use when submission is handled externally (e.g., with useFetcher)
   * When provided, this overrides the internal isSubmitting state
   */
  isSubmitting?: boolean

  // Callbacks
  /** Called when validation fails */
  onError?: (errors: z.ZodError<z.infer<T>>) => void
  /** Called after successful submission */
  onSuccess?: (data: z.infer<T>) => void

  // Styling
  /** Additional CSS classes */
  className?: string
}
