import type * as React from 'react'
import { cn } from '../../../utils/cn'
import { SpinnerIcon } from '../../icons/spinner.icon'

/**
 * Standalone loading indicator, announced to assistive tech as a status.
 *
 * Built on `SpinnerIcon`. It differs in three ways: it is `size-4` unless a
 * size class is passed, it carries `role="status"`, and its colour comes from
 * `className` (default `text-primary`), so `<Spinner className="text-white" />`
 * recolours the arc and its track together.
 */
function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <SpinnerIcon
      role="status"
      aria-label="Loading"
      size={null}
      indicatorClassName=""
      className={cn('text-primary size-4', className)}
      {...props}
    />
  )
}

export { Spinner }
