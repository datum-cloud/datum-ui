'use client'

import type { ReactNode } from 'react'

interface ComponentPreviewProps {
  /** Accessible label for the preview area */
  name: string
  /** The live component(s) to render */
  children: ReactNode
  /** Additional CSS class for the preview container */
  className?: string
}

/**
 * Renders live datum-ui components in a bordered preview container.
 * Used in MDX docs to show interactive component examples.
 */
export function ComponentPreview({ name, children, className }: ComponentPreviewProps) {
  return (
    <div
      role="figure"
      aria-label={name}
      className={`not-prose my-6 flex min-h-[120px] items-center justify-center rounded-lg border border-fd-border bg-fd-background p-6 ${className ?? ''}`}
    >
      {children}
    </div>
  )
}
