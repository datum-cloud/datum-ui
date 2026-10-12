import type { ColorScheme, SemanticColors } from '@datum-cloud/datum-ui-tokens'
import type { ReactNode } from 'react'
import type { StyleProp, TextStyle, ViewProps, ViewStyle } from 'react-native'
import type { BadgeTheme, BadgeType } from '../variants'
import { withAlpha } from '@datum-cloud/datum-ui-tokens'
import { Text as RNText, View } from 'react-native'
import { useDatumTheme } from '../theme/theme'
import { fontFor } from './text'

export type { BadgeTheme, BadgeType }

export interface BadgeColors {
  background: string
  border: string
  foreground: string
}

type Solid = Exclude<BadgeType, 'muted'>

function fill(c: SemanticColors, type: Solid): string {
  return c[`badge${type[0]!.toUpperCase()}${type.slice(1)}` as `badge${Capitalize<Solid>}`]
}
function fillForeground(c: SemanticColors, type: Solid): string {
  return c[`badge${type[0]!.toUpperCase()}${type.slice(1)}Foreground` as `badge${Capitalize<Solid>}Foreground`]
}

const TRANSPARENT = 'transparent'

/** Resolve badge colours, mirroring the web Badge cva compound variants. */
export function getBadgeColors(c: SemanticColors, scheme: ColorScheme, type: BadgeType, theme: BadgeTheme): BadgeColors {
  if (type === 'muted') {
    switch (theme) {
      case 'solid':
        return scheme === 'dark'
          ? { background: withAlpha(c.badgeMuted, 0.2), border: withAlpha(c.badgeMuted, 0.2), foreground: c.badgeMuted }
          : { background: c.badgeMuted, border: TRANSPARENT, foreground: c.badgeMutedForeground }
      case 'outline':
        return { background: TRANSPARENT, border: c.badgeMuted, foreground: c.badgeMuted }
      case 'light':
        return scheme === 'dark'
          ? { background: withAlpha(c.badgeMuted, 0.2), border: TRANSPARENT, foreground: c.badgeMuted }
          : { background: withAlpha(c.mutedForeground, 0.15), border: TRANSPARENT, foreground: c.mutedForeground }
    }
  }

  const base = fill(c, type)
  // quaternary text uses its foreground token in outline/light; the rest use the fill colour
  const text = type === 'quaternary' ? c.badgeQuaternaryForeground : base
  switch (theme) {
    case 'solid':
      return { background: base, border: TRANSPARENT, foreground: fillForeground(c, type) }
    case 'outline':
      return { background: TRANSPARENT, border: base, foreground: text }
    case 'light':
      return {
        background: withAlpha(base, type === 'primary' && scheme === 'light' ? 0.1 : 0.2),
        border: TRANSPARENT,
        foreground: text,
      }
  }
}

export interface BadgeProps extends ViewProps {
  /** Defaults to `muted`, as on the web. */
  type?: BadgeType
  /** Defaults to `solid`. */
  theme?: BadgeTheme
  /** Rendered before the label (e.g. a status dot or icon). */
  icon?: ReactNode
  children?: ReactNode
  textStyle?: StyleProp<TextStyle>
}

export function useBadgeStyles(type: BadgeType, theme: BadgeTheme): { colors: BadgeColors, container: ViewStyle, text: TextStyle } {
  const t = useDatumTheme()
  const colors = getBadgeColors(t.colors, t.scheme, type, theme)
  const step = t.typography.sizes.xs
  return {
    colors,
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: 6,
      borderRadius: t.radiusScale.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
      paddingHorizontal: 10,
      paddingVertical: 2,
    },
    text: {
      color: colors.foreground,
      fontFamily: fontFor(t, 'semibold'),
      fontSize: step.fontSize,
      lineHeight: step.lineHeight,
    },
  }
}

export function Badge({ type = 'muted', theme = 'solid', icon, children, style, textStyle, ...props }: BadgeProps) {
  const s = useBadgeStyles(type, theme)
  return (
    <View {...props} style={[s.container, style]}>
      {icon}
      {typeof children === 'string' || typeof children === 'number'
        ? <RNText numberOfLines={1} style={[s.text, textStyle]}>{children}</RNText>
        : children}
    </View>
  )
}
