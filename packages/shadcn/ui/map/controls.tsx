'use client'

import type { PlaceAutocompleteProps } from '@repo/shadcn/ui/place-autocomplete'
import type { ErrorEvent, LatLngExpression, LocateOptions, LocationEvent } from 'leaflet'
import type { ComponentProps, ComponentPropsWithoutRef } from 'react'
import { cn } from '@repo/shadcn/lib/utils'
import { Button } from '@repo/shadcn/ui/button'
import { ButtonGroup } from '@repo/shadcn/ui/button-group'
import { PlaceAutocomplete } from '@repo/shadcn/ui/place-autocomplete'
import {
  LoaderCircleIcon,
  MaximizeIcon,
  MinimizeIcon,
  MinusIcon,
  NavigationIcon,
  PlusIcon,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useDebounceLoadingState, useLeaflet } from './hooks'
import { MapMarker } from './primitives'
import { _useMap, _useMapEvents } from './shared'

function MapControlContainer({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  const { L } = useLeaflet()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!L)
      return
    const element = containerRef.current
    if (!element)
      return
    L.DomEvent.disableClickPropagation(element)
    L.DomEvent.disableScrollPropagation(element)
  }, [L])

  return (
    <div
      ref={containerRef}
      className={cn('absolute z-1000 size-fit cursor-default', className)}
      {...props}
    />
  )
}

function MapZoomControl({
  position = 'top-1 left-1',
  className,
  ...props
}: ComponentProps<'div'> & { position?: string }) {
  const map = _useMap()
  const [zoomLevel, setZoomLevel] = useState(map.getZoom())

  _useMapEvents({
    zoomend: () => {
      setZoomLevel(map.getZoom())
    },
  })

  return (
    <MapControlContainer className={cn(position, className)}>
      <ButtonGroup orientation="vertical" aria-label="Zoom controls" {...props}>
        <Button
          type="button"
          size="icon"
          variant="outline"
          aria-label="Zoom in"
          title="Zoom in"
          className="border"
          disabled={zoomLevel >= map.getMaxZoom()}
          onClick={() => map.zoomIn()}
        >
          <PlusIcon />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          aria-label="Zoom out"
          title="Zoom out"
          className="border"
          disabled={zoomLevel <= map.getMinZoom()}
          onClick={() => map.zoomOut()}
        >
          <MinusIcon />
        </Button>
      </ButtonGroup>
    </MapControlContainer>
  )
}

function MapFullscreenControl({
  position = 'top-1 right-1',
  className,
  ...props
}: ComponentProps<'button'> & { position?: string }) {
  const map = _useMap()
  const [isFullscreen, setIsFullscreen] = useState(false)

  const { L } = useLeaflet()

  useEffect(() => {
    if (!L)
      return

    const fullscreenControl = new L.Control.FullScreen()
    fullscreenControl.addTo(map)

    const container = fullscreenControl.getContainer()
    if (container) {
      container.style.display = 'none'
    }

    const handleEnter = () => setIsFullscreen(true)
    const handleExit = () => setIsFullscreen(false)

    map.on('enterFullscreen', handleEnter)
    map.on('exitFullscreen', handleExit)

    return () => {
      fullscreenControl.remove()
      map.off('enterFullscreen', handleEnter)
      map.off('exitFullscreen', handleExit)
    }
  }, [L, map])

  return (
    <MapControlContainer className={cn(position, className)}>
      <Button
        type="button"
        size="icon"
        variant="outline"
        // Gate on L: the leaflet.fullscreen plugin patches
        // L.Map.prototype.toggleFullscreen at module-eval time and useLeaflet()
        // only sets L after that import resolves. Clicking before then would
        // call an undefined map.toggleFullscreen and throw.
        disabled={!L}
        onClick={() => map.toggleFullscreen()}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        className="border"
        {...props}
      >
        {isFullscreen ? <MinimizeIcon /> : <MaximizeIcon />}
      </Button>
    </MapControlContainer>
  )
}

function MapLocatePulseIcon() {
  return (
    <div className="absolute -top-1 -right-1 flex size-3 rounded-full">
      <div className="bg-primary absolute inline-flex size-full animate-ping rounded-full opacity-75" />
      <div className="bg-primary relative inline-flex size-3 rounded-full" />
    </div>
  )
}

function MapLocateControl({
  watch = false,
  onLocationFound,
  onLocationError,
  position = 'right-1 bottom-1',
  className,
  ...props
}: ComponentProps<'button'>
  & Pick<LocateOptions, 'watch'> & {
    onLocationFound?: (location: LocationEvent) => void
    onLocationError?: (error: ErrorEvent) => void
  } & { position?: string }) {
  const map = _useMap()
  const [isLocating, setIsLocating] = useDebounceLoadingState(200)
  const [location, setLocation] = useState<LatLngExpression | null>(null)
  // Keep the exact handler references so we detach only our own listeners
  // (a bare map.off('locationfound') would strip every listener on the map,
  // and re-clicking without cleanup stacked duplicate handlers).
  const locationHandlersRef = useRef<{
    found: (event: LocationEvent) => void
    error: (event: ErrorEvent) => void
  } | null>(null)

  function detachLocationHandlers() {
    if (locationHandlersRef.current) {
      map.off('locationfound', locationHandlersRef.current.found)
      map.off('locationerror', locationHandlersRef.current.error)
      locationHandlersRef.current = null
    }
  }

  function startLocating() {
    detachLocationHandlers()
    setIsLocating(true)

    const found = (event: LocationEvent) => {
      setLocation(event.latlng)
      setIsLocating(false)
      onLocationFound?.(event)
    }
    const error = (event: ErrorEvent) => {
      setLocation(null)
      setIsLocating(false)
      onLocationError?.(event)
    }
    locationHandlersRef.current = { found, error }

    map.on('locationfound', found)
    map.on('locationerror', error)
    map.locate({ setView: true, maxZoom: map.getMaxZoom(), watch })
  }

  function stopLocating() {
    map.stopLocate()
    detachLocationHandlers()
    setLocation(null)
    setIsLocating(false)
  }

  useEffect(() => () => stopLocating(), [])

  return (
    <MapControlContainer className={cn(position, className)}>
      <Button
        type="button"
        size="sm"
        variant={location ? 'default' : 'secondary'}
        onClick={location ? stopLocating : startLocating}
        disabled={isLocating}
        title={isLocating ? 'Locating...' : location ? 'Stop tracking' : 'Track location'}
        aria-label={
          isLocating
            ? 'Locating...'
            : location
              ? 'Stop location tracking'
              : 'Start location tracking'
        }
        className="border"
        {...props}
      >
        {isLocating ? <LoaderCircleIcon className="animate-spin" /> : <NavigationIcon />}
      </Button>
      {location && <MapMarker position={location} icon={<MapLocatePulseIcon />} />}
    </MapControlContainer>
  )
}

function MapSearchControl({
  position = 'top-1 left-1',
  className,
  ...props
}: PlaceAutocompleteProps & { position?: string }) {
  return (
    <MapControlContainer className={cn('z-1001 w-60', position, className)}>
      <PlaceAutocomplete {...props} />
    </MapControlContainer>
  )
}

export {
  MapControlContainer,
  MapFullscreenControl,
  MapLocateControl,
  MapSearchControl,
  MapZoomControl,
}
