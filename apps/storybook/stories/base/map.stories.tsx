import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import {
  Map,
  MapCircle,
  MapDrawCircle,
  MapDrawControl,
  MapDrawDelete,
  MapDrawEdit,
  MapDrawMarker,
  MapDrawPolygon,
  MapDrawPolyline,
  MapDrawRectangle,
  MapDrawUndo,
  MapFullscreenControl,
  MapLayerGroup,
  MapLayers,
  MapLayersControl,
  MapMarker,
  MapMarkerClusterGroup,
  MapPolygon,
  MapPolyline,
  MapPopup,
  MapRectangle,
  MapTileLayer,
  MapTooltip,
  MapZoomControl,
} from '@datum-cloud/datum-ui/map'

const LONDON: [number, number] = [51.505, -0.09]

const meta: Meta<typeof Map> = {
  title: 'Base/Map',
  component: Map,
  parameters: {
    docs: {
      description: {
        component:
          'Interactive map component built on React Leaflet.\n\n'
          + 'The `Map` component is a compound component built on React Leaflet. It provides '
          + 'theme-aware tile layers (auto-switching between light and dark), markers with popups '
          + 'and tooltips, shapes (circles, polygons, polylines, rectangles), a layer control '
          + 'system, drawing tools, marker clustering, fullscreen mode, geolocation, and a search '
          + 'control.\n\n'
          + 'All sub-components must be rendered inside `<Map>` — they use React Leaflet\'s '
          + 'internal map context.\n\n'
          + '**Dependencies:** `leaflet react-leaflet leaflet-draw leaflet.fullscreen leaflet.markercluster react-leaflet-markercluster`',
      },
    },
  },
  decorators: [
    Story => (
      <div className="h-[500px] w-full">
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof Map>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Basic map centered on London with a tile layer, zoom control, and a single marker.',
      },
    },
  },
  render: () => (
    <Map center={LONDON} zoom={13} className="h-full w-full">
      <MapTileLayer />
      <MapZoomControl />
      <MapMarker position={LONDON} />
    </Map>
  ),
}

export const WithMarkersPopupsTooltips: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Markers can contain a `MapPopup` (opens on click) and a `MapTooltip` (shown on hover). '
          + 'The `side` prop on `MapTooltip` controls placement relative to the marker.',
      },
    },
  },
  render: () => (
    <Map center={LONDON} zoom={13} className="h-full w-full">
      <MapTileLayer />
      <MapZoomControl />
      <MapMarker position={LONDON}>
        <MapPopup>
          <p className="font-medium">London HQ</p>
          <p className="text-muted-foreground text-sm">Main office location</p>
        </MapPopup>
        <MapTooltip side="top">London HQ</MapTooltip>
      </MapMarker>
      <MapMarker position={[51.51, -0.1]}>
        <MapPopup>
          <p className="font-medium">Secondary Office</p>
        </MapPopup>
      </MapMarker>
    </Map>
  ),
}

export const WithLayersControl: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `MapLayers` to provide layer context and `MapLayersControl` to toggle between tile '
          + 'layers and named overlay groups. `MapLayerGroup` wraps child features that can be '
          + 'toggled on/off independently.',
      },
    },
  },
  render: () => (
    <Map center={LONDON} zoom={13} className="h-full w-full">
      <MapLayers defaultLayerGroups={['Offices']}>
        <MapTileLayer name="Light" />
        <MapTileLayer
          name="Satellite"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="&copy; Esri"
        />
        <MapLayersControl />
        <MapZoomControl />
        <MapLayerGroup name="Offices">
          <MapMarker position={LONDON} />
        </MapLayerGroup>
        <MapLayerGroup name="Zones">
          <MapCircle center={LONDON} radius={500} />
        </MapLayerGroup>
      </MapLayers>
    </Map>
  ),
}

export const WithShapes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Overlay geometric shapes using `MapCircle`, `MapPolygon`, `MapPolyline`, and '
          + '`MapRectangle`. All shape components accept standard Leaflet path options via props.',
      },
    },
  },
  render: () => (
    <Map center={LONDON} zoom={13} className="h-full w-full">
      <MapTileLayer />
      <MapZoomControl />
      <MapCircle center={LONDON} radius={300} />
      <MapPolygon
        positions={[
          [51.509, -0.08],
          [51.503, -0.06],
          [51.51, -0.047],
        ]}
      />
      <MapPolyline
        positions={[
          [51.505, -0.09],
          [51.51, -0.1],
          [51.51, -0.12],
        ]}
      />
      <MapRectangle
        bounds={[
          [51.49, -0.08],
          [51.5, -0.06],
        ]}
      />
    </Map>
  ),
}

export const WithDrawingTools: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Add `MapDrawControl` with drawing tool buttons as children to enable an interactive '
          + 'drawing toolbar. The `onLayersChange` callback fires whenever drawn layers are added, '
          + 'edited, or deleted.',
      },
    },
  },
  render: () => (
    <Map center={LONDON} zoom={13} className="h-full w-full">
      <MapTileLayer />
      <MapZoomControl />
      <MapDrawControl onLayersChange={() => {}}>
        <MapDrawMarker />
        <MapDrawPolyline />
        <MapDrawCircle />
        <MapDrawRectangle />
        <MapDrawPolygon />
        <MapDrawEdit />
        <MapDrawDelete />
        <MapDrawUndo />
      </MapDrawControl>
    </Map>
  ),
}

export const WithFullscreen: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Add `MapFullscreenControl` to show a button that toggles the map into fullscreen mode.',
      },
    },
  },
  render: () => (
    <Map center={LONDON} zoom={13} className="h-full w-full">
      <MapTileLayer />
      <MapZoomControl />
      <MapFullscreenControl />
    </Map>
  ),
}

export const WithMarkerClustering: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Wrap markers in `MapMarkerClusterGroup` to automatically cluster nearby markers as '
          + 'the user zooms out. Clusters expand when clicked or when the zoom level increases.',
      },
    },
  },
  render: () => {
    const points: [number, number][] = [
      [51.505, -0.09],
      [51.51, -0.1],
      [51.51, -0.12],
      [51.49, -0.08],
      [51.5, -0.06],
      [51.515, -0.09],
    ]
    return (
      <Map center={LONDON} zoom={12} className="h-full w-full">
        <MapTileLayer />
        <MapZoomControl />
        <MapMarkerClusterGroup>
          {points.map(([lat, lng], i) => (
            <MapMarker key={i} position={[lat, lng]} />
          ))}
        </MapMarkerClusterGroup>
      </Map>
    )
  },
}
