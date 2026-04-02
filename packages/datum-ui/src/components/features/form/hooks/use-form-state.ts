import { useFormContext } from '../context/form-context'

/**
 * Hook to access form-level state (dirty, valid, submitted, etc.)
 *
 * @example
 * ```tsx
 * function SaveButton() {
 *   const { isDirty, isSubmitting, isValid } = useFormState()
 *
 *   return (
 *     <button
 *       type="submit"
 *       disabled={!isDirty || isSubmitting || !isValid}
 *     >
 *       Save Changes
 *     </button>
 *   )
 * }
 * ```
 */
export function useFormState() {
  const ctx = useFormContext()

  return {
    /** Whether any field value differs from its default value */
    isDirty: ctx.isDirty,
    /** Whether the form currently passes validation */
    isValid: ctx.isValid,
    /** Whether the form is currently submitting */
    isSubmitting: ctx.isSubmitting,
    /** Whether the form has been submitted at least once */
    isSubmitted: ctx.isSubmitted,
    /** Number of times the form has been submitted */
    submitCount: ctx.submitCount,
    /** Record of which fields have been modified from defaults */
    dirtyFields: ctx.dirtyFields,
    /** Record of which fields have been focused and blurred */
    touchedFields: ctx.touchedFields,
  }
}
