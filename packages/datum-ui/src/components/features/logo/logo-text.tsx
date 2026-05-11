import type { LogoTone } from './logo.styles'
import * as React from 'react'
import { cn } from '../../../utils/cn'
import { logoStyles } from './logo.styles'

export interface LogoTextProps extends Omit<React.SVGProps<SVGSVGElement>, 'role'> {
  /** Colour treatment. Defaults to `brand` (uses the navy text colour). */
  'tone'?: LogoTone
  /** Mark the logo as decorative (sets `aria-hidden`). */
  'decorative'?: boolean
  /** Accessible name. Defaults to `'Datum'`. Ignored when `decorative`. */
  'aria-label'?: string
}

/**
 * "Datum" wordmark only — no D mark.
 *
 * The viewBox is cropped to the wordmark glyphs only, so the component
 * sits flush without leading whitespace where the D mark would otherwise be.
 *
 * @example
 * ```tsx
 * <Logo.Text className="h-6 w-auto" />
 * <Logo.Text tone="mono-light" className="h-6 w-auto" />
 * ```
 */
export function LogoText({
  tone,
  decorative = false,
  className,
  'aria-label': ariaLabel = 'Datum',
  ...props
}: LogoTextProps) {
  const { base, text } = logoStyles(tone)

  const a11yProps = decorative
    ? { 'aria-hidden': true as const }
    : { 'role': 'img' as const, 'aria-label': ariaLabel }

  return (
    <svg
      viewBox="247 38 495 76"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(base, className)}
      {...a11yProps}
      {...props}
    >
      <path
        className={text}
        d="M658.436 52.5669H658.235L653.607 111.455H640.929L645.556 38.6199H664.774L691.353 94.9235L718.334 38.6199H737.149L741.777 111.455H729.102L724.474 52.5669H724.273L697.09 111.455H685.719L658.436 52.5669Z"
      />
      <path
        className={text}
        d="M618.454 80.1951C618.454 86.0727 617.548 91.1154 615.738 95.3231C613.927 99.4642 611.344 102.871 607.992 105.542C604.636 108.214 600.544 110.184 595.715 111.453C590.955 112.655 585.587 113.256 579.616 113.256C573.649 113.256 568.249 112.655 563.417 111.453C558.656 110.184 554.596 108.214 551.244 105.542C547.889 102.871 545.306 99.4642 543.495 95.3231C541.684 91.1154 540.779 86.0727 540.779 80.1951V38.618H555.067V79.1935C555.067 82.1988 555.401 85.0375 556.073 87.709C556.745 90.3141 557.984 92.6182 559.795 94.6219C561.606 96.6256 564.088 98.1953 567.243 99.3308C570.462 100.466 574.586 101.034 579.616 101.034C584.65 101.034 588.738 100.466 591.893 99.3308C595.112 98.1953 597.627 96.6256 599.437 94.6219C601.248 92.6182 602.491 90.3141 603.163 87.709C603.831 85.0375 604.169 82.1988 604.169 79.1935V38.618H618.454V80.1951Z"
      />
      <path
        className={text}
        d="M471.618 50.8426H438.917V38.6199H518.603V50.8426H485.902V111.455H471.618V50.8426Z"
      />
      <path
        className={text}
        d="M404.645 82.5012L389.354 50.0413L374.06 82.5012H404.645ZM381.202 38.6199H397.503L433.02 111.455H417.927L410.282 94.7239H368.121L360.375 111.455H345.182L381.202 38.6199Z"
      />
      <path
        className={text}
        d="M276.737 99.2325C282.841 99.2325 288.006 98.7649 292.232 97.8298C296.524 96.8947 300.011 95.4251 302.695 93.4214C305.447 91.4177 307.423 88.8796 308.634 85.8074C309.906 82.7351 310.545 79.0615 310.545 74.7869C310.545 70.312 309.906 66.5719 308.634 63.5662C307.358 60.494 305.346 58.0227 302.594 56.1525C299.911 54.2822 296.424 52.9465 292.131 52.1451C287.838 51.2769 282.707 50.8426 276.737 50.8426H262.248V99.2325H276.737ZM247.96 38.6199H283.176C288.945 38.6199 294.345 39.2877 299.375 40.6235C304.473 41.8928 308.9 43.9634 312.658 46.8353C316.412 49.6403 319.365 53.3471 321.51 57.9558C323.723 62.4976 324.83 68.0411 324.83 74.5866C324.83 80.798 323.824 86.208 321.812 90.8167C319.8 95.4251 316.983 99.2657 313.362 102.338C309.74 105.411 305.411 107.715 300.381 109.251C295.351 110.72 289.817 111.455 283.78 111.455H247.96V38.6199Z"
      />
    </svg>
  )
}

LogoText.displayName = 'Logo.Text'
