/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LoaderOverlay } from '../loader-overlay'

describe('loaderOverlay', () => {
  it('renders without message', () => {
    const { container } = render(<LoaderOverlay />)
    // Should render the overlay container with the spinner
    expect(container.firstChild).toBeInTheDocument()
    // Should have an SVG spinner
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders with message text', () => {
    render(<LoaderOverlay message="Loading data..." />)
    expect(screen.getByText('Loading data...')).toBeInTheDocument()
  })

  it('merges className', () => {
    const { container } = render(<LoaderOverlay className="custom-overlay" />)
    expect(container.firstChild).toHaveClass('custom-overlay')
  })
})
