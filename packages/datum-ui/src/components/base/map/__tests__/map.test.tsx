/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Map } from '../index'

// A smoke test with the real lazy modules: Leaflet renders into jsdom's DOM,
// so the map mounts without a browser. Controls and layers are tested with a
// fake map in map-controls.test.tsx and map-tile-layer.test.tsx.
describe('map', () => {
  it('loads Leaflet and renders the map with its children', async () => {
    const { container } = render(
      <Map center={[52.52, 13.405]} zoom={11}>
        <div data-testid="map-child" />
      </Map>,
    )
    expect(await screen.findByTestId('map-child', {}, { timeout: 5000 })).toBeInTheDocument()
    const mapElement = container.querySelector('.leaflet-container')
    expect(mapElement).not.toBeNull()
    expect(mapElement).toHaveClass('min-h-96')
  })
})
