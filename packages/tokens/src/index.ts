import {
  colors,
  fontFiles,
  fontPostScriptNames,
  fonts,
  motion,
  palette,
  radius,
  radiusScale,
  spacing,
  typography,
} from './tokens.gen'

export { parseRgba, withAlpha } from './color'
export {
  colors,
  fontFiles,
  fontPostScriptNames,
  fonts,
  motion,
  palette,
  radius,
  radiusScale,
  spacing,
  typography,
}
export type { ColorScheme, SemanticColors } from './tokens.gen'

export type Palette = typeof palette
export type Spacing = typeof spacing
export type Radius = typeof radius
export type RadiusScale = typeof radiusScale
export type Typography = typeof typography
export type TypeSize = keyof typeof typography.sizes
export type Fonts = typeof fonts
export type FontFamilyName = keyof typeof fontFiles
export type Motion = typeof motion

/** Every token group in one object. */
export const tokens: {
  palette: Palette
  colors: typeof colors
  spacing: Spacing
  radius: Radius
  radiusScale: RadiusScale
  typography: Typography
  fonts: Fonts
  fontFiles: typeof fontFiles
  fontPostScriptNames: typeof fontPostScriptNames
  motion: Motion
} = {
  palette,
  colors,
  spacing,
  radius,
  radiusScale,
  typography,
  fonts,
  fontFiles,
  fontPostScriptNames,
  motion,
}
