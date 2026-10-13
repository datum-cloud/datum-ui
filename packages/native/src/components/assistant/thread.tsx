import type { UIMessage } from '@datum-cloud/datum-ui-assistant-core'
import type { ReactElement, ReactNode, Ref } from 'react'
import type { FlatListProps, NativeScrollEvent, NativeSyntheticEvent, StyleProp, ViewStyle } from 'react-native'
import { firstText } from '@datum-cloud/datum-ui-assistant-core'
import { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { FlatList, Pressable, StyleSheet, View } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import { impactHaptic } from '../../haptics'
import { useDatumTheme } from '../../theme/theme'
import { AssistantMessage } from './assistant-message'
import { AssistantIcon } from './icons'
import { LoadingDots } from './loading-dots'
import { AssistantUserMessage } from './user-message'

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16 },
  separator: { height: 24 },
  submitted: { marginTop: 16 },
  buttonWrap: { position: 'absolute', bottom: 12, alignSelf: 'center' },
  button: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
})

/** Distance from the bottom (pt) within which the thread counts as "at the bottom". */
const PIN_THRESHOLD = 48

export interface AssistantThreadHandle {
  /** Re-pins the thread to the newest message and scrolls there. */
  scrollToEnd: (animated?: boolean) => void
}

export interface AssistantThreadProps {
  messages: UIMessage[]
  /** `ready` | `submitted` | `streaming` | `error`. `submitted` shows the loading dots below the last message. */
  status: string
  onCopy?: (msg: UIMessage) => void
  onShare?: (msg: UIMessage) => void
  /**
   * How a user's prompt reads in its bubble: the text to show and optional
   * content above it (e.g. the prompt's `@Kind/name` mentions drawn as chips).
   * Defaults to the prompt's text.
   */
  formatUserMessage?: (msg: UIMessage) => { text: string, accessory?: ReactNode }
  /** Rendered after the last message (an error notice, a retry hint). */
  footer?: ReactElement | null
  ListHeaderComponent?: FlatListProps<UIMessage>['ListHeaderComponent']
  ListEmptyComponent?: FlatListProps<UIMessage>['ListEmptyComponent']
  contentContainerStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ViewStyle>
  /** Leave the system to inset for bars (iOS `automatic`). */
  contentInsetAdjustmentBehavior?: FlatListProps<UIMessage>['contentInsetAdjustmentBehavior']
  ref?: Ref<AssistantThreadHandle>
  testID?: string
}

/**
 * The conversation: user bubbles and assistant replies in a FlatList that
 * follows the newest text while it streams. Scrolling up stops the
 * following and shows a scroll-to-bottom button; scrolling back down (or a
 * new prompt) resumes it.
 */
export function AssistantThread({
  messages,
  status,
  onCopy,
  onShare,
  formatUserMessage,
  footer,
  ListHeaderComponent,
  ListEmptyComponent,
  contentContainerStyle,
  style,
  contentInsetAdjustmentBehavior = 'automatic',
  ref,
  testID,
}: AssistantThreadProps) {
  const t = useDatumTheme()
  const listRef = useRef<FlatList<UIMessage>>(null)
  const pinned = useRef(true)
  const userScrolling = useRef(false)
  const [showButton, setShowButton] = useState(false)

  const contentHeight = useRef(0)
  const viewportHeight = useRef(0)
  const frame = useRef<number | null>(null)

  /**
   * Scrolls to the measured end on the next frame. An explicit offset (rather
   * than `scrollToEnd`) so back-to-back calls while text streams can't settle
   * on a stale end.
   */
  const stickToEnd = useCallback((animated: boolean) => {
    if (frame.current !== null)
      cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      frame.current = null
      const offset = Math.max(0, contentHeight.current - viewportHeight.current)
      listRef.current?.scrollToOffset({ offset, animated })
    })
  }, [])

  useEffect(() => () => {
    if (frame.current !== null)
      cancelAnimationFrame(frame.current)
  }, [])

  const scrollToEnd = useCallback((animated = true) => {
    pinned.current = true
    setShowButton(false)
    stickToEnd(animated)
  }, [stickToEnd])

  useImperativeHandle(ref, () => ({ scrollToEnd }), [scrollToEnd])

  // A new prompt always brings the thread back to the bottom.
  const userCount = messages.filter(m => m.role === 'user').length
  useEffect(() => {
    if (userCount > 0)
      scrollToEnd(true)
  }, [userCount, scrollToEnd])

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement, contentInset } = e.nativeEvent
    const distance = contentSize.height + (contentInset?.bottom ?? 0) - (contentOffset.y + layoutMeasurement.height)
    const atBottom = distance < PIN_THRESHOLD
    // Only the user's own scrolling changes whether we follow the stream;
    // our programmatic scrolls pass through here too.
    if (userScrolling.current)
      pinned.current = atBottom
    setShowButton(!atBottom && !pinned.current)
  }, [])

  const renderItem = useCallback(({ item, index }: { item: UIMessage, index: number }) => {
    if (item.role === 'user') {
      const formatted = formatUserMessage?.(item) ?? { text: firstText(item) }
      return <AssistantUserMessage text={formatted.text} accessory={formatted.accessory} />
    }
    return (
      <AssistantMessage
        msg={item}
        isLastMessage={index === messages.length - 1}
        status={status}
        onCopy={onCopy}
        onShare={onShare}
      />
    )
  }, [messages.length, status, onCopy, onShare, formatUserMessage])

  return (
    <View style={[styles.root, style]} testID={testID}>
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={m => m.id}
        renderItem={renderItem}
        extraData={status}
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={(
          <View>
            {status === 'submitted' && <LoadingDots style={styles.submitted} testID="assistant-thread-loading" />}
            {footer}
          </View>
        )}
        contentContainerStyle={[styles.content, contentContainerStyle]}
        contentInsetAdjustmentBehavior={contentInsetAdjustmentBehavior}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        onScroll={onScroll}
        scrollEventThrottle={32}
        onScrollBeginDrag={() => {
          userScrolling.current = true
        }}
        onScrollEndDrag={(e) => {
          // Without momentum the drag is the whole gesture.
          if ((e.nativeEvent.velocity?.y ?? 0) === 0)
            userScrolling.current = false
        }}
        onMomentumScrollEnd={() => {
          userScrolling.current = false
        }}
        onLayout={(e) => {
          viewportHeight.current = e.nativeEvent.layout.height
        }}
        onContentSizeChange={(_w, h) => {
          contentHeight.current = h
          if (pinned.current)
            stickToEnd(false)
        }}
      />
      {showButton && messages.length > 0 && (
        <Animated.View entering={FadeIn.duration(t.motion.duration.fast)} exiting={FadeOut.duration(t.motion.duration.fast)} style={styles.buttonWrap} pointerEvents="box-none">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Scroll to bottom"
            hitSlop={10}
            onPress={() => {
              impactHaptic('light')
              scrollToEnd(true)
            }}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: t.colors.card, borderColor: t.colors.border, opacity: pressed ? 0.7 : 1 },
            ]}
            testID="assistant-scroll-to-bottom"
          >
            <AssistantIcon name="arrow-down" size={16} color={t.colors.mutedForeground} />
          </Pressable>
        </Animated.View>
      )}
    </View>
  )
}

function Separator() {
  return <View style={styles.separator} />
}
