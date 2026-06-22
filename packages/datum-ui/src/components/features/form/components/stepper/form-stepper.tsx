import type * as Stepperize from '@stepperize/react'
import type { FormStepperProps, FormStepperRenderProps, StepConfig } from '../../types'
import * as React from 'react'
import { cn } from '../../../../../utils/cn'
import { defineStepper } from '../../../stepper'
import { useAdapter } from '../../adapter-context'
import { FormProvider } from '../../context/form-context'

// ============================================================================
// Types
// ============================================================================

interface FormStepperContextValue {
  /** All step configurations */
  steps: StepConfig[]
  /** Current step config */
  current: StepConfig
  /** Current step index */
  currentIndex: number
  /** Go to next step */
  next: () => void
  /** Go to previous step */
  prev: () => void
  /** Go to specific step by ID */
  goTo: (stepId: string) => void
  /** Whether current step is first */
  isFirst: boolean
  /** Whether current step is last */
  isLast: boolean
  /** Get metadata for a specific step */
  getStepData: (stepId: string) => Record<string, unknown> | undefined
  /** Get all metadata from all steps */
  getAllStepData: () => Record<string, unknown>
  /** Stepperize utils */
  utils: {
    getIndex: (id: string) => number
  }
}

// ============================================================================
// Context
// ============================================================================

const FormStepperContext = React.createContext<FormStepperContextValue | null>(null)

export function useFormStepperContext(): FormStepperContextValue {
  const context = React.use(FormStepperContext)
  if (!context) {
    throw new Error('useFormStepperContext must be used within a Form.Stepper component')
  }
  return context
}

/**
 * Convert StepConfig[] to Stepperize step format
 */
function toStepperizeSteps(steps: StepConfig[]): Stepperize.Step[] {
  return steps.map(step => ({
    id: step.id,
    label: step.label,
    description: step.description,
  })) as Stepperize.Step[]
}

// ============================================================================
// FormStepper Component
// ============================================================================

/**
 * Form.Stepper - Multi-step form container
 *
 * Uses Stepperize internally for step navigation and a single Conform form
 * instance for all steps. Schemas are auto-merged for unified validation.
 *
 * @example
 * ```tsx
 * const steps = [
 *   { id: 'account', label: 'Account', schema: accountSchema },
 *   { id: 'profile', label: 'Profile', schema: profileSchema },
 * ];
 *
 * <Form.Stepper steps={steps} onComplete={handleComplete}>
 *   <Form.StepperNavigation />
 *
 *   <Form.Step id="account">
 *     <Form.Field name="email" label="Email" required>
 *       <Form.Input type="email" />
 *     </Form.Field>
 *   </Form.Step>
 *
 *   <Form.Step id="profile">
 *     <Form.Field name="name" label="Full Name" required>
 *       <Form.Input />
 *     </Form.Field>
 *   </Form.Step>
 *
 *   <Form.StepperControls />
 * </Form.Stepper>
 * ```
 */
export function FormStepper({
  steps,
  children,
  onComplete,
  onStepChange,
  initialStep,
  className,
  defaultValues,
  id,
  formComponent,
  mode = 'onSubmit',
}: FormStepperProps & {
  defaultValues?: Record<string, unknown>
  id?: string
  formComponent?: React.ElementType
  /** Validation mode for each step form (default: onSubmit) */
  mode?: 'onBlur' | 'onChange' | 'onSubmit'
}) {
  // Create stepperize definition - memoized to prevent recreation
  const stepperDef = React.useMemo(() => {
    const stepperizeSteps = toStepperizeSteps(steps)
    return defineStepper(...stepperizeSteps)
  }, [steps])

  // Determine initial step index
  const initialStepIndex = React.useMemo(() => {
    if (!initialStep)
      return undefined
    const index = steps.findIndex(s => s.id === initialStep)
    return index >= 0 ? steps[index]!.id : undefined
  }, [initialStep, steps])

  const { Stepper } = stepperDef

  // Note: initialStep is forwarded to Stepperize's Provider as defaultStep
  const providerProps = initialStepIndex ? { defaultStep: initialStepIndex as any } : {}

  return (

    <Stepper.Provider {...providerProps}>
      <FormStepperContent
        steps={steps}
        stepperDef={stepperDef}
        onComplete={onComplete}
        onStepChange={onStepChange}
        className={className}
        defaultValues={defaultValues}
        id={id}
        formComponent={formComponent}
        mode={mode}
      >
        {children}
      </FormStepperContent>
    </Stepper.Provider>
  )
}

FormStepper.displayName = 'Form.Stepper'

// ============================================================================
// FormStepperContent - Internal component with access to Stepperize context
// ============================================================================

interface FormStepperContentProps {
  steps: StepConfig[]
  stepperDef: ReturnType<typeof defineStepper>
  children: React.ReactNode | ((props: FormStepperRenderProps) => React.ReactNode)
  onComplete: FormStepperProps['onComplete']
  onStepChange?: FormStepperProps['onStepChange']
  className?: string
  defaultValues?: Record<string, unknown>
  id?: string
  formComponent?: React.ElementType
  mode: 'onBlur' | 'onChange' | 'onSubmit'
}

function FormStepperContent({
  steps,
  stepperDef,
  children,
  onComplete,
  onStepChange,
  className,
  defaultValues,
  id,
  formComponent,
  mode,
}: FormStepperContentProps) {
  const { useStepper } = stepperDef
  const stepper = useStepper()

  // Find current step config
  const currentStepConfig = React.useMemo(
    () => steps.find(s => s.id === stepper.current.id) ?? steps[0]!,
    [steps, stepper.current.id],
  )

  // Collect all stored flow data as default values
  const storedValues = React.useMemo(() => {
    const allData = steps.reduce(
      (acc, step) => ({
        ...acc,
        ...((stepper.data.get(step.id as any) || {}) as Record<string, unknown>),
      }),
      {},
    )
    return { ...defaultValues, ...allData }
  }, [steps, stepper, defaultValues, stepper.current.id]) // Include current.id to recompute on step change

  return (
    <StepForm
      key={stepper.current.id} // Force remount on step change
      steps={steps}
      stepper={stepper}
      currentStepConfig={currentStepConfig}
      storedValues={storedValues}
      onComplete={onComplete}
      onStepChange={onStepChange}
      className={className}
      id={id}
      formComponent={formComponent}
      mode={mode}
    >
      {children}
    </StepForm>
  )
}

// ============================================================================
// StepForm - Keyed component that recreates form on step change
// ============================================================================

interface StepFormProps {
  steps: StepConfig[]
  stepper: any
  currentStepConfig: StepConfig
  storedValues: Record<string, unknown>
  children: React.ReactNode | ((props: FormStepperRenderProps) => React.ReactNode)
  onComplete: FormStepperProps['onComplete']
  onStepChange?: FormStepperProps['onStepChange']
  className?: string
  id?: string
  formComponent?: React.ElementType
  mode: 'onBlur' | 'onChange' | 'onSubmit'
}

function StepForm({
  steps,
  stepper,
  currentStepConfig,
  storedValues,
  children,
  onComplete,
  onStepChange,
  className,
  id,
  formComponent: FormComp = 'form',
  mode,
}: StepFormProps) {
  const adapter = useAdapter()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [submitCount, setSubmitCount] = React.useState(0)
  const formRef = React.useRef<HTMLFormElement>(null)

  const currentIndex = stepper.index

  // Submit handler called with validated data from the adapter
  const handleStepSubmit = React.useCallback(
    async (data: Record<string, unknown>) => {
      setIsSubmitted(true)
      setSubmitCount(prev => prev + 1)

      // Store current step's validated data in flow data
      stepper.data.set(data)

      if (stepper.isLast) {
        // Final step - collect all flow data and complete
        setIsSubmitting(true)
        try {
          const allData = steps.reduce(
            (acc, step) => ({
              ...acc,
              ...(stepper.data.get(step.id) || {}),
            }),
            {},
          )
          // Include current submission value to ensure latest data
          const finalData = { ...allData, ...data }
          await onComplete(finalData)
        }
        catch {
          // Error propagates through onComplete — no logging in production
        }
        finally {
          setIsSubmitting(false)
        }
      }
      else {
        // Move to next step
        const nextStepId = steps[currentIndex + 1]?.id
        if (nextStepId) {
          stepper.goTo(nextStepId)
          onStepChange?.(nextStepId, 'next')
        }
      }
    },
    [stepper, steps, currentIndex, onComplete, onStepChange],
  )

  // Create per-step form via adapter (recreated when component remounts on step change)
  const instance = adapter.useCreateForm({
    schema: currentStepConfig.schema,
    defaultValues: storedValues,
    mode,
    id: `${id ?? 'stepper'}-${currentStepConfig.id}`,
    onSubmit: handleStepSubmit,
    formRef,
  })

  // Navigation helpers
  const next = React.useCallback(() => {
    // Trigger form submission which will validate and advance
    formRef.current?.requestSubmit()
  }, [])

  const prev = React.useCallback(() => {
    // Before going back, save current form data to flow data (without validation)
    const currentValues = instance.getValues()
    if (Object.keys(currentValues).length > 0) {
      stepper.data.set(currentValues)
    }

    const prevStepId = steps[currentIndex - 1]?.id
    if (prevStepId) {
      stepper.goTo(prevStepId)
      onStepChange?.(prevStepId, 'prev')
    }
  }, [instance, stepper, steps, currentIndex, onStepChange])

  const goTo = React.useCallback(
    (stepId: string) => {
      const targetIndex = steps.findIndex(s => s.id === stepId)

      // Only allow going back without validation
      if (targetIndex < currentIndex) {
        // Save current data before navigating
        const currentValues = instance.getValues()
        if (Object.keys(currentValues).length > 0) {
          stepper.data.set(currentValues)
        }
        stepper.goTo(stepId)
        onStepChange?.(stepId, 'prev')
      }
      // Going forward requires validation - use next() instead
    },
    [instance, stepper, steps, currentIndex, onStepChange],
  )

  // Helper to get step data from flow data
  const getStepData = React.useCallback(
    (stepId: string) => stepper.data.get(stepId) as Record<string, unknown> | undefined,
    [stepper],
  )

  // Helper to get all step data
  const getAllStepData = React.useCallback(() => {
    return steps.reduce(
      (acc, step) => ({
        ...acc,
        ...(stepper.data.get(step.id) || {}),
      }),
      {},
    )
  }, [steps, stepper])

  // Build context value
  const stepperContextValue: FormStepperContextValue = React.useMemo(
    () => ({
      steps,
      current: currentStepConfig,
      currentIndex,
      next,
      prev,
      goTo,
      isFirst: stepper.isFirst,
      isLast: stepper.isLast,
      getStepData,
      getAllStepData,
      utils: {
        getIndex: (stepId: string) => steps.findIndex(s => s.id === stepId),
      },
    }),
    [steps, currentStepConfig, currentIndex, stepper, next, prev, goTo, getStepData, getAllStepData],
  )

  // Form context value
  const contextValue = React.useMemo(
    () => ({
      form: instance,
      fields: instance.fields,
      isSubmitting,
      isDirty: instance.formState.isDirty,
      isValid: instance.formState.isValid,
      isSubmitted,
      submitCount,
      dirtyFields: instance.formState.dirtyFields,
      touchedFields: instance.formState.touchedFields,
      mode,
      displayTouchedFields: instance.touchedFields,
      markFieldTouched: instance.markFieldTouched,
      markAllFieldsTouched: instance.markAllFieldsTouched,
      submit: () => formRef.current?.requestSubmit(),
      reset: () => instance.reset(),
      formId: instance.id,
    }),
    [instance, isSubmitting, isSubmitted, submitCount, mode, instance.formState],
  )

  // Build render props for children function
  const renderProps: FormStepperRenderProps = {
    steps,
    current: currentStepConfig,
    currentIndex,
    next,
    prev,
    goTo,
    isFirst: stepper.isFirst,
    isLast: stepper.isLast,
    getStepData,
    getAllStepData,
  }

  // Resolve children - support both ReactNode and render function
  const resolvedChildren = typeof children === 'function' ? children(renderProps) : children

  return (
    <FormStepperContext value={stepperContextValue}>
      <FormProvider value={contextValue}>
        <adapter.FormProvider instance={instance}>
          <FormComp
            ref={formRef}
            {...instance.formProps}
            className={cn('space-y-6', className)}
            autoComplete="off"
            noValidate
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              const submitEvent = e.nativeEvent as SubmitEvent
              const submitter = submitEvent.submitter as HTMLButtonElement | null
              e.stopPropagation()

              // Only mark fields as touched for visible submit button clicks (not Conform's hidden validation buttons).
              // Conform uses hidden buttons with name="__intent__" for field validation during initialization;
              // real user submit buttons (Next/Submit in StepperControls) are visible.
              const isUserSubmit = submitter && !submitter.hidden
              if (isUserSubmit) {
                // On submit attempt, mark all fields as display-touched so zod validation errors become visible.
                instance.markAllFieldsTouched()
              }

              const adapterSubmit = instance.formProps.onSubmit as
                | ((e: React.FormEvent<HTMLFormElement>) => void)
                | undefined
              adapterSubmit?.(e)
            }}
          >
            {resolvedChildren}
          </FormComp>
        </adapter.FormProvider>
      </FormProvider>
    </FormStepperContext>
  )
}
