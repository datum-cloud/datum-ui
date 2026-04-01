import type * as Stepperize from '@stepperize/react'
import type { FormStepperProps, FormStepperRenderProps, StepConfig } from '../../types'
import * as React from 'react'
import { z } from 'zod'
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

// ============================================================================
// Schema Utilities
// ============================================================================

/**
 * Recursively unwrap ZodIntersection (from .and()) to extract the base ZodObject.
 *
 * Zod v4 schema types use `def.type` as a string discriminant:
 * - "intersection" (from .and()): merge left + right base objects
 * - "object": return directly
 *
 * Note: In Zod v4, .superRefine() and .refine() return `this` (no wrapper),
 * so only ZodIntersection needs unwrapping.
 */
function getBaseObject(schema: z.ZodType): z.ZodObject<any> {
  if (schema.def.type === 'intersection') {
    // Zod v4's `def` is typed as an opaque union; cast to access `left`/`right` branches.
    const intersectionDef = schema.def as unknown as { left: z.ZodType, right: z.ZodType }
    const left = getBaseObject(intersectionDef.left)
    const right = getBaseObject(intersectionDef.right)
    return left.merge(right)
  }

  if (schema.def.type !== 'object') {
    return z.object({})
  }

  return schema as z.ZodObject<any>
}

/**
 * Merge multiple zod schemas into one ZodObject for HTML constraint generation.
 * Handles ZodIntersection (.and()) by unwrapping to base ZodObject shapes.
 * Per-step validation still uses the original schemas with all refinements intact.
 */
function mergeSchemas(steps: StepConfig[]): z.ZodObject<any> {
  if (steps.length === 0) {
    throw new Error('Form.Stepper requires at least one step')
  }

  return steps.reduce((acc, step, index) => {
    const base = getBaseObject(step.schema)

    if (index === 0) {
      return base
    }

    return acc.merge(base)
  }, {} as z.ZodObject<any>)
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
}: FormStepperProps & {
  defaultValues?: Record<string, unknown>
  id?: string
  formComponent?: React.ElementType
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

  // Note: initialStep is handled by Stepperize's Scoped component internally
  const providerProps = initialStepIndex ? { initialStep: initialStepIndex as any } : {}

  return (
    // eslint-disable-next-line react/no-context-provider -- Stepperize's Stepper is not a React Context; .Provider is required
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
}: FormStepperContentProps) {
  const { useStepper } = stepperDef
  const stepper = useStepper()

  // Find current step config
  const currentStepConfig = React.useMemo(
    () => steps.find(s => s.id === stepper.state.current.data.id) ?? steps[0]!,
    [steps, stepper.state.current.data.id],
  )

  // Merge all schemas into one combined schema
  const combinedSchema = React.useMemo(() => mergeSchemas(steps), [steps])

  // Collect all stored metadata as default values
  const storedValues = React.useMemo(() => {
    const allMetadata = steps.reduce(
      (acc, step) => ({
        ...acc,
        ...(stepper.metadata.get(step.id as any) || {}),
      }),
      {},
    )
    return { ...defaultValues, ...allMetadata }
  }, [steps, stepper, defaultValues, stepper.state.current.data.id]) // Include current.id to recompute on step change

  return (
    <StepForm
      key={stepper.state.current.data.id} // Force remount on step change
      steps={steps}
      stepper={stepper}
      currentStepConfig={currentStepConfig}
      combinedSchema={combinedSchema}
      storedValues={storedValues}
      onComplete={onComplete}
      onStepChange={onStepChange}
      className={className}
      id={id}
      formComponent={formComponent}
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
  combinedSchema: z.ZodObject<any>
  storedValues: Record<string, unknown>
  children: React.ReactNode | ((props: FormStepperRenderProps) => React.ReactNode)
  onComplete: FormStepperProps['onComplete']
  onStepChange?: FormStepperProps['onStepChange']
  className?: string
  id?: string
  formComponent?: React.ElementType
}

function StepForm({
  steps,
  stepper,
  currentStepConfig,
  combinedSchema: _combinedSchema,
  storedValues,
  children,
  onComplete,
  onStepChange,
  className,
  id,
  formComponent: FormComp = 'form',
}: StepFormProps) {
  const adapter = useAdapter()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const formRef = React.useRef<HTMLFormElement>(null)

  const currentIndex = stepper.lookup.getIndex(stepper.state.current.data.id as any)

  // Submit handler called with validated data from the adapter
  const handleStepSubmit = React.useCallback(
    async (data: Record<string, unknown>) => {
      // Store current step's validated data in metadata
      stepper.metadata.set(stepper.state.current.data.id as any, data)

      if (stepper.state.isLast) {
        // Final step - collect all metadata and complete
        setIsSubmitting(true)
        try {
          const allData = steps.reduce(
            (acc, step) => ({
              ...acc,
              ...(stepper.metadata.get(step.id as any) || {}),
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
        const nextStepId = stepper.lookup.getNext(stepper.state.current.data.id as any)?.id
        if (nextStepId) {
          stepper.navigation.goTo(nextStepId as any)
          onStepChange?.(nextStepId, 'next')
        }
      }
    },
    [stepper, steps, onComplete, onStepChange],
  )

  // Create per-step form via adapter (recreated when component remounts on step change)
  const instance = adapter.useCreateForm({
    schema: currentStepConfig.schema,
    defaultValues: storedValues,
    mode: 'onSubmit',
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
    // Before going back, save current form data to metadata (without validation)
    const currentValues = instance.getValues()
    if (Object.keys(currentValues).length > 0) {
      stepper.metadata.set(stepper.state.current.data.id as any, currentValues)
    }

    const prevStepId = stepper.lookup.getPrev(stepper.state.current.data.id as any)?.id
    if (prevStepId) {
      stepper.navigation.goTo(prevStepId as any)
      onStepChange?.(prevStepId, 'prev')
    }
  }, [instance, stepper, onStepChange])

  const goTo = React.useCallback(
    (stepId: string) => {
      const targetIndex = stepper.lookup.getIndex(stepId as any)

      // Only allow going back without validation
      if (targetIndex < currentIndex) {
        // Save current data before navigating
        const currentValues = instance.getValues()
        if (Object.keys(currentValues).length > 0) {
          stepper.metadata.set(stepper.state.current.data.id as any, currentValues)
        }
        stepper.navigation.goTo(stepId as any)
        onStepChange?.(stepId, 'prev')
      }
      // Going forward requires validation - use next() instead
    },
    [instance, stepper, currentIndex, onStepChange],
  )

  // Helper to get step data from metadata
  const getStepData = React.useCallback(
    (stepId: string) => stepper.metadata.get(stepId as any) as Record<string, unknown> | undefined,
    [stepper],
  )

  // Helper to get all step data
  const getAllStepData = React.useCallback(() => {
    return steps.reduce(
      (acc, step) => ({
        ...acc,
        ...(stepper.metadata.get(step.id as any) || {}),
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
      isFirst: stepper.state.isFirst,
      isLast: stepper.state.isLast,
      getStepData,
      getAllStepData,
      utils: {
        getIndex: (stepId: string) => stepper.lookup.getIndex(stepId as any),
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
      isSubmitted: instance.formState.isSubmitted,
      submitCount: instance.formState.submitCount,
      dirtyFields: instance.formState.dirtyFields,
      touchedFields: instance.formState.touchedFields,
      submit: () => formRef.current?.requestSubmit(),
      reset: () => instance.reset(),
      formId: instance.id,
    }),
    [instance, isSubmitting, instance.formState],
  )

  // Build render props for children function
  const renderProps: FormStepperRenderProps = {
    steps,
    current: currentStepConfig,
    currentIndex,
    next,
    prev,
    goTo,
    isFirst: stepper.state.isFirst,
    isLast: stepper.state.isLast,
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
              e.stopPropagation()
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
