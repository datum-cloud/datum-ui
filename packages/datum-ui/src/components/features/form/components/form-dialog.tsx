import type { z } from 'zod'
import type { FormDialogProps, FormRootRenderProps } from '../types'
import * as React from 'react'
import { Form } from '..'
import { cn } from '../../../../utils/cn'
import { Dialog } from '../../../base/dialog'
import { useControllableState } from '../../../base/hooks'

/**
 * Form.Dialog - A dialog with an integrated form
 *
 * Combines Dialog and Form.Root into a single component with:
 * - Automatic dialog state management (controlled or uncontrolled)
 * - Built-in header with title and description
 * - Built-in footer with submit and cancel buttons
 * - Auto-close on successful submission
 * - Optional header close (X) via showHeaderClose
 * - Prevents accidental close during submission
 * - Supports render function pattern for form state access
 *
 * @example Basic usage
 * ```tsx
 * <Form.Dialog
 *   title="Add User"
 *   description="Enter user details"
 *   schema={userSchema}
 *   onSubmit={handleSubmit}
 *   trigger={<Button>Add User</Button>}
 * >
 *   <Form.Field name="name" label="Name" required>
 *     <Form.Input />
 *   </Form.Field>
 *   <Form.Field name="email" label="Email" required>
 *     <Form.Input type="email" />
 *   </Form.Field>
 * </Form.Dialog>
 * ```
 *
 * @example With render function for form state access
 * ```tsx
 * <Form.Dialog
 *   title="Edit User"
 *   schema={userSchema}
 *   defaultValues={user}
 *   onSubmit={handleSubmit}
 *   trigger={<Button>Edit</Button>}
 * >
 *   {({ form, fields, isSubmitting, reset }) => (
 *     <>
 *       <Form.Field name="name" label="Name">
 *         <Form.Input />
 *       </Form.Field>
 *       <Button variant="ghost" onClick={reset} disabled={isSubmitting}>
 *         Reset
 *       </Button>
 *     </>
 *   )}
 * </Form.Dialog>
 * ```
 */
export function FormDialog<T extends z.ZodType>({
  // Dialog props
  open,
  onOpenChange,
  defaultOpen,
  title,
  description,
  trigger,

  // Form props
  schema,
  defaultValues,
  onSubmit,
  onSuccess,
  onError,

  // Footer props
  submitText = 'Submit',
  submitTextLoading = 'Submitting...',
  cancelText = 'Cancel',
  showCancel = true,
  submitType = 'primary',

  // Loading state
  loading,

  // Form customization
  formComponent,
  telemetry,

  // Styling
  className,
  formClassName,

  // Header close button
  showHeaderClose = true,

  // Children
  children,
}: FormDialogProps<T>) {
  // Open + submitting state share the controllable-state contract with Form.Root.
  // `open`/`onOpenChange` control the dialog; `loading` overrides submitting.
  const [isOpen, setOpen] = useControllableState<boolean>(open, defaultOpen ?? false, onOpenChange)
  const [isSubmitting, setIsSubmitting] = useControllableState<boolean>(loading, false)

  const handleOpenChange = React.useCallback(
    (value: boolean) => {
      // Prevent closing while submitting
      if (!value && isSubmitting) {
        return
      }
      setOpen(value)
    },
    [isSubmitting, setOpen],
  )

  const handleSubmit = React.useCallback(
    async (data: z.infer<T>) => {
      // When `loading` is externally controlled these setters are no-ops, so the
      // parent's loading state stays the single source of truth.
      setIsSubmitting(true)
      try {
        await onSubmit?.(data)
        onSuccess?.(data)
      }
      finally {
        setIsSubmitting(false)
      }
      // Auto-close on successful submission (documented contract), but ONLY for
      // the uncontrolled case. When `loading` is externally controlled the
      // parent owns submission lifecycle (fire-and-forget mutations resolve
      // onSubmit synchronously while the request is still in flight); auto-
      // closing here would tear down the dialog before a later failure can
      // surface in-dialog. Only reached when the submission resolves without
      // throwing; bypasses the submit-guard in handleOpenChange because
      // submission has already completed.
      if (!loading) {
        setOpen(false)
      }
    },
    [onSubmit, onSuccess, setIsSubmitting, setOpen, loading],
  )

  const handleCancel = React.useCallback(() => {
    handleOpenChange(false)
  }, [handleOpenChange])

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <Dialog.Trigger>{trigger}</Dialog.Trigger>}

      <Dialog.Content className={className}>
        <Form.Root
          schema={schema}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          onError={onError}
          isSubmitting={isSubmitting}
          mode="onSubmit"
          formComponent={formComponent}
          telemetry={telemetry}
          className={cn('space-y-0', formClassName)}
        >
          {(renderProps: FormRootRenderProps) => (
            <>
              <Dialog.Header
                title={title}
                description={description}
                onClose={showHeaderClose ? handleCancel : undefined}
                className="border-b"
                descriptionClassName="text-foreground/80"
              />

              <Dialog.Body className="space-y-0">
                {/* Render children - support both patterns */}
                {typeof children === 'function' ? children(renderProps) : children}
              </Dialog.Body>
              <Dialog.Footer className="border-t">
                {showCancel && (
                  <Form.Button
                    type="quaternary"
                    theme="outline"
                    onClick={handleCancel}
                    disableOnSubmit
                  >
                    {cancelText}
                  </Form.Button>
                )}
                <Form.Submit type={submitType}>
                  {isSubmitting ? submitTextLoading : submitText}
                </Form.Submit>
              </Dialog.Footer>
            </>
          )}
        </Form.Root>
      </Dialog.Content>
    </Dialog>
  )
}

FormDialog.displayName = 'Form.Dialog'
