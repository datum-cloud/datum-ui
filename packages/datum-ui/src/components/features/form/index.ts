/**
 * Datum Form Library
 *
 * A compound component pattern form library with pluggable adapter support.
 * Choose between Conform.js or React Hook Form as your form backend,
 * with Zod for schema validation.
 *
 * ## Adapter Setup
 *
 * Wrap your app with an adapter provider:
 *
 * ```tsx
 * // Conform adapter
 * import { ConformAdapter } from '@datum-cloud/datum-ui/form/adapters/conform'
 * <ConformAdapter><App /></ConformAdapter>
 *
 * // React Hook Form adapter
 * import { RHFAdapter } from '@datum-cloud/datum-ui/form/adapters/rhf'
 * <RHFAdapter><App /></RHFAdapter>
 * ```
 *
 * @example Basic Usage
 * ```tsx
 * import { Form } from '@datum-cloud/datum-ui/form';
 * import { z } from 'zod';
 *
 * const userSchema = z.object({
 *   name: z.string().min(2),
 *   email: z.string().email(),
 * });
 *
 * function UserForm() {
 *   return (
 *     <Form.Root schema={userSchema} onSubmit={(data) => console.log(data)}>
 *       <Form.Field name="name" label="Name" required>
 *         <Form.Input />
 *       </Form.Field>
 *       <Form.Field name="email" label="Email" required>
 *         <Form.Input type="email" />
 *       </Form.Field>
 *       <Form.Submit>Save</Form.Submit>
 *     </Form.Root>
 *   );
 * }
 * ```
 *
 * @example Multi-Step Form (separate import)
 * ```tsx
 * import { FormStepper, FormStep, StepperNavigation, StepperControls } from '@datum-cloud/datum-ui/form/stepper';
 *
 * const steps = [
 *   { id: 'account', label: 'Account', schema: accountSchema },
 *   { id: 'profile', label: 'Profile', schema: profileSchema },
 * ];
 *
 * <FormStepper steps={steps} onComplete={handleComplete}>
 *   <StepperNavigation />
 *   <FormStep id="account">...</FormStep>
 *   <FormStep id="profile">...</FormStep>
 *   <StepperControls />
 * </FormStepper>
 * ```
 *
 * @example Form State
 * ```tsx
 * <Form.Root schema={schema} onSubmit={handleSubmit}>
 *   {({ isDirty, isValid, isSubmitted, submitCount }) => (
 *     <>
 *       <Form.Field name="name"><Form.Input /></Form.Field>
 *       <Form.Submit disabled={!isDirty || !isValid}>Save</Form.Submit>
 *       {isSubmitted && <p>Submitted {submitCount} time(s)</p>}
 *     </>
 *   )}
 * </Form.Root>
 * ```
 *
 * @example Conditional Fields
 * ```tsx
 * <Form.Field name="contactMethod">
 *   <Form.Select>
 *     <Form.SelectItem value="email">Email</Form.SelectItem>
 *     <Form.SelectItem value="phone">Phone</Form.SelectItem>
 *   </Form.Select>
 * </Form.Field>
 *
 * <Form.When field="contactMethod" is="email">
 *   <Form.Field name="email"><Form.Input type="email" /></Form.Field>
 * </Form.When>
 * ```
 */
// Import all components
import {
  FormAutocomplete,
  FormAutosearch,
  FormButton,
  FormCheckbox,
  FormCombobox,
  FormCopyBox,
  FormCustom,
  FormDatePicker,
  FormDateTimePicker,
  FormDescription,
  FormDialog,
  FormError,
  FormField,
  FormFieldArray,
  FormInput,
  FormInputGroup,
  FormRadioGroup,
  FormRadioItem,
  FormRoot,
  FormSelect,
  FormSelectItem,
  FormSubmit,
  FormSwitch,
  FormTextarea,
  FormTimePicker,
  FormTransfer,
  FormWhen,
} from './components'
// Import hooks
import {
  useField,
  useFieldContext,
  useFormContext,
  useFormState,
  useWatch,
  useWatchAll,
} from './hooks'

/**
 * Form compound component
 *
 * Requires an adapter provider at the application root:
 * - `<ConformAdapter>` from `@datum-cloud/datum-ui/form/adapters/conform`
 * - `<RHFAdapter>` from `@datum-cloud/datum-ui/form/adapters/rhf`
 *
 * Components:
 * - Form.Root - Main form container
 * - Form.Field - Field wrapper with label and error handling
 * - Form.Input, Form.Textarea, Form.Select, Form.Checkbox, Form.Switch, Form.RadioGroup
 * - Form.Autocomplete, Form.CopyBox, Form.InputGroup
 * - Form.When - Conditional rendering
 * - Form.FieldArray - Dynamic array of fields
 * - Form.Custom - Escape hatch for custom implementations
 * - Form.Dialog - Form rendered inside a Dialog
 * - Form.Submit, Form.Button, Form.Error, Form.Description
 *
 * Stepper (separate import):
 * - `@datum-cloud/datum-ui/form/stepper` provides FormStepper, FormStep, StepperNavigation, StepperControls, useStepper
 *
 * Hooks:
 * - Form.useFormContext, Form.useFormState, Form.useFieldContext, Form.useField
 * - Form.useWatch, Form.useWatchAll
 */
export const Form = {
  // Core
  Root: FormRoot,
  Field: FormField,
  Submit: FormSubmit,
  Button: FormButton,
  Error: FormError,
  Description: FormDescription,

  // Inputs
  Input: FormInput,
  Textarea: FormTextarea,
  Select: FormSelect,
  SelectItem: FormSelectItem,
  Checkbox: FormCheckbox,
  Switch: FormSwitch,
  RadioGroup: FormRadioGroup,
  RadioItem: FormRadioItem,
  CopyBox: FormCopyBox,
  Autocomplete: FormAutocomplete,
  Autosearch: FormAutosearch,
  Combobox: FormCombobox,
  InputGroup: FormInputGroup,
  DatePicker: FormDatePicker,
  DateTimePicker: FormDateTimePicker,
  TimePicker: FormTimePicker,
  Transfer: FormTransfer,

  // Advanced
  When: FormWhen,
  FieldArray: FormFieldArray,
  Custom: FormCustom,

  // Dialog
  Dialog: FormDialog,

  // Hooks
  useFormContext,
  useFormState,
  useFieldContext,
  useField,
  useWatch,
  useWatchAll,
} as const

// Named exports for direct imports
export {
  FormAutocomplete,
  FormAutosearch,
  FormButton,
  FormCheckbox,
  FormCombobox,
  FormCopyBox,
  FormCustom,
  FormDatePicker,
  FormDateTimePicker,
  FormDescription,

  // Dialog
  FormDialog,
  FormError,
  FormField,
  FormFieldArray,
  // Inputs
  FormInput,
  FormRadioGroup,
  FormRadioItem,
  // Core
  FormRoot,
  FormSelect,
  FormSelectItem,
  FormSubmit,
  FormSwitch,
  FormTextarea,
  FormTimePicker,
  FormTransfer,
  // Advanced
  FormWhen,

  useField,
  useFieldContext,
  // Hooks
  useFormContext,
  useFormState,
  useWatch,
  useWatchAll,
}

// Export adapter context
export { FormAdapterProvider, useAdapter } from './adapter-context'

// Export adapter types
export type {
  CreateFormProps,
  FormAdapter,
  NormalizedFieldArray,
  NormalizedFieldMeta,
  NormalizedFieldState,
  NormalizedFormInstance,
  NormalizedFormState,
} from './adapter-types'

// Export types
export type {
  AutocompleteGroup,
  AutocompleteOption,
  AutocompleteProps,
  FormAutocompleteProps,
  FormButtonProps,
  FormCheckboxProps,
  FormContextValue,
  FormCopyBoxProps,
  FormCustomProps,
  FormCustomRenderProps,
  FormDescriptionProps,
  FormDialogProps,
  FormErrorProps,
  FormFieldArrayProps,
  FormFieldArrayRenderProps,
  FormFieldContextValue,
  FormFieldProps,
  FormFieldRenderProps,
  FormInputProps,
  FormRadioGroupProps,
  FormRadioItemProps,
  FormRootProps,
  FormRootRenderProps,
  FormSelectItemProps,
  FormSelectProps,
  FormSubmitProps,
  FormSwitchProps,
  FormTelemetry,
  FormTextareaProps,
  FormWhenProps,
  UseFieldReturn,
  UseWatchReturn,
} from './types'
