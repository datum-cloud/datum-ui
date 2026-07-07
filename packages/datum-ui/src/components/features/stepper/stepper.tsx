import { Slot } from '@radix-ui/react-slot'
import { Button } from '@repo/shadcn/ui/button'
import * as Stepperize from '@stepperize/react'
import { cva } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '../../../utils/cn'
import {
  CircleStepIndicator,
  Description,
  StepperSeparator,
  Title,
} from './parts'
import {
  getStepState,
  onStepKeyDown,
  scrollIntoStepperPanel,
  stepDomId,
  useStepChildren,
} from './utils'

type StepperContextValue = Stepper.ConfigProps & { instanceId: string }

const StepperContext = React.createContext<StepperContextValue | null>(null)

function useStepperProvider(): StepperContextValue {
  const context = React.use(StepperContext)
  if (!context) {
    throw new Error('useStepper must be used within a StepperProvider.')
  }
  return context
}

const classForNavigationList = cva('flex gap-2', {
  variants: {
    variant: {
      horizontal: 'flex-row items-center justify-between',
      vertical: 'flex-col',
      circle: 'flex-row items-center justify-between',
    },
  },
})

function defineStepper<const Steps extends Stepperize.Step[]>(...steps: Steps): Stepper.DefineProps<Steps> {
  const {
    Provider: StepperizeProvider,
    useStepper,
    steps: stepList,
    Stepper: StepperizePrimitives,
  } = Stepperize.defineStepper(steps)

  const StepperContainer = ({
    children,
    className,
    ...props
  }: Omit<React.ComponentProps<'div'>, 'children'> & {
    children:
      | React.ReactNode
      | ((props: { methods: Stepperize.Stepper<Steps> }) => React.ReactNode)
  }) => {
    const methods = useStepper()

    return (
      <div data-component="stepper" className={cn('w-full', className)} {...props}>
        {typeof children === 'function' ? children({ methods }) : children}
      </div>
    )
  }

  return {
    steps: stepList,
    useStepper,
    Stepper: {
      ...StepperizePrimitives,
      Provider: ({
        variant = 'horizontal',
        labelOrientation = 'horizontal',
        tracking = false,
        defaultStep,
        defaultData,
        children,
        className,
        ...props
      }) => {
        const instanceId = React.useId()
        return (
          <StepperContext value={{ variant, labelOrientation, tracking, instanceId }}>
            <StepperizeProvider defaultStep={defaultStep} defaultData={defaultData}>
              <StepperContainer className={className} {...props}>
                {children}
              </StepperContainer>
            </StepperizeProvider>
          </StepperContext>
        )
      },
      Navigation: ({ children, 'aria-label': ariaLabel = 'Stepper Navigation', ...props }) => {
        const { variant } = useStepperProvider()
        return (
          <nav data-component="stepper-navigation" aria-label={ariaLabel} role="tablist" {...props}>
            <ol
              data-component="stepper-navigation-list"
              className={classForNavigationList({ variant })}
            >
              {children}
            </ol>
          </nav>
        )
      },
      Step: ({ children, className, icon, of, variant: stepVariant, ...props }) => {
        const { variant, labelOrientation, instanceId } = useStepperProvider()
        const stepper = useStepper()

        const steps = stepList

        const stepIndex = steps.findIndex(s => s.id === of)
        const step = steps[stepIndex]!
        const currentIndex = stepper.index

        const isLast = stepIndex === steps.length - 1
        const isActive = stepper.current.id === of

        const dataState = getStepState(currentIndex, stepIndex)
        const childMap = useStepChildren(children)

        const title = childMap.get('title')
        const description = childMap.get('description')
        const panel = childMap.get('panel')

        if (variant === 'circle') {
          return (
            <li
              data-component="stepper-step"
              data-state={dataState}
              data-disabled={props.disabled}
              className={cn(
                'flex shrink-0 items-center gap-4 rounded-md transition-colors',
                className,
              )}
            >
              <button
                id={stepDomId(instanceId, step.id)}
                type="button"
                aria-current={isActive ? 'step' : undefined}
                aria-selected={isActive}
                className={cn(
                  'rounded-full',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  props.onClick ? 'cursor-pointer' : undefined,
                )}
                {...props}
              >
                <CircleStepIndicator currentStep={stepIndex + 1} totalSteps={steps.length} />
              </button>
              <div
                data-component="stepper-step-content"
                className="flex flex-col items-start gap-1"
              >
                {title}
                {description}
              </div>
            </li>
          )
        }

        return (
          <>
            <li
              data-component="stepper-step"
              className={cn([
                'group peer relative flex items-center gap-2',
                'data-[variant=vertical]:flex-row',
                'data-[label-orientation=vertical]:w-full',
                'data-[label-orientation=vertical]:flex-col',
                'data-[label-orientation=vertical]:justify-center',
              ])}
              data-variant={variant}
              data-label-orientation={labelOrientation}
              data-state={dataState}
              data-disabled={props.disabled}
            >
              <Button
                id={stepDomId(instanceId, step.id)}
                data-component="stepper-step-indicator"
                type="button"
                role="tab"
                tabIndex={dataState !== 'inactive' ? 0 : -1}
                className={cn('rounded-full', className)}
                variant={stepVariant ?? (dataState !== 'inactive' ? 'default' : 'secondary')}
                size="icon"
                aria-controls={`step-panel-${of}`}
                aria-current={isActive ? 'step' : undefined}
                aria-posinset={stepIndex + 1}
                aria-setsize={steps.length}
                aria-selected={isActive}
                onKeyDown={e =>
                  onStepKeyDown(
                    e,
                    steps[stepIndex + 1],
                    steps[stepIndex - 1],
                    instanceId,
                  )}
                {...props}
              >
                {icon ?? stepIndex + 1}
              </Button>
              {variant === 'horizontal' && labelOrientation === 'vertical' && (
                <StepperSeparator
                  orientation="horizontal"
                  labelOrientation={labelOrientation}
                  isLast={isLast}
                  state={dataState}
                  disabled={props.disabled}
                />
              )}
              <div data-component="stepper-step-content" className="flex flex-col items-start">
                {title}
                {description}
              </div>
            </li>

            {variant === 'horizontal' && labelOrientation === 'horizontal' && (
              <StepperSeparator
                orientation="horizontal"
                isLast={isLast}
                state={dataState}
                disabled={props.disabled}
              />
            )}

            {variant === 'vertical' && (
              <div className="flex gap-4">
                {!isLast && (
                  <div className="flex justify-center ps-[calc(var(--spacing)_*_4.5_-_1px)]">
                    <StepperSeparator
                      orientation="vertical"
                      isLast={isLast}
                      state={dataState}
                      disabled={props.disabled}
                    />
                  </div>
                )}
                <div className="my-3 flex-1 ps-4">{panel}</div>
              </div>
            )}
          </>
        )
      },
      Title,
      Description,
      Panel: ({ children, asChild, ...props }) => {
        const Comp = asChild ? Slot : 'div'
        const { tracking } = useStepperProvider()

        return (
          <Comp
            data-component="stepper-step-panel"
            ref={node => scrollIntoStepperPanel(node, tracking)}
            {...props}
          >
            {children}
          </Comp>
        )
      },
      Controls: ({ children, className, asChild, ...props }) => {
        const Comp = asChild ? Slot : 'div'
        return (
          <Comp
            data-component="stepper-controls"
            className={cn('flex justify-end gap-4', className)}
            {...props}
          >
            {children}
          </Comp>
        )
      },
    },
  }
}

// eslint-disable-next-line ts/no-namespace
namespace Stepper {
  export type StepperVariant = 'horizontal' | 'vertical' | 'circle'
  export type StepperLabelOrientation = 'horizontal' | 'vertical'

  export interface ConfigProps {
    variant?: StepperVariant
    labelOrientation?: StepperLabelOrientation
    tracking?: boolean
  }

  export interface DefineProps<Steps extends Stepperize.Step[]> {
    steps: Steps
    useStepper: (options?: Stepperize.UseStepperOptions<Steps>) => Stepperize.Stepper<Steps>
    Stepper: {
      Provider: (
        props: Omit<Stepperize.ProviderProps<Steps>, 'children'>
          & Omit<React.ComponentProps<'div'>, 'children'>
          & Stepper.ConfigProps & {
            children:
              | React.ReactNode
              | ((props: { methods: Stepperize.Stepper<Steps> }) => React.ReactNode)
          },
      ) => React.ReactElement
      Navigation: (props: React.ComponentProps<'nav'>) => React.ReactElement
      Step: (
        props: React.ComponentProps<'button'> & {
          of: Stepperize.Get.Id<Steps>
          icon?: React.ReactNode
          variant?: 'default' | 'secondary'
        },
      ) => React.ReactElement
      Title: (props: AsChildProps<'h4'>) => React.ReactElement
      Description: (props: AsChildProps<'p'>) => React.ReactElement
      Panel: (props: AsChildProps<'div'>) => React.ReactElement
      Controls: (props: AsChildProps<'div'>) => React.ReactElement
    }
  }
}

type AsChildProps<T extends React.ElementType> = React.ComponentProps<T> & {
  asChild?: boolean
}

export { defineStepper }
