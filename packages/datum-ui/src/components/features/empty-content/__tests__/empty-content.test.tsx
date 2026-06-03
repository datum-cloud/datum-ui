/// <reference types="@testing-library/jest-dom/vitest" />
import { fireEvent, render, screen } from '@testing-library/react'
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

  it('merges custom className', () => {
    const { container } = render(
      <EmptyContent title="No data found" className="custom-class" />,
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('renders button and link actions', () => {
    const onClick = vi.fn()
    render(
      <EmptyContent
        title="No data found"
        actions={[
          { as: 'button', label: 'Add Item', onClick },
          { as: 'link', label: 'Learn More', to: '/docs' },
        ]}
      />,
    )
    expect(screen.getByRole('button', { name: 'Add Item' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Learn More' })).toBeInTheDocument()
  })

  it('fires onClick for button actions', () => {
    const onClick = vi.fn()
    render(
      <EmptyContent title="x" actions={[{ as: 'button', label: 'Add', onClick }]} />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('renders external-link with target and rel', () => {
    render(
      <EmptyContent
        title="x"
        actions={[{ as: 'external-link', label: 'Ext', to: 'https://example.com' }]}
      />,
    )
    const link = screen.getByRole('link', { name: 'Ext' })
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders internal link with _self target', () => {
    render(
      <EmptyContent title="x" actions={[{ as: 'link', label: 'In', to: '/in' }]} />,
    )
    const link = screen.getByRole('link', { name: 'In' })
    expect(link).toHaveAttribute('href', '/in')
    expect(link).toHaveAttribute('target', '_self')
  })

  it('does not fire onClick when a button action is disabled', () => {
    const onClick = vi.fn()
    render(
      <EmptyContent
        title="x"
        actions={[{ as: 'button', label: 'Add', onClick, disabled: true }]}
      />,
    )
    const btn = screen.getByRole('button', { name: 'Add' })
    expect(btn).toBeDisabled()
    fireEvent.click(btn)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders a disabled link as a plain disabled button without an anchor', () => {
    render(
      <EmptyContent
        title="x"
        actions={[{ as: 'link', label: 'Go', to: '/x', disabled: true }]}
      />,
    )
    expect(screen.getByRole('button', { name: 'Go' })).toBeDisabled()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('does not leak anchor attributes onto a disabled link button', () => {
    render(
      <EmptyContent
        title="x"
        actions={[{ as: 'link', label: 'Go', to: '/x', disabled: true }]}
      />,
    )
    const btn = screen.getByRole('button', { name: 'Go' })
    expect(btn).not.toHaveAttribute('to')
    expect(btn).not.toHaveAttribute('href')
    expect(btn).not.toHaveAttribute('target')
    expect(btn).not.toHaveAttribute('rel')
  })

  it('does not render hidden actions', () => {
    render(
      <EmptyContent
        title="x"
        actions={[
          { as: 'button', label: 'Visible' },
          { as: 'button', label: 'Secret', hidden: true },
        ]}
      />,
    )
    expect(screen.getByText('Visible')).toBeInTheDocument()
    expect(screen.queryByText('Secret')).not.toBeInTheDocument()
  })

  it('does not render the actions container when every action is hidden', () => {
    render(
      <EmptyContent
        title="x"
        actions={[{ as: 'button', label: 'Secret', hidden: true }]}
      />,
    )
    expect(screen.queryByText('Secret')).not.toBeInTheDocument()
  })

  it('wraps the control in a hover target span so a disabled action can still show its tooltip', () => {
    render(
      <EmptyContent
        title="x"
        actions={[
          { as: 'button', label: 'Locked', disabled: true, tooltip: 'No permission' },
        ]}
      />,
    )
    const btn = screen.getByRole('button', { name: 'Locked' })
    // renderAction wraps the control in <span class="inline-flex"> before handing it
    // to <Tooltip>, so the disabled button still has an element that receives hover.
    expect(btn.closest('span.inline-flex')).not.toBeNull()
  })

  it('forwards Button props (icon and semantic type) to the underlying button', () => {
    render(
      <EmptyContent
        title="x"
        actions={[
          { as: 'button', label: 'Delete', type: 'danger', icon: <svg data-testid="trash-icon" /> },
        ]}
      />,
    )
    expect(screen.getByTestId('trash-icon')).toBeInTheDocument()
    // type='danger' + default theme='solid' compiles to the danger solid class.
    expect(screen.getByRole('button', { name: 'Delete' }).className).toContain('bg-btn-danger')
  })
})
