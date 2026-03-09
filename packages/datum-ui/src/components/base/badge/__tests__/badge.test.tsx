/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Badge } from '../badge'

describe('badge', () => {
  it('renders children text', () => {
    render(<Badge>Hello</Badge>)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('applies default variants (muted + solid)', () => {
    render(<Badge>Default</Badge>)
    const badge = screen.getByText('Default')
    // muted + solid compound variant includes border-transparent
    expect(badge.className).toContain('border-transparent')
  })

  it('renders with type and theme variants', () => {
    render(
      <Badge type="primary" theme="outline">
        Primary Outline
      </Badge>,
    )
    const badge = screen.getByText('Primary Outline')
    expect(badge).toBeInTheDocument()
    // outline variant adds 'border' class
    expect(badge.className).toContain('border')
  })

  it('merges custom className', () => {
    render(<Badge className="custom-class">Styled</Badge>)
    const badge = screen.getByText('Styled')
    expect(badge).toHaveClass('custom-class')
  })

  it('forwards HTML attributes', () => {
    render(<Badge data-testid="my-badge">Attributed</Badge>)
    expect(screen.getByTestId('my-badge')).toBeInTheDocument()
  })

  describe('type variants', () => {
    const types = [
      'primary',
      'secondary',
      'tertiary',
      'quaternary',
      'info',
      'warning',
      'danger',
      'success',
      'muted',
    ] as const

    it.each(types)('renders type=%s without error', (type) => {
      render(<Badge type={type}>{type}</Badge>)
      expect(screen.getByText(type)).toBeInTheDocument()
    })
  })

  describe('theme variants', () => {
    const themes = ['solid', 'outline', 'light'] as const

    it.each(themes)('renders theme=%s without error', (theme) => {
      render(<Badge theme={theme}>{theme}</Badge>)
      expect(screen.getByText(theme)).toBeInTheDocument()
    })
  })
})
