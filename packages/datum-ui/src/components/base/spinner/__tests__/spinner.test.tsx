/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SpinnerIcon } from '../../../icons/spinner.icon'
import { Spinner } from '../spinner'

describe('spinner', () => {
  it('announces itself as a loading status', () => {
    render(<Spinner />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading')
  })

  it('defaults to size-4 and primary, and lets className override both', () => {
    const { rerender } = render(<Spinner />)
    expect(screen.getByRole('status')).toHaveClass('size-4', 'text-primary')

    rerender(<Spinner className="size-8 text-white" />)
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('size-8', 'text-white')
    expect(spinner).not.toHaveClass('size-4', 'text-primary')
  })

  it('draws a track and a gradient-tailed arc', () => {
    const { container } = render(<SpinnerIcon />)
    const arc = container.querySelector('path')
    const gradient = container.querySelector('linearGradient')

    expect(container.querySelector('circle')).not.toBeNull()
    expect(gradient).not.toBeNull()
    expect(arc).toHaveAttribute('stroke', `url(#${gradient?.id})`)
  })

  it('gives each spinner its own gradient id', () => {
    const { container } = render(
      <>
        <SpinnerIcon />
        <SpinnerIcon />
      </>,
    )
    const ids = [...container.querySelectorAll('linearGradient')].map(g => g.id)
    expect(new Set(ids).size).toBe(2)
  })

  it('uses the track class when one is given', () => {
    const { container } = render(<SpinnerIcon trackClassName="text-border" />)
    const track = container.querySelector('circle')
    expect(track).toHaveClass('text-border')
    expect(track).not.toHaveAttribute('opacity')
  })
})
