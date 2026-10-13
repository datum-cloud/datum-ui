import type { DimensionValue, LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native'
import { withAlpha } from '@datum-cloud/datum-ui-tokens'
import { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg'
import { useDatumTheme } from '../theme/theme'

export interface SkeletonProps {
  width?: DimensionValue
  height?: DimensionValue
  /** Corner radius in px. Defaults to the `rounded-md` step (4). */
  radius?: number
  /** Sweep a highlight across the block. Defaults to true; off under Reduce Motion. */
  shimmer?: boolean
  style?: StyleProp<ViewStyle>
  testID?: string
}

const SWEEP_MS = 1200

/** Loading placeholder with a Reanimated shimmer (the web uses `animate-pulse`). */
export function Skeleton({ width = '100%', height = 16, radius, shimmer = true, style, testID }: SkeletonProps) {
  const t = useDatumTheme()
  const reducedMotion = useReducedMotion()
  const [w, setW] = useState(0)
  const x = useSharedValue(0)
  const animate = shimmer && !reducedMotion && w > 0

  useEffect(() => {
    if (!animate) {
      cancelAnimation(x)
      return
    }
    x.value = 0
    x.value = withRepeat(withTiming(1, { duration: SWEEP_MS, easing: Easing.inOut(Easing.ease) }), -1)
    return () => cancelAnimation(x)
  }, [animate])

  const sweep = useAnimatedStyle(() => ({ transform: [{ translateX: -w + x.value * w * 2 }] }))
  const highlight = t.scheme === 'dark' ? withAlpha(t.colors.foreground, 0.08) : 'rgba(255, 255, 255, 0.6)'

  return (
    <View
      testID={testID}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
      onLayout={(e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width)}
      style={[
        {
          width,
          height,
          borderRadius: radius ?? t.radiusScale.md,
          backgroundColor: withAlpha(t.colors.mutedForeground, 0.1),
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {animate
        ? (
            <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, sweep]}>
              <Svg width="100%" height="100%">
                <Defs>
                  <LinearGradient id="datum-skeleton-shimmer" x1="0" y1="0" x2="1" y2="0">
                    <Stop offset="0" stopColor={highlight} stopOpacity={0} />
                    <Stop offset="0.5" stopColor={highlight} stopOpacity={1} />
                    <Stop offset="1" stopColor={highlight} stopOpacity={0} />
                  </LinearGradient>
                </Defs>
                <Rect x="0" y="0" width="100%" height="100%" fill="url(#datum-skeleton-shimmer)" />
              </Svg>
            </Animated.View>
          )
        : null}
    </View>
  )
}
