import type { FormFieldContextValue, FormFieldProps, FormFieldRenderProps } from '../types'
import { CircleHelp } from 'lucide-react'
import * as React from 'react'
import { cn } from '../../../../utils/cn'
import { Label } from '../../../base/label'
import { Tooltip } from '../../../base/tooltip'
import { Icon } from '../../../icons/icon-wrapper'
import { useAdapter } from '../adapter-context'
import { FieldProvider } from '../context/field-context'
import { useFormContext } from '../context/form-context'

// ============================================================================
// FieldLabel (internal - unchanged from original)
// ============================================================================

function FieldLabel({
  htmlFor,
  label,
  hasErrors,
  required,
  tooltip,
  className,
}: {
  htmlFor: string
  label: React.ReactNode
  hasErrors?: boolean
  required?: boolean
  tooltip?: string | React.ReactNode
  className?: string
}) {
  const [isTooltipVisible, setIsTooltipVisible] = React.useState(false)

  return (
    <div className="relative flex w-fit items-center space-x-2">
      <Label
        htmlFor={htmlFor}
        className={cn(
          'text-foreground/80 gap-0 text-xs font-semibold',
          hasErrors && 'text-destructive',
          className,
        )}
      >
        {label}
        {required && (
          <span className="text-destructive/80 align-super text-sm leading-0" aria-hidden="true">
            *
          </span>
        )}
      </Label>
      {tooltip && (
        <Tooltip
          message={tooltip}
          open={isTooltipVisible}
          onOpenChange={setIsTooltipVisible}
          side="bottom"
          contentClassName="max-w-xs text-wrap"
        >
          <Icon
            icon={CircleHelp}
            className={cn(
              'text-ring absolute top-0.5 -right-3 size-3.5 cursor-pointer transition-opacity duration-400',
            )}
          />
        </Tooltip>
      )}
    </div>
  )
}

// ============================================================================
// FormField
// ============================================================================

/**
 * Form.Field - Field wrapper that provides label, errors, and description.
 * Uses the active adapter to resolve field state by name.
 *
 * @example Standard usage
 * ```tsx
 * <Form.Field name="email" label="Email" required>
 *   <Form.Input type="email" />
 * </Form.Field>
 * ```
 *
 * @example Render function for custom components
 * ```tsx
 * <Form.Field name="role" label="Role">
 *   {({ control, meta }) => (
 *     <CustomSelect value={control.value} onChange={control.change} />
 *   )}
 * </Form.Field>
 * ```
 */
export function FormField({
  name,
  children,
  label,
  description,
  tooltip,
  required = false,
  disabled = false,
  className,
  labelClassName,
}: FormFieldProps) {
  const adapter = useAdapter()
  const { fields, isSubmitting, form } = useFormContext()

  // Use the adapter to resolve the field by name
  const fieldState = adapter.useField(name)

  // Derive values
  const errors = fieldState.errors
  const hasErrors = errors.length > 0
  const fieldId = fieldState.id
  const descriptionId = description ? `${fieldId}-description` : undefined
  const errorId = hasErrors ? `${fieldId}-error` : undefined

  // Determine required: explicit prop takes precedence, then schema-derived
  const fieldRequired = required || fieldState.required

  // Context value for child components
  const contextValue = React.useMemo<FormFieldContextValue>(
    () => ({
      name,
      id: fieldId,
      errors,
      required: fieldRequired,
      disabled,
      fieldState,
    }),
    [name, fieldId, errors, fieldRequired, disabled, fieldState],
  )

  // Render function support
  const isRenderFunction = typeof children === 'function'

  const renderContent = () => {
    if (isRenderFunction) {
      const renderProps: FormFieldRenderProps = {
        field: fieldState,
        control: {
          value: fieldState.value,
          change: fieldState.change,
          blur: fieldState.blur,
          focus: fieldState.focus,
        },
        meta: {
          name,
          id: fieldId,
          errors,
          required: fieldRequired,
          disabled,
        },
        fields,
        form,
        isSubmitting,
      }
      return (children as (props: FormFieldRenderProps) => React.ReactNode)(renderProps)
    }
    return children
  }

  return (
    <FieldProvider value={contextValue}>
      <div className={cn('flex flex-col space-y-2', className)}>
        {/* Label */}
        {label && (
          <FieldLabel
            htmlFor={fieldId}
            label={label}
            hasErrors={hasErrors}
            required={fieldRequired}
            tooltip={tooltip}
            className={labelClassName}
          />
        )}

        {/* Field Input */}
        {renderContent()}

        {/* Description */}
        {description && (
          <p id={descriptionId} className="text-ring text-xs text-wrap">
            {description}
          </p>
        )}

        {/* Errors */}
        {hasErrors && (
          <ul
            id={errorId}
            className={cn(
              'text-destructive space-y-1 text-xs font-medium',
              errors.length > 1 && 'list-disc pl-4',
            )}
            role="alert"
            aria-live="polite"
          >
            {errors.map((error: string) => (
              <li key={error} className="text-wrap">
                {error}
              </li>
            ))}
          </ul>
        )}
      </div>
    </FieldProvider>
  )
}

FormField.displayName = 'Form.Field'
