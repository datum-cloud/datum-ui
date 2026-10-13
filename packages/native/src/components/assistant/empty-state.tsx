import type { ReactNode } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import { StyleSheet, Text, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useDatumTheme } from '../../theme/theme'
import { useAssistantConfig } from './config'
import { BrainGlyph } from './icons'
import { AssistantSuggestions } from './suggestions'

const styles = StyleSheet.create({
  root: { width: '100%' },
  header: { alignItems: 'center', marginBottom: 28 },
  glyph: { marginBottom: 16 },
  // web: text-3xl leading-[34px] tracking-[-1.2px] font-title
  greeting: { fontSize: 30, lineHeight: 36, letterSpacing: -1.2, textAlign: 'center' },
  suggestions: { marginTop: 4 },
})

export interface AssistantEmptyStateProps {
  /** Name for the greeting ("Hey there, Matt"). */
  name?: string
  onSuggestion: (text: string) => void
  /** Suggestions can't be sent yet (e.g. no project). */
  disabled?: boolean
  /** Rendered between the greeting and the suggestions (the web puts the prompt card here). */
  children?: ReactNode
  style?: StyleProp<ViewStyle>
  testID?: string
}

/** The new-chat screen: the brain glyph, a Canela greeting and the starter prompts. */
export function AssistantEmptyState({ name, onSuggestion, disabled, children, style, testID }: AssistantEmptyStateProps) {
  const t = useDatumTheme()
  const { greeting } = useAssistantConfig()
  return (
    <View testID={testID} style={[styles.root, style]}>
      <Animated.View entering={FadeInDown.duration(300)} style={styles.header}>
        <BrainGlyph size={64} scheme={t.scheme} style={styles.glyph} />
        <Text accessibilityRole="header" style={[styles.greeting, { color: t.colors.foreground, fontFamily: t.fonts.title }]}>
          {greeting(name)}
        </Text>
      </Animated.View>
      {children}
      <AssistantSuggestions onSuggestion={onSuggestion} disabled={disabled} style={styles.suggestions} />
    </View>
  )
}
