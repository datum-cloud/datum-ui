import type { z } from 'zod'
import type { ButtonProps } from '../../..'
import type { FormRootRenderProps } from './root'
import type { FormTelemetry } from './telemetry'

// ============================================================================
// Dialog Form Types
// ============================================================================

export interface FormDialogProps<T extends z.ZodType> {
  // Dialog state
  /** Controlled open state */
  open?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Default open state for uncontrolled usage */
  defaultOpen?: boolean

  // Dialog content
  /** Dialog title */
  title: string
  /** Dialog description (optional) */
  description?: string
  /** Trigger element to open the dialog */
  trigger?: React.ReactNode

  // Form props
  /** Zod schema for validation */
  schema: T
  /** Default form values */
  defaultValues?: Partial<z.infer<T>>
  /** Client-side submit handler */
  onSubmit?: (data: z.infer<T>) => void | Promise<void>
  /** Called after successful submission */
  onSuccess?: (data: z.infer<T>) => void
  /** Called when validation fails */
  onError?: (error: z.ZodError<z.infer<T>>) => void

  // Footer customization
  /** Submit button text (default: "Submit") */
  submitText?: string
  /** Submit button text while loading */
  submitTextLoading?: string
  /** Cancel button text (default: "Cancel") */
  cancelText?: string
  /** Whether to show cancel button (default: true) */
  showCancel?: boolean
  /** Submit button type variant */
  submitType?: ButtonProps['type']

  // Loading state
  /**
   * External loading state - use when submission is handled by external mutation.
   * When provided, this overrides the internal isSubmitting state.
   * @example
   * ```tsx
   * const mutation = useCreateUser();
   * <Form.Dialog loading={mutation.isPending} ... />
   * ```
   */
  loading?: boolean

  // Form customization
  /** Custom form element (e.g., React Router's Form). Defaults to native <form>. */
  formComponent?: React.ElementType
  /** Optional telemetry callbacks for form submission tracking */
  telemetry?: FormTelemetry

  // Header close button
  /** Whether to show the header close (X) button (default: true) */
  showHeaderClose?: boolean

  // Styling
  /** Dialog content className */
  className?: string
  /** Form className */
  formClassName?: string

  /**
   * Dialog form children - can be either:
   * - ReactNode: Standard form fields
   * - Render function: For accessing form state (form, fields, isSubmitting, etc.)
   *
   * @example Standard usage
   * ```tsx
   * <Form.Dialog title="Add User" schema={schema} onSubmit={handleSubmit}>
   *   <Form.Field name="email"><Form.Input type="email" /></Form.Field>
   * </Form.Dialog>
   * ```
   *
   * @example Render function for form state access
   * ```tsx
   * <Form.Dialog title="Edit User" schema={schema} onSubmit={handleSubmit}>
   *   {({ form, fields, isSubmitting, reset }) => (
   *     <>
   *       <Form.Field name="email"><Form.Input type="email" /></Form.Field>
   *       <Button onClick={reset} disabled={isSubmitting}>Reset</Button>
   *     </>
   *   )}
   * </Form.Dialog>
   * ```
   */
  children: React.ReactNode | ((props: FormRootRenderProps) => React.ReactNode)
}
