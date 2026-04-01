import type { FormCustomProps, FormCustomRenderProps } from '../types'
import * as React from 'react'
import { useFormContext } from '../context/form-context'

/**
 * Form.Custom - Escape hatch for custom implementations
 *
 * Provides access to the underlying form context for complex use cases
 * that don't fit the standard component patterns.
 *
 * @example
 * ```tsx
 * <Form.Custom>
 *   {({ form, fields, submit, reset }) => (
 *     <MyCustomComponent
 *       fields={fields}
 *       onCustomAction={() => {
 *         // Do something custom
 *         submit();
 *       }}
 *     />
 *   )}
 * </Form.Custom>
 * ```
 */
export function FormCustom({ children }: FormCustomProps) {
  const ctx = useFormContext()

  const renderProps: FormCustomRenderProps = {
    form: ctx.form as any,
    fields: ctx.fields as any,
    isSubmitting: ctx.isSubmitting,
    isDirty: ctx.isDirty,
    isValid: ctx.isValid,
    isSubmitted: ctx.isSubmitted,
    submitCount: ctx.submitCount,
    dirtyFields: ctx.dirtyFields,
    touchedFields: ctx.touchedFields,
    submit: ctx.submit,
    reset: ctx.reset,
  }

  return <>{children(renderProps)}</>
}

FormCustom.displayName = 'Form.Custom'
