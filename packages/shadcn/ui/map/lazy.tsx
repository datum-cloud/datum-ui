'use client'

import type { LatLngExpression, Map as LeafletMap } from 'leaflet'
import type { ComponentProps, ComponentType, Ref } from 'react'
import type { MapContainerProps } from 'react-leaflet'
import { cn } from '@repo/shadcn/lib/utils'
import { lazy, Suspense, useEffect, useState } from 'react'
import { setLeafletHooks } from './shared'

function createLazyComponent<T extends ComponentType<any>>(factory: () => Promise<{ default: T }>) {
  const LazyComponent = lazy(factory)

  return (props: ComponentProps<T>) => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
      setIsMounted(true)
    }, [])

    if (!isMounted) {
      return null
    }

    return (
      <Suspense>
        <LazyComponent {...props} />
      </Suspense>
    )
  }
}

const LeafletMapContainer = createLazyComponent(async () => {
  // Load react-leaflet and the leaflet CSS/plugin bundle together, then assign
  // the shared hook refs. Children of MapContainer only render after it mounts,
  // so the shared _useMap/_useMapEvents proxies are guaranteed defined by the
  // time any control calls them — this removes the fire-and-forget race where a
  // slow chunk left them undefined and crashed the map tree.
  const [reactLeaflet] = await Promise.all([
    import('react-leaflet'),
    import('../map-leaflet-imports'),
  ])
  setLeafletHooks(reactLeaflet.useMap, reactLeaflet.useMapEvents)
  return { default: reactLeaflet.MapContainer }
})
const LeafletTileLayer = createLazyComponent(() =>
  import('react-leaflet').then(mod => ({
    default: mod.TileLayer,
  })),
)
const LeafletMarker = createLazyComponent(() =>
  import('react-leaflet').then(mod => ({
    default: mod.Marker,
  })),
)
const LeafletPopup = createLazyComponent(() =>
  import('react-leaflet').then(mod => ({
    default: mod.Popup,
  })),
)
const LeafletTooltip = createLazyComponent(() =>
  import('react-leaflet').then(mod => ({
    default: mod.Tooltip,
  })),
)
const LeafletCircle = createLazyComponent(() =>
  import('react-leaflet').then(mod => ({
    default: mod.Circle,
  })),
)
const LeafletCircleMarker = createLazyComponent(() =>
  import('react-leaflet').then(mod => ({
    default: mod.CircleMarker,
  })),
)
const LeafletPolyline = createLazyComponent(() =>
  import('react-leaflet').then(mod => ({
    default: mod.Polyline,
  })),
)
const LeafletPolygon = createLazyComponent(() =>
  import('react-leaflet').then(mod => ({
    default: mod.Polygon,
  })),
)
const LeafletRectangle = createLazyComponent(() =>
  import('react-leaflet').then(mod => ({
    default: mod.Rectangle,
  })),
)
const LeafletLayerGroup = createLazyComponent(() =>
  import('react-leaflet').then(mod => ({
    default: mod.LayerGroup,
  })),
)
const LeafletFeatureGroup = createLazyComponent(() =>
  import('react-leaflet').then(mod => ({
    default: mod.FeatureGroup,
  })),
)
const LeafletMarkerClusterGroup = createLazyComponent(async () =>
  import('react-leaflet-markercluster').then(mod => ({
    default: mod.default,
  })),
)

function Map({
  zoom = 15,
  maxZoom = 18,
  className,
  ...props
}: Omit<MapContainerProps, 'zoomControl'> & {
  center: LatLngExpression
  ref?: Ref<LeafletMap>
}) {
  return (
    <LeafletMapContainer
      zoom={zoom}
      maxZoom={maxZoom}
      attributionControl={false}
      zoomControl={false}
      className={cn('z-50 size-full min-h-96 flex-1 rounded-md', className)}
      {...props}
    />
  )
}

export {
  LeafletCircle,
  LeafletCircleMarker,
  LeafletFeatureGroup,
  LeafletLayerGroup,
  LeafletMarker,
  LeafletMarkerClusterGroup,
  LeafletPolygon,
  LeafletPolyline,
  LeafletPopup,
  LeafletRectangle,
  LeafletTileLayer,
  LeafletTooltip,
  Map,
}
