'use client'

// Barrel for the map subsystem. The implementation is split under ./map/* by
// concern (lazy react-leaflet wrappers, primitives, layers, controls, draw) to
// keep each module focused; this file re-exports the public component surface
// so consumers keep importing from `@repo/shadcn/ui/map`.
export {
  MapControlContainer,
  MapFullscreenControl,
  MapLocateControl,
  MapSearchControl,
  MapZoomControl,
} from './map/controls'
export {
  MapDrawCircle,
  MapDrawControl,
  MapDrawDelete,
  MapDrawEdit,
  MapDrawMarker,
  MapDrawPolygon,
  MapDrawPolyline,
  MapDrawRectangle,
  MapDrawUndo,
} from './map/draw'
export { useLeaflet } from './map/hooks'
export {
  MapFeatureGroup,
  MapLayerGroup,
  MapLayers,
  MapLayersControl,
  MapTileLayer,
} from './map/layers'
export { Map } from './map/lazy'
export {
  MapCircle,
  MapCircleMarker,
  MapMarker,
  MapMarkerClusterGroup,
  MapPolygon,
  MapPolyline,
  MapPopup,
  MapRectangle,
  MapTooltip,
} from './map/primitives'
