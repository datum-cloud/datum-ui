/// <reference types="@testing-library/jest-dom/vitest" />
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '../../../../../test/utils'
import { Tooltip } from '../tooltip'

describe('tooltip', () => {
  it('renders the trigger element', () => {
    renderWithProviders(
      <Tooltip message="Tip text">
        <button type="button">Hover me</button>
      </Tooltip>,
    )
    expect(screen.getByRole('button', { name: 'Hover me' })).toBeInTheDocument()
  })

  it('shows tooltip on hover', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <Tooltip message="Tip text" delayDuration={0}>
        <button type="button">Hover me</button>
      </Tooltip>,
    )
    await user.hover(screen.getByRole('button', { name: 'Hover me' }))
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument()
    })
  })

  it('renders in controlled open state', () => {
    renderWithProviders(
      <Tooltip message="Always visible" open>
        <button type="button">Trigger</button>
      </Tooltip>,
    )
    expect(screen.getByRole('tooltip')).toHaveTextContent('Always visible')
  })

  it('trigger is visible when hidden=true', () => {
    renderWithProviders(
      <Tooltip message="Hidden tooltip" hidden open>
        <button type="button">Trigger</button>
      </Tooltip>,
    )
    expect(screen.getByRole('button', { name: 'Trigger' })).toBeInTheDocument()
  })
})
