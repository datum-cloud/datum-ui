import type { StyleProp, ViewStyle } from 'react-native'
import { withAlpha } from '@datum-cloud/datum-ui-tokens'
import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import { useDatumTheme } from '../../theme/theme'

const DOT = 6
const BOUNCE = 4

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 4, height: DOT + BOUNCE * 2 },
  dot: { width: DOT, height: DOT, borderRadius: DOT / 2 },
})

// The web dots run Tailwind's 1s `animate-bounce` with -0.3s / -0.15s offsets.
const STAGGER_MS = 150
const HALF_MS = 300

function Dot({ index, color }: { index: number, color: string }) {
  const y = useSharedValue(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (reduceMotion)
      return
    y.value = withDelay(
      index * STAGGER_MS,
      withRepeat(
        withSequence(
          withTiming(-BOUNCE, { duration: HALF_MS, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: HALF_MS, easing: Easing.in(Easing.quad) }),
          withTiming(0, { duration: STAGGER_MS * 2 }),
        ),
        -1,
      ),
    )
    return () => cancelAnimation(y)
  }, [index, reduceMotion, y])

  const style = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }))
  return <Animated.View style={[styles.dot, { backgroundColor: color }, style]} />
}

export interface LoadingDotsProps {
  style?: StyleProp<ViewStyle>
  testID?: string
}

/** Three staggered bouncing dots: the assistant's "thinking" indicator. */
export function LoadingDots({ style, testID }: LoadingDotsProps) {
  const t = useDatumTheme()
  const color = withAlpha(t.colors.mutedForeground, 0.5)
  return (
    <View testID={testID} style={[styles.row, style]} accessibilityRole="progressbar" accessibilityLabel="Thinking">
      <Dot index={0} color={color} />
      <Dot index={1} color={color} />
      <Dot index={2} color={color} />
    </View>
  )
}
