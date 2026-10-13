import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native'
import { useEffect, useState } from 'react'
import { Image, Text as RNText, View } from 'react-native'
import { useDatumTheme } from '../theme/theme'
import { fontFor } from './text'

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

const SIZE: Record<AvatarSize, number> = { sm: 24, md: 32, lg: 40, xl: 56 }

/** "Ada Lovelace" -> "AL", "ada" -> "A", "ada.lovelace@x.io" -> "AL". */
export function initials(name: string): string {
  const base = name.includes('@') ? name.split('@')[0]! : name
  const words = base.split(/[\s._-]+/).filter(Boolean)
  if (words.length === 0)
    return '?'
  const first = words[0]![0] ?? ''
  const last = words.length > 1 ? (words.at(-1)![0] ?? '') : ''
  return (first + last).toUpperCase()
}

export interface AvatarProps {
  /** Used for the initials fallback and the accessibility label. */
  name: string
  /** Image URL or require()'d source. Falls back to initials if missing or it fails to load. */
  src?: string | ImageSourcePropType
  /** `md` (32) by default, or a size in px. */
  size?: AvatarSize | number
  style?: StyleProp<ViewStyle>
  testID?: string
}

export function Avatar({ name, src, size = 'md', style, testID }: AvatarProps) {
  const t = useDatumTheme()
  const px = typeof size === 'number' ? size : SIZE[size]
  const [failed, setFailed] = useState(false)
  const source = typeof src === 'string' ? { uri: src } : src
  useEffect(() => setFailed(false), [typeof src === 'string' ? src : source])

  const showImage = source !== undefined && !failed
  return (
    <View
      testID={testID}
      accessibilityRole="image"
      accessibilityLabel={name}
      style={[
        {
          width: px,
          height: px,
          borderRadius: px / 2,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: t.colors.muted,
        },
        style,
      ]}
    >
      {showImage
        ? <Image source={source} onError={() => setFailed(true)} style={{ width: px, height: px }} />
        : (
            <RNText
              style={{
                color: t.colors.mutedForeground,
                fontFamily: fontFor(t, 'medium'),
                fontSize: Math.round(px * 0.4),
              }}
            >
              {initials(name)}
            </RNText>
          )}
    </View>
  )
}
