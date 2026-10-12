import { colors, fontPostScriptNames, fonts } from '@datum-cloud/datum-ui-tokens'
import { render, screen } from '@testing-library/react-native'
import { Text as RNText } from 'react-native'
import { datumFontFiles, datumFonts, platformFonts, resolveFontFamily } from '../../theme/fonts'
import { DatumThemeProvider, useDatumTheme } from '../../theme/theme'

function Probe() {
  const t = useDatumTheme()
  return <RNText testID="probe">{`${t.scheme}|${t.colors.background}|${t.fonts.title}|${t.radius.md}`}</RNText>
}

describe('datumThemeProvider', () => {
  it.each(['light', 'dark'] as const)('exposes the %s tokens', async (scheme) => {
    await render(<DatumThemeProvider scheme={scheme}><Probe /></DatumThemeProvider>)
    expect(screen.getByTestId('probe')).toHaveTextContent(
      `${scheme}|${colors[scheme].background}|${platformFonts.title}|6`,
    )
  })

  it('follows the system appearance by default and without a provider', async () => {
    // jest-expo's react-native mock reports a light appearance
    await render(<DatumThemeProvider><Probe /></DatumThemeProvider>)
    expect(screen.getByTestId('probe')).toHaveTextContent(/^light\|/)
    await render(<Probe />)
    expect(screen.getByTestId('probe')).toHaveTextContent(/^light\|/)
  })
})

describe('fonts', () => {
  it('resolves token names to PostScript names on iOS', () => {
    expect(resolveFontFamily(fonts.sans.regular)).toBe(fontPostScriptNames['AllianceNo1-Regular'])
    expect(platformFonts.title).toBe('CanelaTextLCWeb-Regular')
    expect(resolveFontFamily('Unknown-Font')).toBe('Unknown-Font')
  })

  it('maps every resolved family to a bundled font file', () => {
    expect(Object.keys(datumFonts).sort()).toEqual([
      platformFonts.sans.medium,
      platformFonts.sans.regular,
      platformFonts.sans.semibold,
      platformFonts.title,
    ].sort())
    expect(datumFontFiles).toHaveLength(4)
  })
})
