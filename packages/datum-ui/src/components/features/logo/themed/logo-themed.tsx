import type { LogoFlatProps } from '../logo-flat'
import type { LogoIconProps } from '../logo-icon'
import type { LogoStackedProps } from '../logo-stacked'
import type { LogoTextProps } from '../logo-text'
import type { LogoTone } from '../logo.styles'
import * as React from 'react'
import { ClientOnly, useTheme } from '../../../themes'
import { LogoFlat } from '../logo-flat'
import { LogoIcon } from '../logo-icon'
import { LogoStacked } from '../logo-stacked'
import { LogoText } from '../logo-text'

/**
 * Resolve a `tone` from the active theme.
 *
 * - dark theme → `mono-light` (white logo on dark surface)
 * - light theme (or unknown) → `brand` (full-colour default)
 *
 * Consumers can override the resolved tone by passing `tone` explicitly.
 */
function resolveTone(resolvedTheme: string | undefined, override?: LogoTone): LogoTone {
  if (override)
    return override
  return resolvedTheme === 'dark' ? 'mono-light' : 'brand'
}

type ThemedProps<P> = Omit<P, 'tone'> & {
  /** Force a specific tone, bypassing the theme-driven default. */
  tone?: LogoTone
}

/**
 * Theme-aware variant of `Logo.Flat`. Picks `brand` on light theme and
 * `mono-light` on dark theme via `useTheme()`. Falls back to `brand`
 * during SSR / before hydration via `ClientOnly`.
 */
export function ThemedLogoFlat(props: ThemedProps<LogoFlatProps>) {
  const { resolvedTheme } = useTheme()
  const { tone, ...rest } = props
  return (
    <ClientOnly fallback={<LogoFlat tone={tone ?? 'brand'} {...rest} />}>
      <LogoFlat tone={resolveTone(resolvedTheme, tone)} {...rest} />
    </ClientOnly>
  )
}
ThemedLogoFlat.displayName = 'ThemedLogo.Flat'

/** Theme-aware variant of `Logo.Stacked`. See `ThemedLogoFlat` for behaviour. */
export function ThemedLogoStacked(props: ThemedProps<LogoStackedProps>) {
  const { resolvedTheme } = useTheme()
  const { tone, ...rest } = props
  return (
    <ClientOnly fallback={<LogoStacked tone={tone ?? 'brand'} {...rest} />}>
      <LogoStacked tone={resolveTone(resolvedTheme, tone)} {...rest} />
    </ClientOnly>
  )
}
ThemedLogoStacked.displayName = 'ThemedLogo.Stacked'

/** Theme-aware variant of `Logo.Icon`. See `ThemedLogoFlat` for behaviour. */
export function ThemedLogoIcon(props: ThemedProps<LogoIconProps>) {
  const { resolvedTheme } = useTheme()
  const { tone, ...rest } = props
  return (
    <ClientOnly fallback={<LogoIcon tone={tone ?? 'brand'} {...rest} />}>
      <LogoIcon tone={resolveTone(resolvedTheme, tone)} {...rest} />
    </ClientOnly>
  )
}
ThemedLogoIcon.displayName = 'ThemedLogo.Icon'

/** Theme-aware variant of `Logo.Text`. See `ThemedLogoFlat` for behaviour. */
export function ThemedLogoText(props: ThemedProps<LogoTextProps>) {
  const { resolvedTheme } = useTheme()
  const { tone, ...rest } = props
  return (
    <ClientOnly fallback={<LogoText tone={tone ?? 'brand'} {...rest} />}>
      <LogoText tone={resolveTone(resolvedTheme, tone)} {...rest} />
    </ClientOnly>
  )
}
ThemedLogoText.displayName = 'ThemedLogo.Text'

/**
 * Theme-aware Datum logo namespace.
 *
 * @example
 * ```tsx
 * import { ThemedLogo } from '@datum-cloud/datum-ui/logo/themed'
 *
 * <ThemedLogo.Flat className="h-8 w-auto" />     // resolves from useTheme()
 * <ThemedLogo.Stacked tone="mono-dark" />        // explicit override
 * ```
 *
 * Requires a `ThemeProvider` ancestor.
 */
export const ThemedLogo = {
  Flat: ThemedLogoFlat,
  Stacked: ThemedLogoStacked,
  Icon: ThemedLogoIcon,
  Text: ThemedLogoText,
} as const
