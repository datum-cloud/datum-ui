import type { ActivityIndicatorProps } from 'react-native'
import type { TextTone } from './text'
import { ActivityIndicator } from 'react-native'
import { useDatumTheme } from '../theme/theme'
import { toneColor } from './text'

export interface SpinnerProps extends ActivityIndicatorProps {
  /** Colour role when `color` is not set. Defaults to `muted`. */
  tone?: TextTone
}

/** Themed ActivityIndicator. */
export function Spinner({ tone = 'muted', color, size = 'small', ...props }: SpinnerProps) {
  const t = useDatumTheme()
  return (
    <ActivityIndicator
      accessibilityLabel="Loading"
      size={size}
      color={color ?? toneColor(t, tone)}
      {...props}
    />
  )
}
