import type { FontFamilyName } from '@datum-cloud/datum-ui-tokens'
import { fontPostScriptNames, fonts as tokenFonts } from '@datum-cloud/datum-ui-tokens'
import { Platform } from 'react-native'

/**
 * Resolve a token font name to the family name React Native must use on this
 * platform.
 *
 * - iOS looks fonts up by the PostScript name stored in the file
 *   (`AllianceNo.1-Regular`), which is what the `expo-font` config plugin
 *   registers when it embeds the fonts.
 * - Android looks fonts up by file name (`AllianceNo1-Regular`).
 *
 * Runtime loading with `useFonts(datumFonts)` registers the same keys, so both
 * paths render identically.
 */
export function resolveFontFamily(name: string): string {
  if (Platform.OS === 'ios' && name in fontPostScriptNames)
    return fontPostScriptNames[name as FontFamilyName]
  return name
}

export interface DatumFonts {
  sans: { regular: string, medium: string, semibold: string }
  title: string
  mono: string
}

/** Platform-resolved font family names (what `useDatumTheme().fonts` returns). */
export const platformFonts: DatumFonts = {
  sans: {
    regular: resolveFontFamily(tokenFonts.sans.regular),
    medium: resolveFontFamily(tokenFonts.sans.medium),
    semibold: resolveFontFamily(tokenFonts.sans.semibold),
  },
  title: resolveFontFamily(tokenFonts.title),
  mono: Platform.select({ ios: tokenFonts.mono, default: 'monospace' }),
}

/**
 * Font map for `useFonts()` / `Font.loadAsync()` from `expo-font`, keyed by the
 * platform-resolved family name.
 *
 * Prefer embedding at build time with the `expo-font` config plugin (see the
 * README for the file paths); keep `useFonts(datumFonts)` as well and it
 * becomes a no-op on iOS once the fonts are embedded.
 */
export const datumFonts: Record<string, number> = {
  [platformFonts.sans.regular]: require('../../fonts/AllianceNo1-Regular.ttf'),
  [platformFonts.sans.medium]: require('../../fonts/AllianceNo1-Medium.ttf'),
  [platformFonts.sans.semibold]: require('../../fonts/AllianceNo1-SemiBold.ttf'),
  [platformFonts.title]: require('../../fonts/CanelaText-Regular.ttf'),
}

/**
 * Font files relative to the package root, for the `expo-font` config plugin:
 * `node_modules/@datum-cloud/datum-ui-native/<path>`.
 */
export const datumFontFiles: readonly string[] = [
  'fonts/AllianceNo1-Regular.ttf',
  'fonts/AllianceNo1-Medium.ttf',
  'fonts/AllianceNo1-SemiBold.ttf',
  'fonts/CanelaText-Regular.ttf',
]
