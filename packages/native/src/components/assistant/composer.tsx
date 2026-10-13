import type { ReactNode, Ref } from 'react'
import type { TextInput as RNTextInput, StyleProp, ViewStyle } from 'react-native'
import { withAlpha } from '@datum-cloud/datum-ui-tokens'
import { Pressable, StyleSheet, TextInput, View } from 'react-native'
import { impactHaptic } from '../../haptics'
import { useDatumTheme } from '../../theme/theme'
import { AssistantIcon } from './icons'

const BUTTON = 32

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 8,
    gap: 4,
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  input: {
    fontSize: 16,
    lineHeight: 22,
    minHeight: 36,
    maxHeight: 180,
    paddingHorizontal: 4,
    paddingTop: 6,
    paddingBottom: 6,
  },
  toolbar: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 8 },
  round: { width: BUTTON, height: BUTTON, borderRadius: BUTTON / 2, alignItems: 'center', justifyContent: 'center' },
})

export interface AssistantComposerProps {
  value: string
  onChangeText: (text: string) => void
  /** Called with the trimmed text. The host clears `value`. */
  onSend: (text: string) => void
  /** Stops the reply in flight. */
  onStop?: () => void
  /** A reply is streaming: the send button becomes Stop. */
  busy?: boolean
  /** Sending is unavailable (e.g. a transcript is loading). Typing still works. */
  disabled?: boolean
  /** Shows a retry button next to send (the last turn failed). */
  onRetry?: () => void
  placeholder?: string
  /** Rendered above the input inside the card, e.g. the resource the prompt is about. */
  accessory?: ReactNode
  autoFocus?: boolean
  inputRef?: Ref<RNTextInput>
  style?: StyleProp<ViewStyle>
  testID?: string
}

/**
 * The prompt card: a growing multiline input with a send button that turns
 * into Stop while a reply streams. Place it below the thread inside a
 * `KeyboardAvoidingView` (behavior `padding`); it has no keyboard handling of
 * its own.
 */
export function AssistantComposer({
  value,
  onChangeText,
  onSend,
  onStop,
  busy = false,
  disabled = false,
  onRetry,
  placeholder = 'Ask Patch anything…',
  accessory,
  autoFocus,
  inputRef,
  style,
  testID,
}: AssistantComposerProps) {
  const t = useDatumTheme()
  const text = value.trim()
  const canSend = !busy && !disabled && text.length > 0

  const send = () => {
    if (!canSend)
      return
    impactHaptic('light')
    onSend(text)
  }

  const stop = () => {
    impactHaptic('medium')
    onStop?.()
  }

  return (
    <View
      testID={testID}
      style={[
        styles.card,
        {
          backgroundColor: t.colors.card,
          borderColor: withAlpha(t.colors.primary, 0.3),
          shadowColor: t.scheme === 'dark' ? '#000' : t.palette.midnightFjord,
        },
        style,
      ]}
    >
      {accessory}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={withAlpha(t.colors.mutedForeground, 0.8)}
        multiline
        autoFocus={autoFocus}
        accessibilityLabel="Message Patch"
        selectionColor={t.colors.primary}
        keyboardAppearance={t.scheme}
        style={[styles.input, { color: t.colors.foreground, fontFamily: t.fonts.sans.regular }]}
        testID={testID ? `${testID}-input` : undefined}
      />
      <View style={styles.toolbar}>
        {onRetry && !busy && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Retry last message"
            hitSlop={8}
            onPress={onRetry}
            style={({ pressed }) => [styles.round, { backgroundColor: pressed ? t.colors.accent : 'transparent' }]}
          >
            <AssistantIcon name="rotate-cw" size={16} color={t.colors.mutedForeground} />
          </Pressable>
        )}
        {busy
          ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Stop generating"
                hitSlop={8}
                onPress={stop}
                style={({ pressed }) => [styles.round, { backgroundColor: t.colors.primary, opacity: pressed ? 0.8 : 1 }]}
                testID={testID ? `${testID}-stop` : undefined}
              >
                <AssistantIcon name="square" size={14} color={t.colors.primaryForeground} />
              </Pressable>
            )
          : (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Send message"
                accessibilityState={{ disabled: !canSend }}
                hitSlop={8}
                onPress={send}
                disabled={!canSend}
                style={({ pressed }) => [
                  styles.round,
                  { backgroundColor: t.colors.primary, opacity: canSend ? (pressed ? 0.8 : 1) : 0.4 },
                ]}
                testID={testID ? `${testID}-send` : undefined}
              >
                <AssistantIcon name="arrow-up" size={16} color={t.colors.primaryForeground} strokeWidth={2.25} />
              </Pressable>
            )}
      </View>
    </View>
  )
}
