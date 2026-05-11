import type { LogoTone } from './logo.styles'
import * as React from 'react'
import { cn } from '../../../utils/cn'
import { logoStyles } from './logo.styles'

export interface LogoIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'role'> {
  /** Colour treatment. Defaults to `brand` (uses the rose mark colour). */
  'tone'?: LogoTone
  /** Mark the logo as decorative (sets `aria-hidden`). */
  'decorative'?: boolean
  /** Accessible name. Defaults to `'Datum'`. Ignored when `decorative`. */
  'aria-label'?: string
}

/**
 * Datum "D" mark — the standalone icon, no wordmark.
 *
 * Always square — drive size with a single class such as `size-8`.
 *
 * @example
 * ```tsx
 * <Logo.Icon className="size-8" />
 * <Logo.Icon tone="mono-light" className="size-8" />
 * <Logo.Icon decorative className="size-6" />  // sibling to brand text
 * ```
 */
export function LogoIcon({
  tone,
  decorative = false,
  className,
  'aria-label': ariaLabel = 'Datum',
  ...props
}: LogoIconProps) {
  const { base, mark } = logoStyles(tone)

  const a11yProps = decorative
    ? { 'aria-hidden': true as const }
    : { 'role': 'img' as const, 'aria-label': ariaLabel }

  return (
    <svg
      viewBox="0 0 149 148"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(base, className)}
      {...a11yProps}
      {...props}
    >
      <path
        className={mark}
        d="M55.7665 0.0945983C53.6493 0.0945983 51.9226 1.80458 51.9226 3.91343C51.9226 6.02228 51.9226 41.2271 51.9226 41.2271C51.9226 43.3306 53.6435 44.9511 55.7665 44.9511L74.0043 45.0459C81.5393 45.0459 88.7162 47.9693 94.2155 53.2713C99.7473 58.6112 102.836 65.6608 102.923 73.131C103.01 80.7848 100.073 87.9906 94.6607 93.4275C89.2482 98.8644 82.0279 101.858 74.3301 101.858H74.0043C66.4858 101.772 59.3901 98.7027 54.0158 93.2064C48.6795 87.7481 45.6522 80.612 45.6522 73.1257V54.7924C45.6522 52.6889 44.0161 51.1811 41.8935 51.1811H4.34839C2.23122 51.1811 0.504883 52.6836 0.504883 54.7924V92.106C0.504883 94.2099 2.22574 96.0376 4.34839 96.0376H33.9838C37.9685 96.0376 40.5362 95.9789 42.6534 96.2647C45.4654 96.6425 47.3494 97.4406 48.7718 98.8483C50.1942 100.256 50.9921 102.133 51.3719 104.927C51.6596 107.036 51.9226 109.582 51.9226 113.546V142.985C51.9226 145.089 53.4348 147.124 55.5577 147.124H74.3355C82.7662 147.124 91.045 145.396 98.9439 142.624C128.384 132.284 148.166 104.485 148.166 73.4494C148.166 42.4137 128.384 14.6144 98.9439 4.27474C91.045 1.50229 82.7662 0.0945983 74.3355 0.0945983H55.7719H55.7665Z"
      />
    </svg>
  )
}

LogoIcon.displayName = 'Logo.Icon'
