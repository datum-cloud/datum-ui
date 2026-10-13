import type { ChatSummary } from '@datum-cloud/datum-ui-assistant-core'
import type { ReactNode } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import { formatRelativeTime } from '@datum-cloud/datum-ui-assistant-core'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useDatumTheme } from '../../theme/theme'

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, minHeight: 60 },
  text: { flex: 1, gap: 2 },
  title: { fontSize: 16, lineHeight: 21 },
  meta: { fontSize: 13, lineHeight: 18 },
})

export interface ConversationRowProps {
  chat: Pick<ChatSummary, 'id' | 'title' | 'updatedAt' | 'archived'>
  /** The chat open in the assistant right now. */
  active?: boolean
  onPress?: () => void
  onLongPress?: () => void
  /** Trailing content, e.g. a chevron or an "Archived" badge. */
  trailing?: ReactNode
  /** Clock for the relative time; injectable for tests. */
  now?: number
  style?: StyleProp<ViewStyle>
  testID?: string
}

/** One conversation in the history list: title and last-active time, in a plain grouped-list row. */
export function ConversationRow({ chat, active = false, onPress, onLongPress, trailing, now, style, testID }: ConversationRowProps) {
  const t = useDatumTheme()
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityHint="Opens this conversation"
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: pressed ? t.colors.accent : t.colors.card },
        style,
      ]}
    >
      <View style={styles.text}>
        <Text numberOfLines={2} style={[styles.title, { color: t.colors.foreground, fontFamily: active ? t.fonts.sans.semibold : t.fonts.sans.medium }]}>
          {chat.title}
        </Text>
        <Text style={[styles.meta, { color: t.colors.mutedForeground, fontFamily: t.fonts.sans.regular }]}>
          {formatRelativeTime(chat.updatedAt, now)}
        </Text>
      </View>
      {trailing}
    </Pressable>
  )
}
