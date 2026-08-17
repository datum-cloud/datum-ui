import type { z } from 'zod'
import type { FormRootProps, FormRootRenderProps } from '../types'
import * as React from 'react'
import { cn } from '../../../../utils/cn'
import { useControllableState } from '../../../base/hooks'
import { useAdapter } from '../adapter-context'
import { FormProvider } from '../context/form-context'

/**
 * Form.Root - Root form container that integrates with the active adapter.
 *
 * @example Standard usage
 * ```tsx
 * <Form.Root schema={schema} onSubmit={handleSubmit}>
 *   <Form.Field name="email" label="Email">
 *     <Form.Input type="email" />
 *   </Form.Field>
 *   <Form.Submit>Save</Form.Submit>
 * </Form.Root>
 * ```
 *
 * @example Render function for form state access
 * ```tsx
 * <Form.Root schema={schema}>
 *   {({ form, fields, isSubmitting }) => (
 *     <Form.Field name="email"><Form.Input /></Form.Field>
 *   )}
 * </Form.Root>
 * ```
 */
export function FormRoot<T extends z.ZodType>({
  schema,
  children,
  onSubmit,
  action,
  method = 'POST',
  formComponent: FormComp = 'form',
  id,
  name,
  defaultValues,
  mode = 'onChange',
  isSubmitting: externalIsSubmitting,
  onError,
  onSuccess,
  telemetry,
  className,
}: FormRootProps<T>) {
  const adapter = useAdapter()

  // Submitting state via the shared controllable-state contract: uncontrolled by
  // default, but `isSubmitting` (e.g. from useFetcher) overrides when provided.
  const [isSubmitting, setIsSubmitting] = useControllableState<boolean>(externalIsSubmitting, false)

  // Track submission state (shared across all adapters)
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [submitCount, setSubmitCount] = React.useState(0)

  const formRef = React.useRef<HTMLFormElement>(null)

  // Wrap onSubmit with telemetry + state management
  const wrappedOnSubmit = React.useCallback(
    async (data: Record<string, unknown>) => {
      setIsSubmitting(true)
      setIsSubmitted(true)
      setSubmitCount(prev => prev + 1)
      try {
        await onSubmit?.(data as any)
        telemetry?.onSuccess?.({ formName: name ?? '', formId: id })
        onSuccess?.(data as any)
      }
      catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        // Was the error routed to at least one consumer-provided handler? If not,
        // rethrow instead of silently swallowing it so a failed submission never
        // looks like success.
        const handled = Boolean(telemetry?.onError || telemetry?.captureError || onError)
        telemetry?.onError?.({ formName: name ?? '', formId: id, error: err })
        telemetry?.captureError?.(err, { formName: name ?? '', formId: id })
        onError?.(error as any)
        if (!handled) {
          throw err
        }
      }
      finally {
        setIsSubmitting(false)
      }
    },
    [onSubmit, onSuccess, onError, telemetry, name, id, setIsSubmitting],
  )

  // Create form instance via the adapter
  const instance = adapter.useCreateForm({
    schema,
    defaultValues: defaultValues as Record<string, unknown>,
    mode,
    id,
    onSubmit: onSubmit ? wrappedOnSubmit : undefined,
    formRef,
  })

  // Merge adapter-provided formState with Form.Root-tracked submission state
  const { formState } = instance

  // Context value
  const contextValue = React.useMemo(
    () => ({
      form: instance,
      fields: instance.fields,
      isSubmitting,
      isDirty: formState.isDirty,
      isValid: formState.isValid,
      isSubmitted,
      submitCount,
      dirtyFields: formState.dirtyFields,
      touchedFields: formState.touchedFields,
      mode,
      displayTouchedFields: instance.touchedFields,
      markFieldTouched: instance.markFieldTouched,
      markAllFieldsTouched: instance.markAllFieldsTouched,
      submit: () => formRef.current?.requestSubmit(),
      reset: () => instance.reset(),
      formId: instance.id,
    }),
    [instance, isSubmitting, formState, isSubmitted, submitCount, mode],
  )

  // Render function support
  const isRenderFunction = typeof children === 'function'

  const renderChildren = () => {
    if (!isRenderFunction) {
      return children
    }
    const renderProps: FormRootRenderProps = {
      form: instance,
      fields: instance.fields,
      isSubmitting,
      isDirty: formState.isDirty,
      isValid: formState.isValid,
      isSubmitted,
      submitCount,
      dirtyFields: formState.dirtyFields,
      touchedFields: formState.touchedFields,
      mode,
      submit: () => formRef.current?.requestSubmit(),
      reset: () => instance.reset(),
    }
    return (children as (props: FormRootRenderProps) => React.ReactNode)(renderProps)
  }

  return (
    <FormProvider value={contextValue}>
      <adapter.FormProvider instance={instance}>
        <FormComp
          ref={formRef}
          {...instance.formProps}
          method={method}
          action={action}
          className={cn('space-y-6', className)}
          autoComplete="off"
          noValidate
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            const submitEvent = e.nativeEvent as SubmitEvent
            const submitter = submitEvent.submitter as HTMLButtonElement | null
            e.stopPropagation()

            // Only mark fields as touched for visible submit button clicks (not Conform's hidden validation buttons)
            // Conform uses hidden buttons with name="__intent__" for field validation during initialization
            // Real user submit buttons are visible (not hidden)
            const isUserSubmit = submitter && !submitter.hidden
            if (isUserSubmit) {
              // On submit attempt, always mark all fields as display-touched so errors become visible
              instance.markAllFieldsTouched()
            }
            telemetry?.onSubmit?.({ formName: name ?? '', formId: id })

            // Action-based submission (no client onSubmit): wrappedOnSubmit never
            // runs, so surface the success callbacks + submission state here that
            // consumers rely on. onSubmit-based forms take that path instead.
            if (isUserSubmit && !onSubmit) {
              setIsSubmitted(true)
              setSubmitCount(prev => prev + 1)
              telemetry?.onSuccess?.({ formName: name ?? '', formId: id })
              onSuccess?.(instance.getValues() as z.infer<T>)
            }

            const adapterSubmit = instance.formProps.onSubmit as
              | ((e: React.FormEvent<HTMLFormElement>) => void)
              | undefined
            adapterSubmit?.(e)
          }}
        >
          {renderChildren()}
        </FormComp>
      </adapter.FormProvider>
    </FormProvider>
  )
}

FormRoot.displayName = 'Form.Root'
