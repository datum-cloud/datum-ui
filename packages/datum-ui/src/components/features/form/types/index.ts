// ============================================================================
// Form types barrel
//
// Types are colocated by subsystem in sibling files and re-exported here so the
// public `../types` import surface stays stable. Add new types to the relevant
// surface file (root/field/inputs/stepper/dialog/context/core/telemetry), not
// to this barrel.
// ============================================================================

export type {
  AutocompleteGroup,
  AutocompleteOption,
  AutocompleteProps,
  FormAutocompleteProps,
} from '../../autocomplete'

export type { FormContextValue } from './context'

export type { FormActions, FormStateFields } from './core'

export type { FormDialogProps } from './dialog'

export type {
  FormFieldContextValue,
  FormFieldProps,
  FormFieldRenderProps,
  UseFieldReturn,
  UseWatchReturn,
} from './field'

export type {
  FormButtonProps,
  FormCheckboxProps,
  FormCopyBoxProps,
  FormCustomProps,
  FormCustomRenderProps,
  FormDescriptionProps,
  FormErrorProps,
  FormFieldArrayProps,
  FormFieldArrayRenderProps,
  FormInputProps,
  FormRadioGroupProps,
  FormRadioItemProps,
  FormSelectItemProps,
  FormSelectProps,
  FormSubmitProps,
  FormSwitchProps,
  FormTextareaProps,
  FormWhenProps,
} from './inputs'

export type { FormRootProps, FormRootRenderProps } from './root'

export type {
  FormStepperProps,
  FormStepperRenderProps,
  FormStepProps,
  StepConfig,
  StepperContextValue,
  StepperControlsProps,
  StepperNavigationProps,
  StepperState,
} from './stepper'

// ============================================================================
// Autocomplete Types
// ============================================================================

export type { FormTelemetry } from './telemetry'
