import type { ReactElement, ReactNode } from 'react'
import type { TextProps as RNTextProps, StyleProp, ViewProps, ViewStyle } from 'react-native'
import { Children, cloneElement, createContext, isValidElement, use } from 'react'
import { View } from 'react-native'
import { useDatumTheme } from '../theme/theme'
import { Text } from './text'

/**
 * Datum Card — mirrors `base/card` on the web.
 *
 * `size` sets the inset shared by every slot (sm 16 / md 24). Stacked cards
 * (default) pad the root vertically and gap the slots; `sectioned` cards give
 * each slot its own vertical inset and use `bordered` header/footer dividers.
 */

interface CardContextValue {
  inset: number
  sectioned: boolean
}

const CardContext = createContext<CardContextValue>({ inset: 24, sectioned: false })

export type CardSize = 'sm' | 'md'

export interface CardProps extends ViewProps {
  size?: CardSize
  sectioned?: boolean
}

export function Card({ size = 'md', sectioned = false, style, children, ...props }: CardProps) {
  const t = useDatumTheme()
  const inset = size === 'sm' ? 16 : 24
  const container: ViewStyle = {
    backgroundColor: t.colors.card,
    borderColor: t.colors.cardBorder,
    borderWidth: 1,
    borderRadius: t.radiusScale.xl,
    flexDirection: 'column',
    overflow: 'hidden',
    ...(sectioned ? {} : { paddingVertical: inset, gap: size === 'sm' ? 12 : 16 }),
  }
  return (
    <CardContext value={{ inset, sectioned }}>
      <View {...props} style={[container, style]}>
        {children}
      </View>
    </CardContext>
  )
}

export interface CardHeaderProps extends ViewProps {
  /** Density of the title/description pair (and sectioned min-height). Defaults to `md`. */
  size?: 'sm' | 'md' | 'lg'
  /** Divider under the header (pairs with `sectioned`). */
  bordered?: boolean
  /** Trailing action (button, badge) — the web `CardAction`. */
  action?: ReactNode
}

export function CardHeader({ size = 'md', bordered = false, action, style, children, ...props }: CardHeaderProps) {
  const t = useDatumTheme()
  const { inset, sectioned } = use(CardContext)
  const minHeight = { sm: 48, md: 56, lg: 64 }[size]
  const header: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: inset,
    ...(sectioned ? { paddingVertical: size === 'lg' ? inset * 1.25 : inset, minHeight } : {}),
    ...(bordered ? { borderBottomWidth: 1, borderBottomColor: t.colors.cardBorder } : {}),
  }
  return (
    <View {...props} style={[header, style]}>
      <View style={{ flex: 1, gap: size === 'sm' ? 4 : 6 }}>{children}</View>
      {action ? <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>{action}</View> : null}
    </View>
  )
}

export function CardTitle({ style, ...props }: RNTextProps) {
  return <Text size="base" weight="semibold" accessibilityRole="header" {...props} style={[{ lineHeight: 20 }, style]} />
}

export function CardDescription(props: RNTextProps) {
  return <Text size="sm" tone="muted" {...props} />
}

export type CardPadding = 'default' | 'x-none' | 'none'

function usePadding(padding: CardPadding): ViewStyle {
  const { inset, sectioned } = use(CardContext)
  if (padding === 'none')
    return {}
  return {
    paddingHorizontal: padding === 'default' ? inset : 0,
    ...(sectioned ? { paddingVertical: inset } : {}),
  }
}

export interface CardContentProps extends ViewProps {
  padding?: CardPadding
}

export function CardContent({ padding = 'default', style, children, ...props }: CardContentProps) {
  const pad = usePadding(padding)
  // The last CardField drops its divider (the web uses :last-child).
  const items = Children.toArray(children)
  let lastField = -1
  items.forEach((child, i) => {
    if (isValidElement(child) && child.type === CardField)
      lastField = i
  })
  const content = lastField === -1
    ? children
    : items.map((child, i) =>
        i === lastField && (child as ReactElement<CardFieldProps>).props.separator === undefined
          ? cloneElement(child as ReactElement<CardFieldProps>, { separator: false })
          : child,
      )
  return (
    <View {...props} style={[pad, style]}>
      {content}
    </View>
  )
}

export interface CardFooterProps extends ViewProps {
  padding?: CardPadding
  bordered?: boolean
}

export function CardFooter({ padding = 'default', bordered = false, style, ...props }: CardFooterProps) {
  const t = useDatumTheme()
  const pad = usePadding(padding)
  const footer: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    ...pad,
    ...(bordered ? { borderTopWidth: 1, borderTopColor: t.colors.cardBorder } : {}),
  }
  return <View {...props} style={[footer, style]} />
}

export interface CardFieldProps extends ViewProps {
  label: ReactNode
  /** Shown on the right. Strings render as body text; nodes render as-is. */
  value?: ReactNode
  /** Alternative to `value` for custom content. */
  children?: ReactNode
  /** `inline` (default) puts label and value on one row; `stacked` puts the value below. */
  layout?: 'inline' | 'stacked'
  /** Divider under the row. Defaults to true; the last field in a CardContent drops it. */
  separator?: boolean
  valueStyle?: StyleProp<ViewStyle>
}

/** Label | value definition row — the web `CardField`. Use inside `CardContent padding="none"`. */
export function CardField({ label, value, children, layout = 'inline', separator = true, style, valueStyle, ...props }: CardFieldProps) {
  const t = useDatumTheme()
  const { inset } = use(CardContext)
  const body = value ?? children
  const inline = layout === 'inline'
  const row: ViewStyle = {
    marginHorizontal: inset,
    paddingVertical: 14,
    flexDirection: inline ? 'row' : 'column',
    alignItems: inline ? 'center' : 'flex-start',
    justifyContent: 'space-between',
    gap: inline ? 24 : 4,
    ...(separator ? { borderBottomWidth: 1, borderBottomColor: t.colors.cardBorder } : {}),
  }
  return (
    <View {...props} style={[row, style]}>
      <View style={{ flexShrink: 0, maxWidth: inline ? '50%' : undefined }}>
        {typeof label === 'string' ? <Text size="sm" weight="medium">{label}</Text> : label}
      </View>
      <View style={[{ flexShrink: 1, alignItems: inline ? 'flex-end' : 'flex-start' }, valueStyle]}>
        {typeof body === 'string' || typeof body === 'number'
          ? <Text size="sm" numberOfLines={2} style={{ textAlign: inline ? 'right' : 'left' }}>{body}</Text>
          : body}
      </View>
    </View>
  )
}
