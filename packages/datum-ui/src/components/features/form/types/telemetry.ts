// ============================================================================
// Telemetry Types
// ============================================================================

/**
 * Optional telemetry interface for form lifecycle tracking.
 * When provided, callbacks fire on form events (submit, success, error, etc.).
 * When omitted, forms work silently without any tracking.
 *
 * @example Wiring Sentry in the consuming app
 * ```tsx
 * const sentryTelemetry: FormTelemetry = {
 *   onSubmit: ({ formName, formId }) => trackFormSubmit({ formName, formId }),
 *   onSuccess: ({ formName, formId }) => trackFormSuccess({ formName, formId }),
 *   onError: ({ formName, formId, error }) => trackFormError({ formName, formId, error }),
 *   onValidationError: ({ formName, formId, fieldErrors }) => trackFormValidationError({ formName, formId, fieldErrors }),
 *   captureError: (error, context) => Sentry.captureException(error, { extra: context }),
 * };
 *
 * <Form.Root schema={schema} telemetry={sentryTelemetry} onSubmit={handleSubmit} />
 * ```
 */
export interface FormTelemetry {
  /** Called when a form submission is attempted */
  onSubmit?: (info: { formName: string, formId?: string }) => void
  /** Called after a successful form submission */
  onSuccess?: (info: { formName: string, formId?: string }) => void
  /** Called when a form submission throws an error */
  onError?: (info: { formName: string, formId?: string, error: Error }) => void
  /** Called when form validation fails */
  onValidationError?: (info: {
    formName: string
    formId?: string
    fieldErrors: Record<string, string[]>
  }) => void
  /** Called to capture an error with additional context (e.g. Sentry) */
  captureError?: (error: Error, context: Record<string, unknown>) => void
}
