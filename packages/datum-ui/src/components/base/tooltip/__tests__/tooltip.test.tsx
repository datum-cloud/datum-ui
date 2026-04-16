/// <reference types="@testing-library/jest-dom/vitest" />
import { act, fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
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

describe('tooltip — mobile long-press', () => {
  afterEach(() => vi.useRealTimers())

  it('shows TouchTooltipBubble after long press', () => {
    vi.useFakeTimers()
    renderWithProviders(
      <Tooltip message="Long press hint">
        <button type="button">Target</button>
      </Tooltip>,
    )

    const wrapper = screen.getByRole('button', { name: 'Target' }).parentElement!
    fireEvent.touchStart(wrapper)
    act(() => {
      vi.advanceTimersByTime(600)
    })

    expect(screen.getByRole('tooltip')).toHaveTextContent('Long press hint')
  })

  it('auto-dismisses long-press bubble after 1.5s', () => {
    vi.useFakeTimers()
    renderWithProviders(
      <Tooltip message="Hint">
        <button type="button">Target</button>
      </Tooltip>,
    )
    const wrapper = screen.getByRole('button', { name: 'Target' }).parentElement!
    fireEvent.touchStart(wrapper)
    act(() => {
      vi.advanceTimersByTime(600)
    })
    expect(screen.getByRole('tooltip')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1600)
    })
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })
})
