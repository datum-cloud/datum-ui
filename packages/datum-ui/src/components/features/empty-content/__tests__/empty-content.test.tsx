/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { EmptyContent } from '../empty-content'

describe('emptyContent', () => {
  it('renders title with default greeting', () => {
    render(<EmptyContent title="No data found" />)
    expect(screen.getByText('Hey there, No data found')).toBeInTheDocument()
  })

  it('uses custom userName in greeting', () => {
    render(<EmptyContent title="No data found" userName="John" />)
    expect(screen.getByText('Hey John, No data found')).toBeInTheDocument()
  })

  it('renders subtitle', () => {
    render(<EmptyContent title="No data found" subtitle="Try adjusting your filters" />)
    expect(screen.getByText('Try adjusting your filters')).toBeInTheDocument()
  })

  it('renders action buttons', () => {
    const handleClick = vi.fn()
    render(
      <EmptyContent
        title="No data found"
        actions={[
          { type: 'button', label: 'Add Item', onClick: handleClick },
          { type: 'link', label: 'Learn More', to: '/docs' },
        ]}
      />,
    )
    expect(screen.getByText('Add Item')).toBeInTheDocument()
    expect(screen.getByText('Learn More')).toBeInTheDocument()
  })

  it('merges custom className', () => {
    const { container } = render(
      <EmptyContent title="No data found" className="custom-class" />,
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
