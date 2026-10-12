import type { ViewProps } from 'react-native'
import { StyleSheet, View } from 'react-native'
import { useDatumTheme } from '../theme/theme'

export interface SeparatorProps extends ViewProps {
  orientation?: 'horizontal' | 'vertical'
}

/** Hairline divider in the border colour. */
export function Separator({ orientation = 'horizontal', style, ...props }: SeparatorProps) {
  const t = useDatumTheme()
  const line = orientation === 'horizontal'
    ? { height: StyleSheet.hairlineWidth, alignSelf: 'stretch' as const }
    : { width: StyleSheet.hairlineWidth, alignSelf: 'stretch' as const }
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no"
      {...props}
      style={[{ backgroundColor: t.colors.border, flexShrink: 0 }, line, style]}
    />
  )
}
