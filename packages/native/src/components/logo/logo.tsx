import type { StyleProp, ViewStyle } from 'react-native'
import type { LogoArt } from './paths'
import Svg, { Path } from 'react-native-svg'
import { useDatumTheme } from '../../theme/theme'
import { FLAT, ICON, STACKED, TEXT } from './paths'

/**
 * Colour treatments, matching the web `logo.styles.ts` tones:
 * - `brand`: rose mark + navy text
 * - `mono-light`: lime mark + white text (for dark surfaces)
 * - `mono-dark`: navy mark + navy text
 * - `white`: white mark + white text
 */
export type LogoTone = 'brand' | 'mono-light' | 'mono-dark' | 'white'

export const LOGO_TONES: Record<LogoTone, { mark: string, text: string }> = {
  'brand': { mark: '#BF9595', text: '#0C1D31' },
  'mono-light': { mark: '#E6F59F', text: '#FFFFFF' },
  'mono-dark': { mark: '#0C1D31', text: '#0C1D31' },
  'white': { mark: '#FFFFFF', text: '#FFFFFF' },
}

interface BaseLogoProps {
  /** Defaults to `brand` in light mode and `mono-light` in dark mode. */
  tone?: LogoTone
  /** Hide from screen readers (when next to a visible brand name). */
  decorative?: boolean
  /** Accessible name. Defaults to "Datum". */
  accessibilityLabel?: string
  style?: StyleProp<ViewStyle>
  testID?: string
}

function useTone(tone: LogoTone | undefined) {
  const { scheme } = useDatumTheme()
  return LOGO_TONES[tone ?? (scheme === 'dark' ? 'mono-light' : 'brand')]
}

function LogoSvg({
  art,
  width,
  height,
  tone,
  decorative,
  accessibilityLabel = 'Datum',
  style,
  testID,
}: BaseLogoProps & { art: LogoArt, width: number, height: number }) {
  const colors = useTone(tone)
  const a11y = decorative
    ? { accessibilityElementsHidden: true, importantForAccessibility: 'no-hide-descendants' as const }
    : { accessible: true, accessibilityRole: 'image' as const, accessibilityLabel }
  return (
    <Svg testID={testID} width={width} height={height} viewBox={art.viewBox} fill="none" style={style} {...a11y}>
      {art.paths.map(p => (
        <Path key={p.d.slice(0, 24)} d={p.d} fill={colors[p.slot]} />
      ))}
    </Svg>
  )
}

/** Resolve width/height from whichever is given, keeping the artwork's aspect ratio. */
function sized(art: LogoArt, width: number | undefined, height: number | undefined, defaultHeight: number) {
  const ratio = art.width / art.height
  if (width !== undefined && height === undefined)
    return { width, height: width / ratio }
  const h = height ?? defaultHeight
  return { width: width ?? h * ratio, height: h }
}

export interface LogoIconProps extends BaseLogoProps {
  /** Square size in px. Defaults to 32. */
  size?: number
}

/** The Datum "D" mark on its own. */
export function LogoIcon({ size = 32, ...props }: LogoIconProps) {
  return <LogoSvg art={ICON} width={size} height={size} {...props} />
}

export interface LogoLockupProps extends BaseLogoProps {
  /** Height in px; width follows the aspect ratio. */
  height?: number
  /** Width in px; height follows the aspect ratio when `height` is not set. */
  width?: number
}

/** Horizontal lockup: mark + "Datum" wordmark. Defaults to 24px tall. */
export function LogoFlat({ width, height, ...props }: LogoLockupProps) {
  return <LogoSvg art={FLAT} {...sized(FLAT, width, height, 24)} {...props} />
}

/** Stacked lockup: mark above the wordmark. Defaults to 48px tall. */
export function LogoStacked({ width, height, ...props }: LogoLockupProps) {
  return <LogoSvg art={STACKED} {...sized(STACKED, width, height, 48)} {...props} />
}

/** The "Datum" wordmark without the mark. Defaults to 20px tall. */
export function LogoText({ width, height, ...props }: LogoLockupProps) {
  return <LogoSvg art={TEXT} {...sized(TEXT, width, height, 20)} {...props} />
}
