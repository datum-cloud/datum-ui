'use client'

import type { Draw, DrawEvents, DrawMap, DrawOptions, EditToolbar } from 'leaflet'
import type { ComponentProps, RefObject } from 'react'
import { cn } from '@repo/shadcn/lib/utils'
import { Button } from '@repo/shadcn/ui/button'
import { ButtonGroup } from '@repo/shadcn/ui/button-group'
import {
  CircleIcon,
  MapPinIcon,
  PenLineIcon,
  PentagonIcon,
  SquareIcon,
  Trash2Icon,
  Undo2Icon,
  WaypointsIcon,
} from 'lucide-react'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { renderToString } from 'react-dom/server.browser'
import { MapControlContainer } from './controls'
import { useLeaflet, useMapDrawHandleIcon } from './hooks'
import { LeafletFeatureGroup } from './lazy'
import { _useMap } from './shared'

type MapDrawShape = 'marker' | 'polyline' | 'circle' | 'rectangle' | 'polygon'
type MapDrawAction = 'edit' | 'delete'
type MapDrawMode = MapDrawShape | MapDrawAction | null
interface MapDrawContextType {
  readonly featureGroup: L.FeatureGroup | null
  activeMode: MapDrawMode
  setActiveMode: (mode: MapDrawMode) => void
  readonly editControlRef: RefObject<EditToolbar.Edit | null>
  readonly deleteControlRef: RefObject<EditToolbar.Delete | null>
  readonly layersCount: number
}

const MapDrawContext = createContext<MapDrawContextType | null>(null)

function useMapDrawContext() {
  return useContext(MapDrawContext)
}

function MapDrawControl({
  onLayersChange,
  position = 'bottom-1 left-1',
  className,
  ...props
}: ComponentProps<'div'> & {
  onLayersChange?: (layers: L.FeatureGroup) => void
  position?: string
}) {
  const { L, LeafletDraw } = useLeaflet()
  const map = _useMap()
  const featureGroupRef = useRef<L.FeatureGroup | null>(null)
  const editControlRef = useRef<EditToolbar.Edit | null>(null)
  const deleteControlRef = useRef<EditToolbar.Delete | null>(null)
  const [activeMode, setActiveMode] = useState<MapDrawMode>(null)
  const [layersCount, setLayersCount] = useState(0)

  function updateLayersCount() {
    if (featureGroupRef.current) {
      setLayersCount(featureGroupRef.current.getLayers().length)
    }
  }

  function handleDrawCreated(event: DrawEvents.Created) {
    if (!featureGroupRef.current)
      return
    const { layer } = event
    featureGroupRef.current.addLayer(layer)
    onLayersChange?.(featureGroupRef.current)
    updateLayersCount()
    setActiveMode(null)
  }

  function handleDrawEditedOrDeleted() {
    if (!featureGroupRef.current)
      return
    onLayersChange?.(featureGroupRef.current)
    updateLayersCount()
    setActiveMode(null)
  }

  useEffect(() => {
    if (!L || !LeafletDraw || !map)
      return

    map.on(L.Draw.Event.CREATED, handleDrawCreated as L.LeafletEventHandlerFn)
    map.on(L.Draw.Event.EDITED, handleDrawEditedOrDeleted)
    map.on(L.Draw.Event.DELETED, handleDrawEditedOrDeleted)

    return () => {
      map.off(L.Draw.Event.CREATED, handleDrawCreated as L.LeafletEventHandlerFn)
      map.off(L.Draw.Event.EDITED, handleDrawEditedOrDeleted)
      map.off(L.Draw.Event.DELETED, handleDrawEditedOrDeleted)
    }
  }, [L, LeafletDraw, map, onLayersChange])

  return (
    <MapDrawContext.Provider
      value={{
        featureGroup: featureGroupRef.current,
        activeMode,
        setActiveMode,
        editControlRef,
        deleteControlRef,
        layersCount,
      }}
    >
      <LeafletFeatureGroup ref={featureGroupRef} />
      <MapControlContainer className={cn(position, className)}>
        <ButtonGroup orientation="vertical" {...props} />
      </MapControlContainer>
    </MapDrawContext.Provider>
  )
}

function MapDrawShapeButton<T extends Draw.Feature>({
  drawMode,
  createDrawTool,
  className,
  ...props
}: ComponentProps<'button'> & {
  drawMode: MapDrawShape
  createDrawTool: (L: typeof import('leaflet'), map: DrawMap) => T
}) {
  const drawContext = useMapDrawContext()
  if (!drawContext) {
    throw new Error('MapDrawShapeButton must be used within MapDrawControl')
  }
  const { L } = useLeaflet()
  const map = _useMap()
  const controlRef = useRef<T | null>(null)
  const { activeMode, setActiveMode } = drawContext
  const isActive = activeMode === drawMode

  // Hold the latest createDrawTool in a ref so the enable/disable effect does
  // NOT re-run when an ancestor re-render hands us a new inline arrow identity.
  // Re-running mid-draw would disable the active tool and silently discard the
  // user's in-progress shape.
  const createDrawToolRef = useRef(createDrawTool)
  createDrawToolRef.current = createDrawTool

  useEffect(() => {
    if (!L || !isActive) {
      controlRef.current?.disable()
      controlRef.current = null
      return
    }
    const control = createDrawToolRef.current(L, map as DrawMap)
    control.enable()
    controlRef.current = control
    return () => {
      control.disable()
      controlRef.current = null
    }
  }, [L, map, isActive])

  function handleClick() {
    setActiveMode(isActive ? null : drawMode)
  }

  return (
    <Button
      type="button"
      size="sm"
      aria-label={`Draw ${drawMode}`}
      title={`Draw ${drawMode}`}
      className={cn('border', className)}
      variant={isActive ? 'default' : 'secondary'}
      disabled={activeMode === 'edit' || activeMode === 'delete'}
      onClick={handleClick}
      {...props}
    />
  )
}

function MapDrawMarker({ ...props }: DrawOptions.MarkerOptions) {
  return (
    <MapDrawShapeButton
      drawMode="marker"
      createDrawTool={(L, map) =>
        new L.Draw.Marker(map, {
          icon: L.divIcon({
            className: '', // For fixing the moving bug when going in and out the edit mode
            iconAnchor: [12, 12],
            html: renderToString(<MapPinIcon className="size-6" />),
          }),
          ...props,
        })}
    >
      <MapPinIcon />
    </MapDrawShapeButton>
  )
}

function MapDrawPolyline({
  showLength = false,
  drawError = {
    color: 'var(--color-destructive)',
  },
  shapeOptions = {
    color: 'var(--color-primary)',
    opacity: 1,
    weight: 2,
  },
  ...props
}: DrawOptions.PolylineOptions) {
  const mapDrawHandleIcon = useMapDrawHandleIcon()

  return (
    <MapDrawShapeButton
      drawMode="polyline"
      createDrawTool={(L, map) =>
        new L.Draw.Polyline(map, {
          ...(mapDrawHandleIcon
            ? {
                icon: mapDrawHandleIcon,
                touchIcon: mapDrawHandleIcon,
              }
            : {}),
          showLength,
          drawError,
          shapeOptions,
          ...props,
        })}
    >
      <WaypointsIcon />
    </MapDrawShapeButton>
  )
}

function MapDrawCircle({
  showRadius = false,
  shapeOptions = {
    color: 'var(--color-primary)',
    opacity: 1,
    weight: 2,
  },
  ...props
}: DrawOptions.CircleOptions) {
  return (
    <MapDrawShapeButton
      drawMode="circle"
      createDrawTool={(L, map) =>
        new L.Draw.Circle(map, {
          showRadius,
          shapeOptions,
          ...props,
        })}
    >
      <CircleIcon />
    </MapDrawShapeButton>
  )
}

function MapDrawRectangle({
  showArea = false,
  shapeOptions = {
    color: 'var(--color-primary)',
    opacity: 1,
    weight: 2,
  },
  ...props
}: DrawOptions.RectangleOptions) {
  return (
    <MapDrawShapeButton
      drawMode="rectangle"
      createDrawTool={(L, map) =>
        new L.Draw.Rectangle(map, {
          showArea,
          shapeOptions,
          ...props,
        })}
    >
      <SquareIcon />
    </MapDrawShapeButton>
  )
}

function MapDrawPolygon({
  drawError = {
    color: 'var(--color-destructive)',
  },
  shapeOptions = {
    color: 'var(--color-primary)',
    opacity: 1,
    weight: 2,
  },
  ...props
}: DrawOptions.PolygonOptions) {
  const mapDrawHandleIcon = useMapDrawHandleIcon()

  return (
    <MapDrawShapeButton
      drawMode="polygon"
      createDrawTool={(L, map) =>
        new L.Draw.Polygon(map, {
          ...(mapDrawHandleIcon
            ? {
                icon: mapDrawHandleIcon,
                touchIcon: mapDrawHandleIcon,
              }
            : {}),
          drawError,
          shapeOptions,
          ...props,
        })}
    >
      <PentagonIcon />
    </MapDrawShapeButton>
  )
}

function MapDrawActionButton<T extends EditToolbar.Edit | EditToolbar.Delete>({
  drawAction,
  createDrawTool,
  controlRef,
  className,
  ...props
}: ComponentProps<'button'> & {
  drawAction: MapDrawAction
  createDrawTool: (L: typeof import('leaflet'), map: DrawMap, featureGroup: L.FeatureGroup) => T
  controlRef: RefObject<T | null>
}) {
  const drawContext = useMapDrawContext()
  if (!drawContext)
    throw new Error('MapDrawActionButton must be used within MapDrawControl')

  const { L } = useLeaflet()
  const map = _useMap()
  const { featureGroup, activeMode, setActiveMode, layersCount } = drawContext
  const isActive = activeMode === drawAction
  const hasFeatures = layersCount > 0

  // See MapDrawShapeButton: keep createDrawTool in a ref so an ancestor
  // re-render's new arrow identity doesn't tear down the active edit/delete
  // handler mid-operation (which broke Undo/revert).
  const createDrawToolRef = useRef(createDrawTool)
  createDrawToolRef.current = createDrawTool

  useEffect(() => {
    if (!L || !featureGroup || !isActive) {
      controlRef.current?.disable?.()
      controlRef.current = null
      return
    }
    const control = createDrawToolRef.current(L, map as DrawMap, featureGroup)
    control.enable?.()
    controlRef.current = control
    return () => {
      control.disable?.()
      controlRef.current = null
    }
  }, [L, map, isActive, featureGroup])

  function handleClick() {
    controlRef.current?.save()
    setActiveMode(isActive ? null : drawAction)
  }

  return (
    <Button
      type="button"
      size="sm"
      aria-label={`${drawAction === 'edit' ? 'Edit' : 'Remove'} shapes`}
      title={`${drawAction === 'edit' ? 'Edit' : 'Remove'} shapes`}
      variant={isActive ? 'default' : 'secondary'}
      disabled={!hasFeatures}
      onClick={handleClick}
      className={cn('border', className)}
      {...props}
    />
  )
}

function MapDrawEdit({
  selectedPathOptions = {
    color: 'var(--color-primary)',
    fillColor: 'var(--color-primary)',
    weight: 2,
  },
  ...props
}: Omit<EditToolbar.EditHandlerOptions, 'featureGroup'>) {
  const { L } = useLeaflet()
  const mapDrawHandleIcon = useMapDrawHandleIcon()
  const drawContext = useMapDrawContext()
  if (!drawContext) {
    throw new Error('MapDrawEdit must be used within MapDrawControl')
  }

  useEffect(() => {
    if (!L || !mapDrawHandleIcon)
      return

    L.Edit.PolyVerticesEdit.mergeOptions({
      icon: mapDrawHandleIcon,
      touchIcon: mapDrawHandleIcon,
      drawError: {
        color: 'var(--color-destructive)',
      },
    })
    L.Edit.SimpleShape.mergeOptions({
      moveIcon: mapDrawHandleIcon,
      resizeIcon: mapDrawHandleIcon,
      touchMoveIcon: mapDrawHandleIcon,
      touchResizeIcon: mapDrawHandleIcon,
    })
    L.drawLocal.edit.handlers.edit.tooltip = {
      text: 'Drag handles or markers to edit.',
      subtext: '',
    }
    L.drawLocal.edit.handlers.remove.tooltip = {
      text: 'Click on a shape to remove.',
    }
  }, [mapDrawHandleIcon])

  return (
    <MapDrawActionButton
      drawAction="edit"
      controlRef={drawContext.editControlRef}
      createDrawTool={(L, map, featureGroup) =>
        new L.EditToolbar.Edit(map, {
          featureGroup,
          selectedPathOptions,
          ...props,
        })}
    >
      <PenLineIcon />
    </MapDrawActionButton>
  )
}

function MapDrawDelete() {
  const drawContext = useMapDrawContext()
  if (!drawContext) {
    throw new Error('MapDrawDelete must be used within MapDrawControl')
  }

  return (
    <MapDrawActionButton
      drawAction="delete"
      controlRef={drawContext.deleteControlRef}
      createDrawTool={(L, map, featureGroup) => new L.EditToolbar.Delete(map, { featureGroup })}
    >
      <Trash2Icon />
    </MapDrawActionButton>
  )
}

function MapDrawUndo({ className, ...props }: ComponentProps<'button'>) {
  const drawContext = useMapDrawContext()
  if (!drawContext)
    throw new Error('MapDrawUndo must be used within MapDrawControl')

  const { activeMode, setActiveMode, editControlRef, deleteControlRef, layersCount } = drawContext
  const isInEditMode = activeMode === 'edit'
  const isInDeleteMode = activeMode === 'delete'
  const isActive = (isInEditMode || isInDeleteMode) && layersCount > 0

  function handleUndo() {
    if (isInEditMode) {
      editControlRef.current?.revertLayers()
    }
    else if (isInDeleteMode) {
      deleteControlRef.current?.revertLayers()
    }
    setActiveMode(null)
  }

  return (
    <Button
      type="button"
      size="sm"
      variant="secondary"
      aria-label={`Undo ${activeMode}`}
      title={`Undo ${activeMode}`}
      onClick={handleUndo}
      disabled={!isActive}
      className={cn('border', className)}
      {...props}
    >
      <Undo2Icon />
    </Button>
  )
}

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
}
