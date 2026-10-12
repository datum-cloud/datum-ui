import type { ReactNode } from 'react'
import type { ImageSourcePropType, ImageStyle, StyleProp, ViewStyle } from 'react-native'
import { Image, View } from 'react-native'
import { useDatumTheme } from '../theme/theme'
import { Text } from './text'

// Metro asset requires (copied from datum-ui by scripts/copy-assets.mjs).
const SCENES = {
  bottomLeft: require('../../assets/scene-5.png'),
  bottomRight: require('../../assets/scene-6.png'),
  topRight: require('../../assets/scene-7.png'),
} as const

export interface EmptyContentProps {
  title: string
  description?: string
  /** Optional illustration shown above the title (e.g. a cloud-portal scene). */
  image?: ImageSourcePropType
  imageStyle?: StyleProp<ImageStyle>
  /** A Button or any node, rendered under the text. */
  action?: ReactNode
  /** Frame style, as on the web. Defaults to `default`. */
  variant?: 'default' | 'dashed' | 'minimal'
  /** The corner scene artwork from the web EmptyContent. Defaults to true. */
  decorations?: boolean
  style?: StyleProp<ViewStyle>
  testID?: string
}

/** Empty state: a centred card over the Datum corner scenes — the web `EmptyContent`. */
export function EmptyContent({
  title,
  description,
  image,
  imageStyle,
  action,
  variant = 'default',
  decorations = true,
  style,
  testID,
}: EmptyContentProps) {
  const t = useDatumTheme()
  const dark = t.scheme === 'dark'

  const frame: ViewStyle = {
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 226,
    paddingVertical: 28,
    paddingHorizontal: 24,
    backgroundColor: dark ? 'transparent' : '#F4F3F2',
    ...(variant === 'minimal'
      ? {}
      : {
          borderRadius: t.radiusScale.lg,
          borderWidth: 1,
          borderColor: t.colors.border,
          borderStyle: variant === 'dashed' ? 'dashed' : 'solid',
        }),
  }

  return (
    <View testID={testID} style={[frame, style]}>
      {decorations
        ? (
            <>
              <Image
                source={SCENES.bottomLeft}
                accessibilityElementsHidden
                importantForAccessibility="no"
                resizeMode="contain"
                style={{ position: 'absolute', left: 0, bottom: 0, width: '33%', maxWidth: 230, aspectRatio: 450 / 354 }}
              />
              <Image
                source={SCENES.bottomRight}
                accessibilityElementsHidden
                importantForAccessibility="no"
                resizeMode="contain"
                style={{ position: 'absolute', right: 0, bottom: 0, width: '33%', maxWidth: 200, aspectRatio: 498 / 198 }}
              />
              <Image
                source={SCENES.topRight}
                accessibilityElementsHidden
                importantForAccessibility="no"
                resizeMode="contain"
                style={{ position: 'absolute', right: 16, top: 0, width: '33%', maxWidth: 280, aspectRatio: 319 / 123 }}
              />
            </>
          )
        : null}

      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          gap: 14,
          maxWidth: 260,
          paddingVertical: 28,
          paddingHorizontal: 24,
          borderRadius: t.radiusScale.lg,
          borderWidth: 1,
          borderColor: t.colors.border,
          backgroundColor: dark ? t.colors.background : '#FFFFFF',
        }}
      >
        {image
          ? <Image source={image} resizeMode="contain" style={[{ width: 120, height: 90 }, imageStyle]} />
          : null}
        <Text size="sm" style={{ textAlign: 'center' }} accessibilityRole="header">{title}</Text>
        {description ? <Text size="xs" tone="muted" style={{ textAlign: 'center' }}>{description}</Text> : null}
        {action ? <View style={{ alignItems: 'center', gap: 6 }}>{action}</View> : null}
      </View>
    </View>
  )
}
