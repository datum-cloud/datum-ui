import type { ReactNode } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useDatumTheme } from '../../theme/theme'

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'flex-end' },
  bubble: {
    maxWidth: '80%',
    borderRadius: 16,
    borderBottomRightRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 9,
    gap: 6,
  },
  text: { fontSize: 16, lineHeight: 22 },
})

export interface AssistantUserMessageProps {
  text: string
  /** Shown above the text inside the bubble, e.g. the resource a prompt mentions. */
  accessory?: ReactNode
  testID?: string
}

/**
 * The user's prompt: a right-aligned bubble in the web's `bg-border`,
 * `rounded-2xl` with a tighter bottom-right corner, max 80% wide.
 */
export function AssistantUserMessage({ text, accessory, testID }: AssistantUserMessageProps) {
  const t = useDatumTheme()
  return (
    <View style={styles.row}>
      <View testID={testID} style={[styles.bubble, { backgroundColor: t.colors.border }]}>
        {accessory}
        <Text selectable style={[styles.text, { color: t.colors.foreground, fontFamily: t.fonts.sans.regular }]}>
          {text}
        </Text>
      </View>
    </View>
  )
}
