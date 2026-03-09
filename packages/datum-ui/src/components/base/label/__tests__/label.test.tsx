/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Label } from '../label'

describe('label', () => {
  it('renders children text', () => {
    render(<Label>Username</Label>)
    expect(screen.getByText('Username')).toBeInTheDocument()
  })

  it('sets htmlFor attribute', () => {
    render(<Label htmlFor="email-input">Email</Label>)
    expect(screen.getByText('Email')).toHaveAttribute('for', 'email-input')
  })

  it('merges custom className', () => {
    render(<Label className="custom-label">Styled</Label>)
    expect(screen.getByText('Styled')).toHaveClass('custom-label')
  })
})
