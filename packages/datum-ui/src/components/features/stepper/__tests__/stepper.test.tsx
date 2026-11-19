/// <reference types="@testing-library/jest-dom/vitest" />
import type * as Stepperize from '@stepperize/react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { defineStepper } from '../index'
import { getStepState, onStepKeyDown, stepDomId } from '../utils'

const { Stepper, steps } = defineStepper(
  { id: 'account', title: 'Account' },
  { id: 'billing', title: 'Billing' },
  { id: 'review', title: 'Review' },
)

function renderStepper({ disabledStep }: { disabledStep?: string } = {}) {
  return render(
    <Stepper.Provider>
      {({ methods }) => (
        <>
          <Stepper.Navigation>
            {steps.map(step => (
              <Stepper.Step key={step.id} of={step.id} disabled={step.id === disabledStep} onClick={() => methods.goTo(step.id)}>
                <Stepper.Title>{step.title}</Stepper.Title>
              </Stepper.Step>
            ))}
          </Stepper.Navigation>
          <output data-testid="current">{methods.current.id}</output>
          <Stepper.Controls>
            <button type="button" onClick={() => methods.prev()}>Back</button>
            <button type="button" onClick={() => methods.next()}>Next</button>
          </Stepper.Controls>
        </>
      )}
    </Stepper.Provider>,
  )
}

const current = () => screen.getByTestId('current').textContent

describe('stepper', () => {
  it('starts on the first step and moves next and back', async () => {
    renderStepper()
    expect(current()).toBe('account')
    await userEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(current()).toBe('billing')
    await userEvent.click(screen.getByRole('button', { name: 'Back' }))
    expect(current()).toBe('account')
  })

  it('does not move before the first step or past the last', async () => {
    renderStepper()
    await userEvent.click(screen.getByRole('button', { name: 'Back' }))
    expect(current()).toBe('account')
    await userEvent.click(screen.getByRole('button', { name: 'Next' }))
    await userEvent.click(screen.getByRole('button', { name: 'Next' }))
    await userEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(current()).toBe('review')
  })

  it('marks the current step and the completed ones', async () => {
    renderStepper()
    await userEvent.click(screen.getByRole('button', { name: 'Next' }))
    // Each step is an <li data-state> holding its tab button and its title.
    const stepItem = (title: string) => screen.getByText(title).closest('li')!
    const stateOf = (title: string) => stepItem(title).getAttribute('data-state')
    expect(stepItem('Billing').querySelector('[role="tab"]')).toHaveAttribute('aria-current', 'step')
    expect(stateOf('Account')).toBe('completed')
    expect(stateOf('Billing')).toBe('active')
    expect(stateOf('Review')).toBe('inactive')
  })

  it('does not reach a disabled step by clicking it', async () => {
    renderStepper({ disabledStep: 'review' })
    const reviewTab = screen.getByText('Review').closest('li')!.querySelector('[role="tab"]')!
    expect(reviewTab).toBeDisabled()
    await userEvent.click(reviewTab)
    expect(current()).toBe('account')
    // An enabled step is reachable the same way, so the check above is meaningful.
    await userEvent.click(screen.getByText('Billing').closest('li')!.querySelector('[role="tab"]')!)
    expect(current()).toBe('billing')
  })
})

describe('stepper helpers', () => {
  it('derives each step\'s state from the current index', () => {
    expect(getStepState(1, 0)).toBe('completed')
    expect(getStepState(1, 1)).toBe('active')
    expect(getStepState(1, 2)).toBe('inactive')
  })

  it('builds a stable DOM id per instance and step', () => {
    expect(stepDomId('s1-', 'billing')).toBe(stepDomId('s1-', 'billing'))
    expect(stepDomId('s1-', 'billing')).not.toBe(stepDomId('s2-', 'billing'))
  })

  it('moves focus with the arrow keys, and only forward to a reachable step', () => {
    const make = (id: string, state: string) => {
      const wrapper = document.createElement('div')
      wrapper.setAttribute('data-state', state)
      const button = document.createElement('button')
      button.id = stepDomId('t-', id)
      wrapper.append(button)
      document.body.append(wrapper)
      return button
    }
    const prev = make('a', 'completed')
    const next = make('c', 'inactive')
    const key = (k: string) => ({ key: k }) as React.KeyboardEvent<HTMLButtonElement>
    const step = (id: string) => ({ id }) as Stepperize.Step
    onStepKeyDown(key('ArrowRight'), step('c'), step('a'), 't-')
    expect(document.activeElement).not.toBe(next)
    onStepKeyDown(key('ArrowLeft'), step('c'), step('a'), 't-')
    expect(document.activeElement).toBe(prev)
    next.parentElement!.setAttribute('data-state', 'active')
    onStepKeyDown(key('ArrowDown'), step('c'), step('a'), 't-')
    expect(document.activeElement).toBe(next)
  })
})
