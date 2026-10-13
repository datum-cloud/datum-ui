import type { StyleProp, ViewStyle } from 'react-native'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { impactHaptic } from '../../haptics'
import { useDatumTheme } from '../../theme/theme'
import { useAssistantConfig } from './config'
import { AssistantIcon } from './icons'

const styles = StyleSheet.create({
  list: { gap: 6 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  text: { flex: 1, fontSize: 15, lineHeight: 20 },
})

export interface AssistantSuggestionsProps {
  onSuggestion: (text: string) => void
  /** Defaults to the config's `suggestions`. */
  suggestions?: string[]
  disabled?: boolean
  style?: StyleProp<ViewStyle>
  testID?: string
}

/** Starter prompts as full-width rows (`bg-sidebar-accent`, `rounded-xl`, trailing arrow), as on the web. */
export function AssistantSuggestions({ onSuggestion, suggestions, disabled = false, style, testID }: AssistantSuggestionsProps) {
  const t = useDatumTheme()
  const config = useAssistantConfig()
  const items = suggestions ?? config.suggestions
  if (items.length === 0)
    return null
  return (
    <View testID={testID} style={[styles.list, style]}>
      {items.map((suggestion, i) => (
        <Animated.View key={suggestion} entering={FadeInDown.duration(t.motion.duration.medium).delay(100 + 50 * i)}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled }}
            disabled={disabled}
            onPress={() => {
              impactHaptic('light')
              onSuggestion(suggestion)
            }}
            style={({ pressed }) => [
              styles.row,
              { backgroundColor: t.colors.sidebarAccent, opacity: disabled ? 0.5 : pressed ? 0.7 : 1 },
            ]}
          >
            <Text style={[styles.text, { color: t.colors.foreground, fontFamily: t.fonts.sans.regular }]}>{suggestion}</Text>
            <AssistantIcon name="arrow-right" size={16} color={t.colors.mutedForeground} />
          </Pressable>
        </Animated.View>
      ))}
    </View>
  )
}
