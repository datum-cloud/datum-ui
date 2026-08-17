'use client'

import type { useMap, useMapEvents } from 'react-leaflet'

// Shared references to react-leaflet's hooks. Populated by the
// LeafletMapContainer lazy factory (in ./lazy) before any child control can
// call them: MapContainer only renders its children after mount, so these are
// guaranteed defined by the time any control invokes them. This removes the
// fire-and-forget race where a slow chunk left them undefined and crashed the
// map tree.
//
// Kept as a private holder (not `export let`) to avoid a mutable export, and
// the accessor proxies are underscore-prefixed so react-hooks lint does not
// treat them as hooks — matching the original module-scope pattern.
const holder: {
  map?: typeof useMap
  mapEvents?: typeof useMapEvents
} = {}

function setLeafletHooks(map: typeof useMap, mapEvents: typeof useMapEvents) {
  holder.map = map
  holder.mapEvents = mapEvents
}

function _useMap() {
  return holder.map!()
}

function _useMapEvents(handlers: Parameters<typeof useMapEvents>[0]) {
  return holder.mapEvents!(handlers)
}

export { _useMap, _useMapEvents, setLeafletHooks }
