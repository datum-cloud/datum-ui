/**
 * Form Stepper sub-module
 *
 * Provides multi-step form components. This is a separate entry point
 * so `@stepperize/react` is only loaded when stepper components are used.
 *
 * @example
 * ```tsx
 * import { Form } from '@datum-cloud/datum-ui/form'
 * // Or import directly:
 * import { FormStepper, FormStep, StepperNavigation, StepperControls } from '@datum-cloud/datum-ui/form/stepper'
 * ```
 */

// Components
export {
  FormStep,
  FormStepper,
  StepperControls,
  StepperNavigation,
} from '../components/stepper'

// Hooks
export { useStepper } from '../hooks/use-stepper'

// Types
export type {
  FormStepperProps,
  FormStepperRenderProps,
  FormStepProps,
  StepConfig,
  StepperContextValue,
  StepperControlsProps,
  StepperNavigationProps,
} from '../types'
