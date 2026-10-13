import type { ReactNode } from 'react'
import type { ViewProps, ViewStyle } from 'react-native'
import type { AlertType } from '../variants'
import { withAlpha } from '@datum-cloud/datum-ui-tokens'
import { View } from 'react-native'
import { useDatumTheme } from '../theme/theme'
import { Text } from './text'

export type { AlertType }

// Tailwind yellow-50 / -500 / -700: the web warning alert uses the raw palette,
// in both schemes.
const YELLOW_50 = '#fefce8'
const YELLOW_500 = '#eab308'
const YELLOW_700 = '#a16207'

export interface AlertProps extends ViewProps {
  /** Same values as the web Alert `variant`. Defaults to `default`. */
  type?: AlertType
  /** Alias of `type`, matching the web prop name. */
  variant?: AlertType
  title?: ReactNode
  description?: ReactNode
  /** Leading icon; render it at 16px. */
  icon?: ReactNode
  children?: ReactNode
}

export function Alert({ type, variant, title, description, icon, children, style, ...props }: AlertProps) {
  const t = useDatumTheme()
  const c = t.colors
  const kind = type ?? variant ?? 'default'

  const palette: Record<AlertType, { bg: string, border: string, fg: string }> = {
    default: { bg: c.background, border: c.border, fg: c.foreground },
    secondary: { bg: c.muted, border: c.border, fg: c.primary },
    outline: { bg: 'transparent', border: c.muted, fg: c.mutedForeground },
    destructive: {
      bg: 'transparent',
      border: t.scheme === 'dark' ? c.destructive : withAlpha(c.destructive, 0.5),
      fg: c.destructive,
    },
    success: { bg: c.success100, border: c.success300, fg: c.success500 },
    info: { bg: c.info100, border: c.info300, fg: c.info500 },
    warning: { bg: YELLOW_50, border: YELLOW_500, fg: YELLOW_700 },
  }
  const p = palette[kind]

  const container: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: t.radiusScale.lg,
    borderWidth: 1,
    borderColor: p.border,
    backgroundColor: p.bg,
  }

  return (
    <View accessibilityRole="alert" {...props} style={[container, style]}>
      {icon ? <View style={{ paddingTop: 2 }}>{icon}</View> : null}
      <View style={{ flex: 1, gap: 4 }}>
        {title
          ? typeof title === 'string'
            ? <Text size="sm" weight="medium" numberOfLines={1} style={{ color: p.fg }}>{title}</Text>
            : title
          : null}
        {description
          ? typeof description === 'string'
            ? <Text size="sm" tone="muted">{description}</Text>
            : description
          : null}
        {children}
      </View>
    </View>
  )
}
