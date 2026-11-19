/// <reference types="@testing-library/jest-dom/vitest" />
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MapFullscreenControl, MapLocateControl, MapZoomControl } from '../index'

// A Leaflet map stand-in: the controls only call these methods and listen to
// these events, so the tests drive them directly without a real map.
const handlers = new Map<string, (event?: unknown) => void>()
const fakeMap = {
  zoom: 10,
  getZoom: () => fakeMap.zoom,
  getMaxZoom: () => 18,
  getMinZoom: () => 0,
  zoomIn: vi.fn(),
  zoomOut: vi.fn(),
  locate: vi.fn(),
  stopLocate: vi.fn(),
  toggleFullscreen: vi.fn(),
  on: vi.fn((event: string, handler: (event?: unknown) => void) => {
    handlers.set(event, handler)
  }),
  off: vi.fn(),
}
let zoomEvents: Record<string, () => void> = {}

class FakeFullScreenControl {
  addTo() {
    return this
  }

  getContainer() {
    return document.createElement('div')
  }

  remove() {}
}

// `shared` and `hooks` are modules the @repo/shadcn exports map does not
// expose, so they are mocked by path, as map-tile-layer.test.tsx does.
vi.mock('../../../../../../shadcn/ui/map/shared', () => ({
  _useMap: () => fakeMap,
  _useMapEvents: (events: Record<string, () => void>) => {
    zoomEvents = events
    return fakeMap
  },
}))
vi.mock('../../../../../../shadcn/ui/map/hooks', async importOriginal => ({
  ...(await importOriginal<Record<string, unknown>>()),
  useLeaflet: () => ({
    L: {
      Control: { FullScreen: FakeFullScreenControl },
      // MapControlContainer stops clicks and scrolls on a control reaching the map.
      DomEvent: { disableClickPropagation: () => {}, disableScrollPropagation: () => {} },
      // The locate control marks the found location with a div icon.
      divIcon: (options: unknown) => options,
    },
  }),
}))

beforeEach(() => {
  vi.clearAllMocks()
  handlers.clear()
  fakeMap.zoom = 10
})

describe('mapZoomControl', () => {
  it('zooms in and out', async () => {
    render(<MapZoomControl />)
    await userEvent.click(screen.getByRole('button', { name: /zoom in/i }))
    await userEvent.click(screen.getByRole('button', { name: /zoom out/i }))
    expect(fakeMap.zoomIn).toHaveBeenCalledTimes(1)
    expect(fakeMap.zoomOut).toHaveBeenCalledTimes(1)
  })

  it('disables zoom in at the maximum zoom', () => {
    fakeMap.zoom = 18
    render(<MapZoomControl />)
    expect(screen.getByRole('button', { name: /zoom in/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /zoom out/i })).toBeEnabled()
  })

  it('follows the map when its zoom changes', () => {
    render(<MapZoomControl />)
    fakeMap.zoom = 0
    act(() => zoomEvents.zoomend?.())
    expect(screen.getByRole('button', { name: /zoom out/i })).toBeDisabled()
  })
})

describe('mapLocateControl', () => {
  it('asks the map to locate the person and reports the location', async () => {
    const onLocationFound = vi.fn()
    render(<MapLocateControl onLocationFound={onLocationFound} />)
    await userEvent.click(screen.getByRole('button'))
    expect(fakeMap.locate).toHaveBeenCalledWith(expect.objectContaining({ setView: true, maxZoom: 18 }))
    const found = { latlng: { lat: 52.5, lng: 13.4 }, accuracy: 10 }
    act(() => handlers.get('locationfound')?.(found))
    expect(onLocationFound).toHaveBeenCalledWith(found)
  })

  it('reports a location error', async () => {
    const onLocationError = vi.fn()
    render(<MapLocateControl onLocationError={onLocationError} />)
    await userEvent.click(screen.getByRole('button'))
    const error = { message: 'denied', code: 1 }
    act(() => handlers.get('locationerror')?.(error))
    expect(onLocationError).toHaveBeenCalledWith(error)
  })
})

describe('mapFullscreenControl', () => {
  it('toggles fullscreen and follows the map\'s fullscreen events', async () => {
    render(<MapFullscreenControl />)
    await userEvent.click(screen.getByRole('button', { name: 'Enter fullscreen' }))
    expect(fakeMap.toggleFullscreen).toHaveBeenCalledTimes(1)
    act(() => handlers.get('enterFullscreen')?.())
    expect(screen.getByRole('button', { name: 'Exit fullscreen' })).toBeInTheDocument()
    act(() => handlers.get('exitFullscreen')?.())
    expect(screen.getByRole('button', { name: 'Enter fullscreen' })).toBeInTheDocument()
  })
})
