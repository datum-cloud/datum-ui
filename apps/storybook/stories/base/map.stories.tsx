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
  MapPolygon,
  MapPolyline,
  MapPopup,
  MapRectangle,
  MapTileLayer,
  MapTooltip,
  MapZoomControl,
} from '@datum-cloud/datum-ui'

const LONDON: [number, number] = [51.505, -0.09]

const meta: Meta<typeof Map> = {
  title: 'Base/Map',
  component: Map,
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
  render: () => (
    <Map center={LONDON} zoom={13} className="h-full w-full">
      <MapTileLayer />
      <MapZoomControl />
      <MapMarker position={LONDON} />
    </Map>
  ),
}

export const WithMarkers: Story = {
  render: () => (
    <Map center={LONDON} zoom={13} className="h-full w-full">
      <MapTileLayer />
      <MapZoomControl />

      <MapMarker position={[51.505, -0.09]}>
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
        <MapTooltip side="right">Secondary</MapTooltip>
      </MapMarker>

      <MapMarker position={[51.515, -0.08]}>
        <MapTooltip side="bottom">Warehouse</MapTooltip>
      </MapMarker>
    </Map>
  ),
}

export const WithLayersControl: Story = {
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
          <MapMarker position={[51.505, -0.09]}>
            <MapTooltip>HQ</MapTooltip>
          </MapMarker>
          <MapMarker position={[51.51, -0.1]}>
            <MapTooltip>Branch</MapTooltip>
          </MapMarker>
        </MapLayerGroup>

        <MapLayerGroup name="Zones">
          <MapCircle center={[51.505, -0.09]} radius={400} />
          <MapCircle center={[51.51, -0.1]} radius={300} />
        </MapLayerGroup>
      </MapLayers>
    </Map>
  ),
}

export const WithDrawingTools: Story = {
  render: () => (
    <Map center={LONDON} zoom={13} className="h-full w-full">
      <MapTileLayer />
      <MapZoomControl />
      <MapDrawControl>
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

export const WithShapes: Story = {
  render: () => (
    <Map center={LONDON} zoom={14} className="h-full w-full">
      <MapTileLayer />
      <MapZoomControl />

      <MapCircle center={[51.505, -0.09]} radius={200} />

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

export const FullFeatured: Story = {
  render: () => (
    <Map center={LONDON} zoom={13} className="h-full w-full">
      <MapLayers defaultLayerGroups={['Markers']}>
        <MapTileLayer name="Default" />
        <MapLayersControl position="top-1 right-12" />
        <MapZoomControl />
        <MapFullscreenControl position="top-1 right-1" />

        <MapLayerGroup name="Markers">
          <MapMarker position={[51.505, -0.09]}>
            <MapPopup>
              <p className="font-medium">Central Point</p>
            </MapPopup>
          </MapMarker>
          <MapMarker position={[51.51, -0.1]} />
        </MapLayerGroup>

        <MapLayerGroup name="Shapes">
          <MapCircle center={[51.505, -0.09]} radius={300} />
          <MapPolygon
            positions={[
              [51.509, -0.08],
              [51.503, -0.06],
              [51.51, -0.047],
            ]}
          />
        </MapLayerGroup>
      </MapLayers>

      <MapDrawControl>
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
