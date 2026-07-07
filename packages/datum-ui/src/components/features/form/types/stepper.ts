import type { z } from 'zod'

// ============================================================================
// Stepper Types
// ============================================================================

export interface StepConfig {
  /** Unique step identifier */
  id: string
  /** Step label displayed in navigation */
  label: string
  /** Optional step description */
  description?: string
  /** Zod schema for this step's validation */
  schema: z.ZodType
}

/**
 * Shared stepper navigation state. Both the render-prop surface
 * ({@link FormStepperRenderProps}) and the context value
 * ({@link StepperContextValue}) compose this base so the navigation shape is
 * defined once.
 */
export interface StepperState {
  /** All step configurations */
  steps: StepConfig[]
  /** Current step config */
  current: StepConfig
  /** Current step index (0-based) */
  currentIndex: number
  /** Go to next step (triggers validation) */
  next: () => void
  /** Go to previous step (no validation) */
  prev: () => void
  /** Go to specific step by ID (only backwards without validation) */
  goTo: (stepId: string) => void
  /** Whether current step is first */
  isFirst: boolean
  /** Whether current step is last */
  isLast: boolean
}

/**
 * Render props context passed to Form.Stepper children function
 */
export interface FormStepperRenderProps extends StepperState {
  /** Get data from a specific step by ID */
  getStepData: (stepId: string) => Record<string, unknown> | undefined
  /** Get all data from all completed steps */
  getAllStepData: () => Record<string, unknown>
}

export interface FormStepperProps {
  /** Step configurations */
  steps: StepConfig[]
  /** Form children - can be ReactNode or render function for accessing stepper context */
  children: React.ReactNode | ((props: FormStepperRenderProps) => React.ReactNode)

  // Callbacks
  /** Called when all steps are completed */
  onComplete: (data: Record<string, unknown>) => void | Promise<void>
  /** Called when step changes */
  onStepChange?: (stepId: string, direction: 'next' | 'prev') => void

  // Configuration
  /** Initial step ID */
  initialStep?: string

  // Styling
  /** Additional CSS classes */
  className?: string
}

export interface FormStepProps {
  /** Step ID - must match a step in steps array */
  id: string
  /** Step content */
  children: React.ReactNode
}

export interface StepperNavigationProps {
  /** Navigation variant */
  variant?: 'horizontal' | 'vertical'
  /** Label orientation */
  labelOrientation?: 'horizontal' | 'vertical'
  /** Additional CSS classes */
  className?: string
}

export interface StepperControlsProps {
  /** Previous button label */
  prevLabel?: string | ((isFirst: boolean) => string)
  /** Next button label */
  nextLabel?: string | ((isLast: boolean) => string)
  /** Loading text shown when submitting (only on last step) */
  loadingText?: string
  /** Whether to show previous button */
  showPrev?: boolean
  /** External loading state - overrides internal isSubmitting */
  loading?: boolean
  /** Disable both buttons */
  disabled?: boolean
  /** Callback when previous button is clicked (not on first step) */
  onPrev?: () => void
  /** Callback when cancel is clicked (first step only) */
  onCancel?: () => void
  /** Additional CSS classes */
  className?: string
}

export interface StepperContextValue extends StepperState {
  /** Stepperize utils */
  utils: {
    getIndex: (id: string) => number
  }
}
