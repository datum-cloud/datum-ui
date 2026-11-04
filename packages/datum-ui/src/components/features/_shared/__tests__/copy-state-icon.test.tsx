/// <reference types="@testing-library/jest-dom/vitest" />
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CopyStateIcon } from '../copy-state-icon'

describe('copyStateIcon', () => {
  it('renders both glyphs stacked and reports the copied state', () => {
    const { container, rerender } = render(<CopyStateIcon copied={false} />)
    const root = container.querySelector('[data-slot="copy-state-icon"]')

    expect(root).toHaveAttribute('data-copied', 'false')
    expect(root?.querySelectorAll('svg')).toHaveLength(2)

    rerender(<CopyStateIcon copied />)
    expect(root).toHaveAttribute('data-copied', 'true')
  })

  it('is decorative', () => {
    const { container } = render(<CopyStateIcon copied={false} />)
    expect(container.querySelector('[data-slot="copy-state-icon"]')).toHaveAttribute('aria-hidden')
  })

  it('passes icon props through to both glyphs', () => {
    const { container } = render(<CopyStateIcon copied={false} className="size-3" />)
    for (const svg of container.querySelectorAll('svg'))
      expect(svg).toHaveClass('size-3')
  })
})
