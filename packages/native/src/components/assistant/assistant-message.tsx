import type { UIMessage } from '@datum-cloud/datum-ui-assistant-core'
import {
  activeToolPart,
  hasText,
  isReasoningUIPart,
  isStreamingMessage,
  isTextUIPart,
  isToolUIPart,
  showInitialLoading,
  showToolIndicator,
  toolLabel,
} from '@datum-cloud/datum-ui-assistant-core'
import { withAlpha } from '@datum-cloud/datum-ui-tokens'
import { Fragment, memo, useEffect, useRef, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { impactHaptic } from '../../haptics'
import { useDatumTheme } from '../../theme/theme'
import { useAssistantConfig } from './config'
import { AssistantIcon } from './icons'
import { LoadingDots } from './loading-dots'
import { AssistantMarkdown } from './markdown'
import { ThinkingBlock } from './thinking-block'

const styles = StyleSheet.create({
  root: { width: '100%' },
  loading: { paddingVertical: 6 },
  working: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
  workingText: { fontSize: 13, lineHeight: 18 },
  actions: { flexDirection: 'row', gap: 4, marginTop: 6 },
  action: { padding: 4, borderRadius: 6 },
  pressed: { opacity: 0.5 },
})

export interface AssistantMessageProps {
  msg: UIMessage
  isLastMessage: boolean
  /** The chat status: `ready` | `submitted` | `streaming` | `error`. */
  status: string
  /** Copy the message (the host owns the clipboard). Omit to hide the button. */
  onCopy?: (msg: UIMessage) => void
  /** Share the message (the host owns the share sheet). Omit to hide the button. */
  onShare?: (msg: UIMessage) => void
  testID?: string
}

/**
 * An assistant reply: full-width markdown with no bubble (as on the web), the
 * reasoning block, the "working" line naming the tool in flight, and
 * copy/share actions once the reply has settled.
 */
function AssistantMessageImpl({ msg, isLastMessage, status, onCopy, onShare, testID }: AssistantMessageProps) {
  const t = useDatumTheme()
  const { toolLabels, showReasoning, messageActions, renderToolOutput } = useAssistantConfig()
  const isStreaming = isStreamingMessage({ isLastMessage, status })
  const activeTool = activeToolPart(msg)
  const initialLoading = showInitialLoading({ msg, isLastMessage, status })
  const toolIndicator = showToolIndicator({ msg, isLastMessage })
  let lastTextIndex = -1
  msg.parts.forEach((part, i) => {
    if (isTextUIPart(part))
      lastTextIndex = i
  })

  return (
    <View testID={testID} style={styles.root}>
      {msg.parts.map((part, i) => {
        if (isReasoningUIPart(part)) {
          if (!showReasoning)
            return null
          return <ThinkingBlock key={i} text={part.text} isStreaming={isStreaming && i === msg.parts.length - 1} />
        }
        if (isTextUIPart(part) && part.text)
          return <AssistantMarkdown key={i} text={part.text} streaming={isStreaming && i === lastTextIndex} />
        if (isToolUIPart(part) && part.state === 'output-available' && renderToolOutput) {
          const rendered = renderToolOutput(part, msg)
          if (rendered)
            return <Fragment key={i}>{rendered}</Fragment>
        }
        return null
      })}

      {initialLoading && <LoadingDots style={styles.loading} testID="assistant-loading" />}

      {toolIndicator && activeTool && (
        <View style={styles.working} accessibilityLiveRegion="polite" testID="assistant-working">
          <LoadingDots />
          <Text style={[styles.workingText, { color: t.colors.mutedForeground, fontFamily: t.fonts.sans.regular }]}>
            {toolLabel(activeTool, toolLabels)}
          </Text>
        </View>
      )}

      {!isStreaming && hasText(msg) && (
        messageActions ? messageActions(msg) : <MessageActions msg={msg} onCopy={onCopy} onShare={onShare} />
      )}
    </View>
  )
}

/** Re-renders only when its message (or its streaming role) changes. */
export const AssistantMessage = memo(AssistantMessageImpl)

function MessageActions({ msg, onCopy, onShare }: { msg: UIMessage, onCopy?: (msg: UIMessage) => void, onShare?: (msg: UIMessage) => void }) {
  const t = useDatumTheme()
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => {
    if (timer.current)
      clearTimeout(timer.current)
  }, [])

  if (!onCopy && !onShare)
    return null
  const color = withAlpha(t.colors.mutedForeground, 0.7)
  return (
    <View style={styles.actions}>
      {onCopy && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={copied ? 'Copied' : 'Copy message'}
          hitSlop={10}
          onPress={() => {
            onCopy(msg)
            impactHaptic('light')
            setCopied(true)
            if (timer.current)
              clearTimeout(timer.current)
            timer.current = setTimeout(setCopied, 1500, false)
          }}
          style={({ pressed }) => [styles.action, pressed && styles.pressed]}
        >
          <AssistantIcon name={copied ? 'check' : 'copy'} size={15} color={color} />
        </Pressable>
      )}
      {onShare && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Share message"
          hitSlop={10}
          onPress={() => onShare(msg)}
          style={({ pressed }) => [styles.action, pressed && styles.pressed]}
        >
          <AssistantIcon name="share" size={15} color={color} />
        </Pressable>
      )}
    </View>
  )
}
