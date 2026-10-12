import type { SemanticColors, TypeSize } from '@datum-cloud/datum-ui-tokens'
import type { TextProps as RNTextProps, TextStyle } from 'react-native'
import type { DatumTheme } from '../theme/theme'
import { createContext, use } from 'react'
import { Text as RNText } from 'react-native'
import { useDatumTheme } from '../theme/theme'

export type TextSize = TypeSize
/** `normal` is accepted as an alias of `regular` (the web prop value). */
export type TextWeight = 'regular' | 'normal' | 'medium' | 'semibold'
export type TextTone = 'default' | 'muted' | 'primary' | 'secondary' | 'destructive' | 'success' | 'warning' | 'info'

const TONE_COLOR: Record<TextTone, keyof SemanticColors> = {
  default: 'foreground',
  muted: 'mutedForeground',
  primary: 'primary',
  secondary: 'secondaryForeground',
  destructive: 'destructive',
  success: 'success',
  warning: 'warning',
  info: 'info',
}

/** True inside a datum `Text`, so nested text inherits like it does on the web. */
const NestedTextContext = createContext(false)

export function toneColor(theme: DatumTheme, tone: TextTone): string {
  return theme.colors[TONE_COLOR[tone]]
}

export function fontFor(theme: DatumTheme, weight: TextWeight = 'regular'): string {
  switch (weight) {
    case 'medium':
      return theme.fonts.sans.medium
    case 'semibold':
      return theme.fonts.sans.semibold
    default:
      return theme.fonts.sans.regular
  }
}

const MONO_WEIGHT: Record<TextWeight, TextStyle['fontWeight']> = {
  regular: '400',
  normal: '400',
  medium: '500',
  semibold: '600',
}

export interface TextProps extends RNTextProps {
  /** Type-scale step, as the web `text-*` utilities. Defaults to `sm` (14px). */
  size?: TextSize
  weight?: TextWeight
  /** Text colour role. Defaults to `default` (foreground); nested Text inherits. */
  tone?: TextTone
  /** Monospace (Menlo on iOS). */
  mono?: boolean
}

export function Text({ size, weight, tone, mono, style, children, ...props }: TextProps) {
  const theme = useDatumTheme()
  const nested = use(NestedTextContext)

  const s: TextStyle = {}
  // Top-level text gets the defaults; nested text only overrides what it sets.
  const resolvedSize = size ?? (nested ? undefined : 'sm')
  if (resolvedSize) {
    const step = theme.typography.sizes[resolvedSize]
    s.fontSize = step.fontSize
    s.lineHeight = step.lineHeight
  }
  if (mono) {
    s.fontFamily = theme.fonts.mono
    s.fontWeight = MONO_WEIGHT[weight ?? 'regular']
  }
  else if (weight || !nested) {
    s.fontFamily = fontFor(theme, weight)
  }
  const resolvedTone = tone ?? (nested ? undefined : 'default')
  if (resolvedTone)
    s.color = toneColor(theme, resolvedTone)

  return (
    <NestedTextContext value>
      <RNText {...props} style={[s, style]}>
        {children}
      </RNText>
    </NestedTextContext>
  )
}

export type TitleLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7

const TITLE_SIZE: Record<TitleLevel, TextSize> = {
  1: '4xl',
  2: '3xl',
  3: '2xl',
  4: 'xl',
  5: 'lg',
  6: 'base',
  7: 'sm',
}

export interface TitleProps extends RNTextProps {
  /** 1–7, same steps as the web `Title`. Levels 1–3 use Canela Text. Defaults to 4. */
  level?: TitleLevel
  /** Ignored for Canela levels (1–3), which ship one weight. Defaults to `semibold`. */
  weight?: TextWeight
  tone?: TextTone
}

export function Title({ level = 4, weight = 'semibold', tone = 'default', style, children, ...props }: TitleProps) {
  const theme = useDatumTheme()
  const { fontSize } = theme.typography.sizes[TITLE_SIZE[level]]
  const display = level <= 3
  const s: TextStyle = {
    fontSize,
    // web: leading-tight (1.25) + tracking-tight (-0.025em)
    lineHeight: Math.round(fontSize * 1.25),
    letterSpacing: Math.round(fontSize * -0.025 * 100) / 100,
    fontFamily: display ? theme.fonts.title : fontFor(theme, weight),
    color: toneColor(theme, tone),
  }
  return (
    <NestedTextContext value>
      <RNText accessibilityRole="header" {...props} style={[s, style]}>
        {children}
      </RNText>
    </NestedTextContext>
  )
}
