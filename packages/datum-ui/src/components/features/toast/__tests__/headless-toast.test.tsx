/// <reference types="@testing-library/jest-dom/vitest" />
import type { HeadlessToastVariant } from '../headless-toast'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { HeadlessToast } from '../headless-toast'

interface StatusCase {
  variant: HeadlessToastVariant
  surface: string
  text: string
  closeFill: string
  label: string
  icon: string
}

const statusCases: StatusCase[] = [
  {
    variant: 'success',
    surface: 'bg-toast-success-background',
    text: 'text-toast-success-foreground',
    closeFill: 'fill-toast-success-icon',
    label: 'Success',
    icon: 'lucide-circle-check',
  },
  {
    variant: 'error',
    surface: 'bg-toast-error-background',
    text: 'text-toast-error-foreground',
    closeFill: 'fill-toast-error-icon',
    label: 'Error',
    icon: 'lucide-circle-x',
  },
  {
    variant: 'warning',
    surface: 'bg-toast-warning-background',
    text: 'text-toast-warning-foreground',
    closeFill: 'fill-toast-warning-icon',
    label: 'Warning',
    icon: 'lucide-triangle-alert',
  },
  {
    variant: 'info',
    surface: 'bg-toast-info-background',
    text: 'text-toast-info-foreground',
    closeFill: 'fill-toast-info-icon',
    label: 'Info',
    icon: 'lucide-info',
  },
]

function renderToast(variant: HeadlessToastVariant) {
  const { container } = render(<HeadlessToast variant={variant} title="Title" onDismiss={vi.fn()} />)
  const root = container.firstElementChild as HTMLElement
  const closePath = screen.getByRole('button', { name: 'Dismiss notification' }).querySelector('path')
  return { root, closePath }
}

describe('headlessToast', () => {
  it.each(statusCases)('renders its own colours and icon for $variant', ({ variant, surface, text, closeFill, label, icon }) => {
    const { root, closePath } = renderToast(variant)

    expect(root).toHaveAttribute('data-variant', variant)
    expect(root).toHaveClass(surface, text)
    expect(closePath).toHaveClass(closeFill)

    const statusIcon = screen.getByRole('img', { name: label })
    expect(statusIcon).toHaveClass(icon)
  })

  it('gives every status variant a different surface and icon', () => {
    expect(new Set(statusCases.map(c => c.surface)).size).toBe(statusCases.length)
    expect(new Set(statusCases.map(c => c.icon)).size).toBe(statusCases.length)
  })

  it('keeps message on the default surface it had before, with no status icon', () => {
    const { root, closePath } = renderToast('message')

    expect(root).toHaveClass('bg-toast-success-background', 'text-toast-success-foreground')
    expect(closePath).toHaveClass('fill-toast-success-icon')
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})
