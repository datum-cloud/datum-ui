import type { VariantProps } from 'class-variance-authority'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '../../../utils/cn'

const classForSeparator = cva(
  [
    'bg-muted',
    'data-[state=completed]:bg-primary data-[disabled]:opacity-50',
    'transition-all duration-300 ease-in-out',
  ],
  {
    variants: {
      orientation: {
        horizontal: 'h-0.5 flex-1',
        vertical: 'h-full w-0.5',
      },
      labelOrientation: {
        vertical: 'absolute left-[calc(50%+30px)] right-[calc(-50%+20px)] top-5 block shrink-0',
      },
    },
  },
)

export interface CircleStepIndicatorProps {
  currentStep: number
  totalSteps: number
  size?: number
  strokeWidth?: number
}

export function Title({
  children,
  className,
  asChild,
  ...props
}: React.ComponentProps<'h4'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'h4'

  return (
    <Comp
      data-component="stepper-step-title"
      className={cn('text-base font-medium', className)}
      {...props}
    >
      {children}
    </Comp>
  )
}

export function Description({
  children,
  className,
  asChild,
  ...props
}: React.ComponentProps<'p'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'p'

  return (
    <Comp
      data-component="stepper-step-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    >
      {children}
    </Comp>
  )
}

export function StepperSeparator({
  orientation,
  isLast,
  labelOrientation,
  state,
  disabled,
}: {
  isLast: boolean
  state: string
  disabled?: boolean
} & VariantProps<typeof classForSeparator>) {
  if (isLast) {
    return null
  }
  return (
    <div
      data-component="stepper-separator"
      data-orientation={orientation}
      data-state={state}
      data-disabled={disabled}
      role="separator"
      tabIndex={-1}
      className={classForSeparator({ orientation, labelOrientation })}
    />
  )
}

export function CircleStepIndicator({
  currentStep,
  totalSteps,
  size = 80,
  strokeWidth = 6,
}: CircleStepIndicatorProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const fillPercentage = (currentStep / totalSteps) * 100
  const dashOffset = circumference - (circumference * fillPercentage) / 100
  return (
    <div
      data-component="stepper-step-indicator"
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      tabIndex={-1}
      className="relative inline-flex items-center justify-center"
    >
      <svg width={size} height={size}>
        <title>Step Indicator</title>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted-foreground"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="text-primary transition-all duration-300 ease-in-out"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-medium" aria-live="polite">
          {currentStep}
          {' '}
          of
          {' '}
          {totalSteps}
        </span>
      </div>
    </div>
  )
}
