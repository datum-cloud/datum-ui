import { LogoFlat } from './logo-flat'
import { LogoIcon } from './logo-icon'
import { LogoStacked } from './logo-stacked'
import { LogoText } from './logo-text'

/**
 * Datum logo namespace.
 *
 * @example
 * ```tsx
 * import { Logo } from '@datum-cloud/datum-ui/logo'
 *
 * <Logo.Flat className="h-8 w-auto" />
 * <Logo.Stacked tone="mono-light" className="h-16 w-auto" />
 * <Logo.Icon className="size-8" />
 * <Logo.Text className="h-6 w-auto" />
 * ```
 */
export const Logo = {
  Flat: LogoFlat,
  Stacked: LogoStacked,
  Icon: LogoIcon,
  Text: LogoText,
} as const
