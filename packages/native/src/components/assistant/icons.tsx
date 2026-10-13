import type { StyleProp, ViewStyle } from 'react-native'
import Svg, { Path, Rect } from 'react-native-svg'
import { BRAIN_GLYPH } from './brain-path'

/**
 * The handful of line icons the assistant uses, drawn with react-native-svg
 * from the same Lucide glyphs the web assistant imports (24×24, 2px stroke),
 * so the package needs no icon font.
 */
export type AssistantIconName = 'arrow-up' | 'arrow-down' | 'arrow-right' | 'square' | 'copy' | 'check' | 'share' | 'brain' | 'chevron-down' | 'rotate-cw'

export interface AssistantIconProps {
  name: AssistantIconName
  size?: number
  color: string
  strokeWidth?: number
  style?: StyleProp<ViewStyle>
}

export function AssistantIcon({ name, size = 16, color, strokeWidth = 2, style }: AssistantIconProps) {
  const stroke = { stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' }
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {name === 'arrow-up' && (
        <>
          <Path d="m5 12 7-7 7 7" {...stroke} />
          <Path d="M12 19V5" {...stroke} />
        </>
      )}
      {name === 'arrow-down' && (
        <>
          <Path d="M12 5v14" {...stroke} />
          <Path d="m19 12-7 7-7-7" {...stroke} />
        </>
      )}
      {name === 'arrow-right' && (
        <>
          <Path d="M5 12h14" {...stroke} />
          <Path d="m12 5 7 7-7 7" {...stroke} />
        </>
      )}
      {name === 'square' && <Rect x={5} y={5} width={14} height={14} rx={2} fill={color} />}
      {name === 'copy' && (
        <>
          <Rect x={8} y={8} width={14} height={14} rx={2} {...stroke} />
          <Path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" {...stroke} />
        </>
      )}
      {name === 'check' && <Path d="M20 6 9 17l-5-5" {...stroke} />}
      {name === 'share' && (
        <>
          <Path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" {...stroke} />
          <Path d="m16 6-4-4-4 4" {...stroke} />
          <Path d="M12 2v13" {...stroke} />
        </>
      )}
      {name === 'chevron-down' && <Path d="m6 9 6 6 6-6" {...stroke} />}
      {name === 'rotate-cw' && (
        <>
          <Path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" {...stroke} />
          <Path d="M21 3v5h-5" {...stroke} />
        </>
      )}
      {name === 'brain' && (
        <>
          <Path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" {...stroke} />
          <Path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" {...stroke} />
          <Path d="M12 5v13" {...stroke} />
        </>
      )}
    </Svg>
  )
}

export interface BrainGlyphProps {
  size?: number
  /** Overrides the scheme colour (canyon-clay in light, aurora-moss in dark). */
  color?: string
  scheme?: 'light' | 'dark'
  style?: StyleProp<ViewStyle>
  testID?: string
}

/**
 * Decorative brain/sunburst glyph for the assistant's empty-state greeting,
 * ported from the web `BrainGlyph`. It follows the Datum logo's theming.
 */
export function BrainGlyph({ size = 64, color, scheme = 'light', style, testID }: BrainGlyphProps) {
  return (
    <Svg
      testID={testID}
      width={size}
      height={size}
      viewBox={BRAIN_GLYPH.viewBox}
      fill="none"
      style={style}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Path fillRule="evenodd" clipRule="evenodd" d={BRAIN_GLYPH.d} fill={color ?? BRAIN_GLYPH.colors[scheme]} />
    </Svg>
  )
}
