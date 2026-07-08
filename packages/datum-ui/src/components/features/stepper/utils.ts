import type * as Stepperize from '@stepperize/react'
import * as React from 'react'
import { Description, Title } from './parts'

export function scrollIntoStepperPanel(node: HTMLDivElement | null, tracking?: boolean) {
  if (tracking) {
    node?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

export function useStepChildren(children: React.ReactNode) {
  return React.useMemo(() => extractChildren(children), [children])
}

export function extractChildren(children: React.ReactNode) {
  const childrenArray = React.Children.toArray(children)
  const map = new Map<string, React.ReactNode>()

  for (const child of childrenArray) {
    if (React.isValidElement(child)) {
      if (child.type === Title) {
        map.set('title', child)
      }
      else if (child.type === Description) {
        map.set('description', child)
      }
      else {
        map.set('panel', child)
      }
    }
  }

  return map
}

export function onStepKeyDown(
  e: React.KeyboardEvent<HTMLButtonElement>,
  nextStep: Stepperize.Step | undefined,
  prevStep: Stepperize.Step | undefined,
  instanceId: string,
) {
  const { key } = e
  const directions = {
    next: ['ArrowRight', 'ArrowDown'],
    prev: ['ArrowLeft', 'ArrowUp'],
  }

  if (directions.next.includes(key) || directions.prev.includes(key)) {
    const direction = directions.next.includes(key) ? 'next' : 'prev'
    const step = direction === 'next' ? nextStep : prevStep

    if (!step) {
      return
    }

    const stepElement = document.getElementById(stepDomId(instanceId, step.id))
    if (!stepElement) {
      return
    }

    const isActive = stepElement.parentElement?.getAttribute('data-state') !== 'inactive'
    if (isActive || direction === 'prev') {
      stepElement.focus()
    }
  }
}

export function stepDomId(instanceId: string, stepId: string) {
  return `${instanceId}step-${stepId}`
}

export function getStepState(currentIndex: number, stepIndex: number) {
  if (currentIndex === stepIndex) {
    return 'active'
  }
  if (currentIndex > stepIndex) {
    return 'completed'
  }
  return 'inactive'
}
