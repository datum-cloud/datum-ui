import type { ReactNode } from 'react'
import type { TextStyle, ViewStyle } from 'react-native'
import type { MarkedStyles } from 'react-native-marked'
import type { DatumTheme } from '../../theme/theme'
import { repairStreamingMarkdown } from '@datum-cloud/datum-ui-assistant-core'
import { withAlpha } from '@datum-cloud/datum-ui-tokens'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { Renderer, useMarkdown } from 'react-native-marked'
import { useDatumTheme } from '../../theme/theme'
import { useAssistantConfig } from './config'

/** Shared answer body type: 16/24 Alliance, the iOS reading size. */
function bodyText(t: DatumTheme): TextStyle {
  return { fontFamily: t.fonts.sans.regular, fontSize: 16, lineHeight: 24, color: t.colors.foreground }
}

/** Background of code blocks and inline code, as the web `bg-card` (light) / `bg-accent` (dark). */
export function codeBackground(t: DatumTheme): string {
  return t.scheme === 'dark' ? withAlpha(t.colors.foreground, 0.08) : t.colors.card
}

export function markdownStyles(t: DatumTheme): MarkedStyles {
  const text = bodyText(t)
  const heading = (fontSize: number, lineHeight: number): TextStyle => ({
    fontFamily: t.fonts.sans.semibold,
    fontSize,
    lineHeight,
    color: t.colors.foreground,
    marginTop: 8,
    marginBottom: 4,
    borderBottomWidth: 0,
    paddingBottom: 0,
    fontWeight: undefined,
  })
  return {
    text,
    paragraph: { paddingVertical: 4 },
    strong: { ...text, fontFamily: t.fonts.sans.semibold, fontWeight: undefined },
    em: { ...text, fontStyle: 'italic' },
    strikethrough: { ...text, textDecorationLine: 'line-through' },
    link: { ...text, fontStyle: 'normal', color: t.colors.foreground, textDecorationLine: 'underline', textDecorationColor: withAlpha(t.colors.foreground, 0.4) },
    h1: heading(22, 28),
    h2: heading(20, 28),
    h3: heading(18, 24),
    h4: heading(16, 24),
    h5: heading(16, 24),
    h6: heading(16, 24),
    codespan: { fontFamily: t.fonts.mono, fontSize: 14, color: t.colors.foreground, backgroundColor: codeBackground(t), fontStyle: 'normal' },
    code: { padding: 12 },
    codeText: { fontFamily: t.fonts.mono, fontSize: 13, lineHeight: 19, color: t.colors.foreground },
    blockquote: { borderLeftColor: t.colors.border, borderLeftWidth: 3, paddingLeft: 12, opacity: 1 },
    hr: { borderBottomColor: t.colors.border, borderBottomWidth: 1, marginVertical: 12 },
    list: { marginVertical: 2 },
    li: text,
    table: { borderColor: t.colors.border, borderWidth: 1, marginVertical: 8 },
    tableRow: {},
    tableCell: { padding: 6 },
  }
}

/**
 * A react-native-marked renderer themed with the Datum tokens: mono code
 * blocks that scroll sideways, links routed through the host, and keys that
 * are stable from one streamed render to the next (a fresh renderer per parse
 * restarts its key sequence, so the same block keeps the same key and React
 * updates it in place instead of remounting the whole answer).
 */
class DatumMarkdownRenderer extends Renderer {
  private readonly theme: DatumTheme
  private readonly onLink: (href: string) => void
  private seq = 0

  constructor(theme: DatumTheme, onLink: (href: string) => void) {
    super({ selectable: true })
    this.theme = theme
    this.onLink = onLink
  }

  override getKey(): string {
    this.seq += 1
    return `md-${this.seq}`
  }

  override code(text: string, language?: string, _containerStyle?: ViewStyle, textStyle?: TextStyle): ReactNode {
    const t = this.theme
    return (
      <View
        key={this.getKey()}
        style={{
          backgroundColor: codeBackground(t),
          borderColor: t.colors.border,
          borderWidth: 1,
          borderRadius: t.radiusScale.xl,
          marginVertical: 6,
          overflow: 'hidden',
        }}
      >
        {language
          ? (
              <Text style={{ fontFamily: t.fonts.sans.medium, fontSize: 12, lineHeight: 16, color: t.colors.mutedForeground, paddingHorizontal: 12, paddingTop: 8 }}>
                {language}
              </Text>
            )
          : null}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: 12 }}>
          <Text selectable style={textStyle}>{text}</Text>
        </ScrollView>
      </View>
    )
  }

  /**
   * Tables keep readable column widths and scroll sideways, instead of being
   * squeezed into the window width.
   */
  override table(header: ReactNode[][], rows: ReactNode[][][]): ReactNode {
    const t = this.theme
    const columns = header.length
    const width = columns <= 2 ? 160 : 140
    const cell = (content: ReactNode[], key: string, head: boolean) => (
      <View
        key={key}
        style={{
          width,
          paddingHorizontal: 10,
          paddingVertical: 8,
          borderRightWidth: StyleSheet.hairlineWidth,
          borderColor: t.colors.border,
          backgroundColor: head ? codeBackground(t) : undefined,
        }}
      >
        {content}
      </View>
    )
    return (
      <ScrollView key={this.getKey()} horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
        <View style={{ borderWidth: StyleSheet.hairlineWidth, borderColor: t.colors.border, borderRadius: t.radiusScale.xl, overflow: 'hidden' }}>
          <View style={{ flexDirection: 'row' }}>{header.map((c, i) => cell(c, `h${i}`, true))}</View>
          {rows.map((row, r) => (
            // eslint-disable-next-line react/no-array-index-key
            <View key={`r${r}`} style={{ flexDirection: 'row', borderTopWidth: StyleSheet.hairlineWidth, borderColor: t.colors.border }}>
              {row.map((c, i) => cell(c, `r${r}c${i}`, false))}
            </View>
          ))}
        </View>
      </ScrollView>
    )
  }

  override link(children: string | ReactNode[], href: string, styles?: TextStyle, title?: string): ReactNode {
    return (
      <Text
        key={this.getKey()}
        accessibilityRole="link"
        accessibilityLabel={title || (typeof children === 'string' ? children : undefined)}
        onPress={() => this.onLink(href)}
        style={styles}
      >
        {children}
      </Text>
    )
  }
}

/** Holds a fast-changing value to at most one update per `intervalMs` while `enabled`. */
export function useThrottledValue<T>(value: T, intervalMs: number, enabled: boolean): T {
  const [throttled, setThrottled] = useState(value)
  const lastRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!enabled) {
      if (timerRef.current)
        clearTimeout(timerRef.current)
      timerRef.current = null
      setThrottled(value)
      return
    }
    const elapsed = Date.now() - lastRef.current
    if (elapsed >= intervalMs) {
      lastRef.current = Date.now()
      setThrottled(value)
      return
    }
    if (timerRef.current)
      clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      lastRef.current = Date.now()
      timerRef.current = null
      setThrottled(value)
    }, intervalMs - elapsed)
  }, [value, intervalMs, enabled])

  useEffect(() => () => {
    if (timerRef.current)
      clearTimeout(timerRef.current)
  }, [])

  return enabled ? throttled : value
}

export interface AssistantMarkdownProps {
  /** Markdown source. */
  text: string
  /**
   * While true the text is still arriving: unterminated constructs are closed
   * before parsing and re-renders are throttled to `throttleMs`.
   */
  streaming?: boolean
  throttleMs?: number
  testID?: string
}

/** An answer's markdown, rendered natively with the Datum type and colours. */
export function AssistantMarkdown({ text, streaming = false, throttleMs = 80, testID }: AssistantMarkdownProps) {
  const t = useDatumTheme()
  const { onLinkPress } = useAssistantConfig()
  const shown = useThrottledValue(text, throttleMs, streaming)
  const source = streaming ? repairStreamingMarkdown(shown) : shown
  const styles = useMemo(() => markdownStyles(t), [t])
  const theme = useMemo(
    () => ({ colors: { code: codeBackground(t), link: t.colors.foreground, text: t.colors.foreground, border: t.colors.border } }),
    [t],
  )
  // A new renderer per source restarts the key sequence (see DatumMarkdownRenderer).
  const renderer = useMemo(() => new DatumMarkdownRenderer(t, onLinkPress), [t, onLinkPress, source])
  const elements = useMarkdown(source, { renderer, styles, theme, colorScheme: t.scheme })
  return <View testID={testID}>{elements}</View>
}
