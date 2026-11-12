import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ThemeProvider } from '../../../themes'
import { MapTileLayer } from '../index'

// react-leaflet needs a real map; render the tile layer as a plain element that
// exposes the URL the layer resolved for the current theme.
vi.mock('@repo/shadcn/ui/map/lazy', () => ({
  LeafletTileLayer: ({ url }: { url: string }) => <div data-testid="tile-layer" data-url={url} />,
  LeafletLayerGroup: () => null,
  LeafletFeatureGroup: () => null,
}))
// `shared` is a .ts module the @repo/shadcn exports map does not expose, so it
// is mocked by path.
vi.mock('../../../../../../shadcn/ui/map/shared', () => ({
  _useMap: () => ({}),
}))

const LIGHT_URL = 'https://tiles.test/light/{z}/{x}/{y}.png'
const DARK_URL = 'https://tiles.test/dark/{z}/{x}/{y}.png'

/** Make `prefers-color-scheme: dark` report the given OS preference. */
function stubSystemTheme(systemTheme: 'light' | 'dark') {
  vi.spyOn(window, 'matchMedia').mockImplementation(query => ({
    matches: systemTheme === 'dark',
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }))
}

function tileUrl() {
  return screen.getByTestId('tile-layer').getAttribute('data-url')
}

afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
  document.documentElement.className = ''
  document.documentElement.removeAttribute('data-theme')
  document.documentElement.style.colorScheme = ''
})

describe('mapTileLayer', () => {
  it('uses the light tiles when the theme is light, even on a dark OS', () => {
    stubSystemTheme('dark')
    render(
      <ThemeProvider defaultTheme="light">
        <MapTileLayer url={LIGHT_URL} darkUrl={DARK_URL} />
      </ThemeProvider>,
    )

    expect(tileUrl()).toBe(LIGHT_URL)
  })

  it('uses the dark tiles when the theme is dark, even on a light OS', () => {
    stubSystemTheme('light')
    render(
      <ThemeProvider defaultTheme="dark">
        <MapTileLayer url={LIGHT_URL} darkUrl={DARK_URL} />
      </ThemeProvider>,
    )

    expect(tileUrl()).toBe(DARK_URL)
  })

  it('follows a dark OS preference when the theme is system', () => {
    stubSystemTheme('dark')
    render(
      <ThemeProvider defaultTheme="system">
        <MapTileLayer url={LIGHT_URL} darkUrl={DARK_URL} />
      </ThemeProvider>,
    )

    expect(tileUrl()).toBe(DARK_URL)
  })

  it('follows a light OS preference when the theme is system', () => {
    stubSystemTheme('light')
    render(
      <ThemeProvider defaultTheme="system">
        <MapTileLayer url={LIGHT_URL} darkUrl={DARK_URL} />
      </ThemeProvider>,
    )

    expect(tileUrl()).toBe(LIGHT_URL)
  })

  it('lets an explicit theme prop win over the provider', () => {
    stubSystemTheme('light')
    render(
      <ThemeProvider defaultTheme="light">
        <MapTileLayer url={LIGHT_URL} darkUrl={DARK_URL} theme="dark" />
      </ThemeProvider>,
    )

    expect(tileUrl()).toBe(DARK_URL)
  })

  it('reads data-theme from <html> when there is no provider', async () => {
    stubSystemTheme('light')
    document.documentElement.setAttribute('data-theme', 'dark')
    render(<MapTileLayer url={LIGHT_URL} darkUrl={DARK_URL} />)

    expect(tileUrl()).toBe(DARK_URL)

    // The fallback keeps watching the attribute the provider would write.
    await act(async () => {
      document.documentElement.setAttribute('data-theme', 'light')
      await Promise.resolve()
    })

    expect(tileUrl()).toBe(LIGHT_URL)
  })
})
