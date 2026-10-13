import type { StyleProp, ViewStyle } from 'react-native'
import type { BadgeTheme, BadgeType } from '../variants'
import type { BadgeColors } from './badge'
import { useEffect, useRef } from 'react'
import Animated, {
  cancelAnimation,
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import { useDatumTheme } from '../theme/theme'
import { useBadgeStyles } from './badge'

export type Status = 'success' | 'error' | 'pending' | 'unknown'

/** Status → Badge type. */
export const STATUS_BADGE_TYPE: Record<Status, BadgeType> = {
  success: 'success',
  error: 'danger',
  pending: 'warning',
  unknown: 'muted',
}

const DEFAULT_LABEL: Record<Status, string> = {
  success: 'Success',
  error: 'Error',
  pending: 'Pending',
  unknown: 'Unknown',
}

export interface StatusBadgeProps {
  status: Status
  /** Defaults to Success / Error / Pending / Unknown. */
  label?: string
  /** Badge theme. Defaults to `light`. */
  theme?: BadgeTheme
  style?: StyleProp<ViewStyle>
  testID?: string
}

/**
 * A Badge with a leading status dot. Colours cross-fade when `status`
 * changes, and the dot pulses while pending (both respect Reduce Motion).
 */
export function StatusBadge({ status, label, theme = 'light', style, testID }: StatusBadgeProps) {
  const t = useDatumTheme()
  const reducedMotion = useReducedMotion()
  const s = useBadgeStyles(STATUS_BADGE_TYPE[status], theme)
  const text = label ?? DEFAULT_LABEL[status]

  const from = useSharedValue<BadgeColors>(s.colors)
  const to = useSharedValue<BadgeColors>(s.colors)
  const progress = useSharedValue(1)
  const labelOpacity = useSharedValue(1)
  const dotOpacity = useSharedValue(1)
  const prev = useRef(s.colors)

  const duration = reducedMotion ? 0 : t.motion.duration.medium
  const easing = Easing.bezier(...t.motion.easing.out)

  const key = `${s.colors.background}|${s.colors.border}|${s.colors.foreground}`
  useEffect(() => {
    if (prev.current === s.colors)
      return
    from.value = prev.current
    to.value = s.colors
    prev.current = s.colors
    progress.value = 0
    progress.value = withTiming(1, { duration, easing })
    labelOpacity.value = 0.3
    labelOpacity.value = withTiming(1, { duration, easing })
  }, [key])

  useEffect(() => {
    if (status === 'pending' && !reducedMotion) {
      dotOpacity.value = withRepeat(
        withSequence(withTiming(0.35, { duration: 700 }), withTiming(1, { duration: 700 })),
        -1,
      )
    }
    else {
      cancelAnimation(dotOpacity)
      dotOpacity.value = 1
    }
  }, [status, reducedMotion])

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [from.value.background, to.value.background]),
    borderColor: interpolateColor(progress.value, [0, 1], [from.value.border, to.value.border]),
  }))
  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], [from.value.foreground, to.value.foreground]),
    opacity: labelOpacity.value,
  }))
  const dotStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [from.value.foreground, to.value.foreground]),
    opacity: dotOpacity.value,
  }))

  return (
    <Animated.View
      testID={testID}
      accessibilityRole="text"
      accessibilityLabel={text}
      style={[s.container, containerStyle, style]}
    >
      <Animated.View style={[{ width: 6, height: 6, borderRadius: 3 }, dotStyle]} />
      <Animated.Text numberOfLines={1} style={[s.text, textStyle]}>
        {text}
      </Animated.Text>
    </Animated.View>
  )
}
