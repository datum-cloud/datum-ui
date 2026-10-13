import { thinkingLabel } from '@datum-cloud/datum-ui-assistant-core'
import { withAlpha } from '@datum-cloud/datum-ui-tokens'
import { useRef, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useDatumTheme } from '../../theme/theme'
import { AssistantIcon } from './icons'

const styles = StyleSheet.create({
  root: { marginBottom: 12 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' },
  label: { fontSize: 13, lineHeight: 18 },
  flipped: { transform: [{ rotate: '180deg' }] },
  body: { marginTop: 8, borderLeftWidth: 2, paddingLeft: 12, fontSize: 13, lineHeight: 20 },
})

export interface ThinkingBlockProps {
  text: string
  isStreaming?: boolean
  testID?: string
}

/**
 * The assistant's reasoning, collapsed to a "Thought for 4s" line that
 * expands to the text. Duration is measured from the first streaming render
 * to the first settled one, as on the web.
 */
export function ThinkingBlock({ text, isStreaming = false, testID }: ThinkingBlockProps) {
  const t = useDatumTheme()
  const [open, setOpen] = useState(false)
  const startedAt = useRef<number | null>(null)
  const duration = useRef<number | null>(null)

  // Measuring across renders is the point: see the web component's note.
  if (isStreaming && startedAt.current === null)
    startedAt.current = Date.now()
  if (!isStreaming && startedAt.current !== null && duration.current === null)
    duration.current = Math.round((Date.now() - startedAt.current) / 1000)

  const label = thinkingLabel(isStreaming, duration.current)
  const muted = t.colors.mutedForeground

  return (
    <View testID={testID} style={styles.root}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open, disabled: isStreaming }}
        disabled={isStreaming}
        onPress={() => setOpen(o => !o)}
        hitSlop={8}
        style={styles.header}
      >
        <AssistantIcon name="brain" size={14} color={muted} />
        <Text style={[styles.label, { color: muted, fontFamily: t.fonts.sans.regular }]}>{label}</Text>
        {!isStreaming && (
          <AssistantIcon name="chevron-down" size={14} color={muted} style={open ? styles.flipped : undefined} />
        )}
      </Pressable>
      {open && !isStreaming && (
        <Text
          selectable
          style={[styles.body, { color: withAlpha(muted, 0.75), borderLeftColor: withAlpha(muted, 0.2), fontFamily: t.fonts.sans.regular }]}
        >
          {text}
        </Text>
      )}
    </View>
  )
}
