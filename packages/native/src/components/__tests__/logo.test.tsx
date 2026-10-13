import { screen } from '@testing-library/react-native'

import { LOGO_TONES, LogoFlat, LogoIcon, LogoStacked, LogoText } from '../logo/logo'
import { FLAT, ICON, STACKED, TEXT } from '../logo/paths'

import { renderIn, SCHEMES } from './helpers'

const webLogos = { read: require('../../../test/logo-source.cjs').readWebLogo }

describe('logo paths', () => {
  it.each([
    ['logo-icon.tsx', ICON],
    ['logo-flat.tsx', FLAT],
    ['logo-stacked.tsx', STACKED],
    ['logo-text.tsx', TEXT],
  ])('%s matches the web component exactly', (file, art) => {
    const web = webLogos.read(file)
    expect(art.viewBox).toBe(web.viewBox)
    expect(art.paths).toEqual(web.paths)
  })
})

describe.each(SCHEMES)('logo (%s)', (scheme) => {
  it('renders each lockup at the requested size', async () => {
    const ui = (
      <>
        <LogoIcon testID="icon" size={40} />
        <LogoFlat testID="flat" height={20} />
        <LogoStacked testID="stacked" width={82} />
        <LogoText testID="text" tone="white" />
      </>
    )
    await renderIn(scheme, ui)
    expect(screen.getByTestId('icon').props).toMatchObject({ width: 40, height: 40 })
    expect(screen.getByTestId('flat').props.height).toBe(20)
    expect(screen.getByTestId('flat').props.width).toBeCloseTo(20 * (742 / 148))
    expect(screen.getByTestId('stacked').props).toMatchObject({ width: 82, height: 67 })
    expect(screen.getAllByLabelText('Datum')).toHaveLength(4)
  })

  it('defaults to the scheme-appropriate tone', async () => {
    await renderIn(scheme, <LogoFlat testID="flat" />)
    const tone = scheme === 'dark' ? LOGO_TONES['mono-light'] : LOGO_TONES.brand
    // react-native-svg serialises fills as ARGB integers
    const argb = (hex: string) => 0xFF000000 + Number.parseInt(hex.slice(1), 16)
    const fills = new Set<number>()
    const walk = (node: unknown): void => {
      if (!node || typeof node !== 'object')
        return
      const n = node as { type?: string, props?: { fill?: { payload?: number } }, children?: unknown[] }
      if (n.type === 'RNSVGPath' && n.props?.fill?.payload !== undefined)
        fills.add(n.props.fill.payload)
      n.children?.forEach(walk)
    }
    walk(screen.toJSON())
    expect([...fills].sort()).toEqual([argb(tone.mark), argb(tone.text)].sort())
  })

  it('hides decorative logos from accessibility', async () => {
    await renderIn(scheme, <LogoIcon decorative />)
    expect(screen.queryByLabelText('Datum')).toBeNull()
  })
})
