// SSR-safe: only loaded via dynamic import() — never at the top level.
// Leaflet accesses `window` at module evaluation time, so these imports
// must be deferred until we know we're running in a browser.

import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet.fullscreen/dist/Control.FullScreen.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'

export { useMap, useMapEvents } from 'react-leaflet'
