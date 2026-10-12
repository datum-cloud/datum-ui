import type { ColorScheme, SemanticColors, TypeSize } from '@datum-cloud/datum-ui-tokens'
import type { ReactNode } from 'react'
import type { GestureResponderEvent, PressableProps, StyleProp, TextStyle, ViewStyle } from 'react-native'
import type { HapticStyle } from '../haptics'
import type { ButtonSize, ButtonTheme, ButtonType } from '../variants'
import { withAlpha } from '@datum-cloud/datum-ui-tokens'
import { useState } from 'react'
import { ActivityIndicator, Pressable, Text as RNText } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated'
import { impactHaptic } from '../haptics'
import { useDatumTheme } from '../theme/theme'
import { fontFor } from './text'

export type { ButtonSize, ButtonTheme, ButtonType }

export interface ButtonColors {
  background: string
  border: string
  foreground: string
  underline?: boolean
}

type Role = 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'warning' | 'danger' | 'success'
type Cap<S extends string> = Capitalize<S>
type BtnKey<R extends Role, Suffix extends string = ''> = `btn${Cap<R>}${Suffix}` & keyof SemanticColors

function btn<R extends Role, S extends '' | 'Active' | 'Hover' | 'Border' | 'Foreground'>(c: SemanticColors, role: R, suffix: S): string {
  const key = `btn${role[0]!.toUpperCase()}${role.slice(1)}${suffix}` as BtnKey<R, S>
  return c[key]
}

/** Text colour for the `light` / `borderless` / `outline` themes (web compound variants). */
function quietForeground(c: SemanticColors, scheme: ColorScheme, type: ButtonType): string {
  switch (type) {
    case 'primary':
      return scheme === 'dark' ? c.foreground : c.primary
    case 'secondary':
      return scheme === 'dark' ? c.foreground : c.secondary
    case 'tertiary':
      return scheme === 'dark' ? c.foreground : c.tertiary
    case 'quaternary':
      return scheme === 'dark' ? c.foreground : c.btnQuaternaryForeground
    default:
      return btn(c, type, '')
  }
}

const TRANSPARENT = 'transparent'

/**
 * Resolve the colours for a type × theme × pressed state, mirroring the web
 * Button's cva compound variants (`hover`/`active` collapse to `pressed`).
 */
export function getButtonColors(
  c: SemanticColors,
  scheme: ColorScheme,
  type: ButtonType,
  theme: ButtonTheme,
  pressed = false,
  disabled = false,
): ButtonColors {
  switch (theme) {
    case 'solid': {
      const bg = pressed ? btn(c, type, 'Active') : btn(c, type, '')
      return {
        background: disabled ? withAlpha(btn(c, type, ''), 0.6) : bg,
        // web: quaternary solid borders with its own fill, the rest with *-border
        border: type === 'quaternary' ? c.btnQuaternary : btn(c, type, 'Border'),
        foreground: btn(c, type, 'Foreground'),
      }
    }
    case 'light':
      return {
        background: pressed ? c.btnNeutralBgActive : c.btnNeutralBg,
        border: TRANSPARENT,
        foreground: quietForeground(c, scheme, type),
      }
    case 'borderless':
      return {
        background: pressed ? c.btnNeutralBgActive : TRANSPARENT,
        border: TRANSPARENT,
        foreground: quietForeground(c, scheme, type),
      }
    case 'outline': {
      if (type === 'warning' || type === 'success') {
        // web: border/text yellow|green-600 (light) / -500 (dark), filled on press
        const base = btn(c, type, '')
        return {
          background: pressed ? btn(c, type, 'Hover') : TRANSPARENT,
          border: base,
          foreground: pressed ? '#ffffff' : base,
        }
      }
      if (type === 'danger') {
        return {
          background: pressed ? withAlpha(c.destructive, 0.9) : TRANSPARENT,
          border: c.destructive,
          foreground: pressed ? c.destructiveForeground : c.destructive,
        }
      }
      if (scheme === 'dark') {
        return {
          background: TRANSPARENT,
          border: withAlpha(c.foreground, pressed ? 0.8 : 0.6),
          foreground: c.foreground,
        }
      }
      const border = btn(c, type, 'Border')
      return {
        background: TRANSPARENT,
        border: pressed ? border : withAlpha(border, 0.6),
        foreground: quietForeground(c, scheme, type),
      }
    }
    case 'link':
      return { background: TRANSPARENT, border: TRANSPARENT, foreground: c.primary, underline: true }
  }
}

interface SizeSpec {
  height?: number
  paddingHorizontal: number
  text: TypeSize
  /** Width when the button only holds an icon. */
  square?: number
}

const SIZES: Record<ButtonSize, SizeSpec> = {
  xs: { height: 28, paddingHorizontal: 10, text: 'xs', square: 28 },
  small: { height: 36, paddingHorizontal: 12, text: 'xs', square: 32 },
  default: { height: 36, paddingHorizontal: 16, text: 'sm', square: 36 },
  large: { height: 44, paddingHorizontal: 32, text: 'base', square: 44 },
  icon: { height: 36, paddingHorizontal: 0, text: 'sm', square: 36 },
  link: { paddingHorizontal: 0, text: 'sm' },
}

export type ButtonIcon = ReactNode | ((props: { color: string, size: number }) => ReactNode)

export interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  type?: ButtonType
  theme?: ButtonTheme
  size?: ButtonSize
  /** Stretch to the parent's width. */
  block?: boolean
  /** Shows a spinner and disables the button. */
  loading?: boolean
  /** A node, or a render function that receives the resolved text colour. */
  icon?: ButtonIcon
  iconPosition?: 'left' | 'right'
  /** Light impact haptic on press when expo-haptics is installed. Defaults to true. */
  haptic?: boolean | HapticStyle
  children?: ReactNode
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export function Button({
  type = 'primary',
  theme = 'solid',
  size = 'default',
  block = false,
  loading = false,
  disabled,
  icon,
  iconPosition = 'left',
  haptic = true,
  children,
  style,
  textStyle,
  onPressIn,
  onPressOut,
  onPress,
  ...props
}: ButtonProps) {
  const t = useDatumTheme()
  const [pressed, setPressed] = useState(false)
  const reducedMotion = useReducedMotion()
  const scale = useSharedValue(1)
  const isDisabled = Boolean(disabled || loading)
  const spec = SIZES[size]
  const colors = getButtonColors(t.colors, t.scheme, type, theme, pressed, isDisabled)
  const step = t.typography.sizes[spec.text]
  const isIconOnly = Boolean((icon || loading) && (children === undefined || children === null || children === false))
  const iconSize = Math.round(step.fontSize * 1.15)

  const timing = { duration: t.motion.duration.fast, easing: Easing.bezier(...t.motion.easing.out) }
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))

  const handlePressIn = (e: GestureResponderEvent) => {
    setPressed(true)
    if (!reducedMotion && theme !== 'link')
      scale.value = withTiming(0.98, timing)
    onPressIn?.(e)
  }
  const handlePressOut = (e: GestureResponderEvent) => {
    setPressed(false)
    scale.value = withTiming(1, timing)
    onPressOut?.(e)
  }
  const handlePress = (e: GestureResponderEvent) => {
    if (haptic)
      impactHaptic(haptic === true ? 'light' : haptic)
    onPress?.(e)
  }

  const renderedIcon = typeof icon === 'function' ? icon({ color: colors.foreground, size: iconSize }) : icon
  const spinner = <ActivityIndicator size="small" color={colors.foreground} />

  const label = typeof children === 'string' || typeof children === 'number'
    ? (
        <RNText
          numberOfLines={1}
          style={[
            {
              color: colors.foreground,
              fontFamily: fontFor(t, 'medium'),
              fontSize: step.fontSize,
              lineHeight: step.lineHeight,
              textDecorationLine: colors.underline ? 'underline' : 'none',
            },
            textStyle,
          ]}
        >
          {children}
        </RNText>
      )
    : children

  const container: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: t.radiusScale.lg,
    borderWidth: theme === 'link' ? 0 : 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    height: spec.height,
    paddingHorizontal: isIconOnly && spec.square ? 0 : spec.paddingHorizontal,
    width: isIconOnly && spec.square ? spec.square : undefined,
    alignSelf: block ? 'stretch' : 'flex-start',
    opacity: isDisabled ? 0.5 : theme === 'link' && pressed ? 0.8 : 1,
  }

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      {...props}
      style={[container, animatedStyle, style]}
    >
      {isIconOnly
        ? (loading ? spinner : renderedIcon)
        : (
            <>
              {loading && spinner}
              {!loading && iconPosition === 'left' && renderedIcon}
              {label}
              {!loading && iconPosition === 'right' && renderedIcon}
            </>
          )}
    </AnimatedPressable>
  )
}
