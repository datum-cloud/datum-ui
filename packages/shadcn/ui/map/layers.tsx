'use client'

import type { CheckboxItem } from '@radix-ui/react-dropdown-menu'
import type { FeatureGroup, LayerGroup, TileLayer } from 'leaflet'
import type { ComponentProps, Ref } from 'react'
import type { LayerGroupProps, TileLayerProps } from 'react-leaflet'
import { useTheme } from '@repo/shadcn/hooks/use-theme'
import { cn } from '@repo/shadcn/lib/utils'
import { Button } from '@repo/shadcn/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/shadcn/ui/dropdown-menu'
import { LayersIcon } from 'lucide-react'
import { createContext, useContext, useEffect, useState } from 'react'
import { LeafletFeatureGroup, LeafletLayerGroup, LeafletTileLayer } from './lazy'
import { _useMap } from './shared'

interface MapTileLayerOption {
  name: string
  url: string
  attribution?: string
}

interface MapLayerGroupOption extends Pick<ComponentProps<typeof CheckboxItem>, 'disabled'> {
  name: string
}

interface MapLayersContextType {
  registerTileLayer: (layer: MapTileLayerOption) => void
  tileLayers: MapTileLayerOption[]
  selectedTileLayer: string
  setSelectedTileLayer: (name: string) => void
  registerLayerGroup: (layer: MapLayerGroupOption) => void
  layerGroups: MapLayerGroupOption[]
  activeLayerGroups: string[]
  setActiveLayerGroups: (names: string[]) => void
}

const MapLayersContext = createContext<MapLayersContextType | null>(null)

function useMapLayersContext() {
  return useContext(MapLayersContext)
}

function MapTileLayer({
  name = 'Default',
  url,
  attribution,
  darkUrl,
  darkAttribution,
  ...props
}: Partial<TileLayerProps> & {
  name?: string
  darkUrl?: string
  darkAttribution?: string
  ref?: Ref<TileLayer>
}) {
  const map = _useMap()
  if (map.attributionControl) {
    map.attributionControl.setPrefix('')
  }

  const context = useContext(MapLayersContext)
  const DEFAULT_URL = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
  const DEFAULT_DARK_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'

  const { resolvedTheme } = useTheme()
  const resolvedUrl
    = resolvedTheme === 'dark' ? (darkUrl ?? url ?? DEFAULT_DARK_URL) : (url ?? DEFAULT_URL)
  const resolvedAttribution
    = resolvedTheme === 'dark' && darkAttribution
      ? darkAttribution
      : (attribution
        ?? '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>')

  useEffect(() => {
    if (context) {
      context.registerTileLayer({
        name,
        url: resolvedUrl,
        attribution: resolvedAttribution,
      })
    }
  }, [context, name, resolvedUrl, resolvedAttribution])

  if (context && context.selectedTileLayer !== name) {
    return null
  }

  return <LeafletTileLayer url={resolvedUrl} attribution={resolvedAttribution} {...props} />
}

function MapLayerGroup({
  name,
  disabled,
  ...props
}: LayerGroupProps & MapLayerGroupOption & { ref?: Ref<LayerGroup> }) {
  const context = useMapLayersContext()

  useEffect(() => {
    if (context) {
      context.registerLayerGroup({
        name,
        disabled,
      })
    }
  }, [context, name, disabled])

  if (context && !context.activeLayerGroups.includes(name)) {
    return null
  }

  return <LeafletLayerGroup {...props} />
}

function MapFeatureGroup({
  name,
  disabled,
  ...props
}: LayerGroupProps & MapLayerGroupOption & { ref?: Ref<FeatureGroup> }) {
  const context = useMapLayersContext()

  useEffect(() => {
    if (context) {
      context.registerLayerGroup({
        name,
        disabled,
      })
    }
  }, [context, name, disabled])

  if (context && !context.activeLayerGroups.includes(name)) {
    return null
  }

  return <LeafletFeatureGroup {...props} />
}

function MapLayers({
  defaultTileLayer,
  defaultLayerGroups = [],
  ...props
}: Omit<ComponentProps<typeof MapLayersContext.Provider>, 'value'> & {
  defaultTileLayer?: string
  defaultLayerGroups?: string[]
}) {
  const [tileLayers, setTileLayers] = useState<MapTileLayerOption[]>([])
  const [selectedTileLayer, setSelectedTileLayer] = useState<string>(defaultTileLayer || '')
  const [layerGroups, setLayerGroups] = useState<MapLayerGroupOption[]>([])
  const [activeLayerGroups, setActiveLayerGroups] = useState<string[]>(defaultLayerGroups)

  function registerTileLayer(tileLayer: MapTileLayerOption) {
    setTileLayers((prevTileLayers) => {
      if (prevTileLayers.some(layer => layer.name === tileLayer.name)) {
        return prevTileLayers
      }
      return [...prevTileLayers, tileLayer]
    })
  }

  function registerLayerGroup(layerGroup: MapLayerGroupOption) {
    setLayerGroups((prevLayerGroups) => {
      if (prevLayerGroups.some(group => group.name === layerGroup.name)) {
        return prevLayerGroups
      }
      return [...prevLayerGroups, layerGroup]
    })
  }

  useEffect(() => {
    // Set the initial selected tile layer once layers have registered. We do
    // NOT throw when defaultTileLayer/defaultLayerGroups reference a not-yet-
    // registered layer: registration happens across multiple commits (and some
    // MapLayerGroups mount conditionally after a data fetch), so an unknown name
    // is indistinguishable from one that simply hasn't mounted yet. Throwing
    // there crashed the map whenever a referenced layer registered later. Unknown
    // names are harmless — MapLayersControl only lists registered layers, and an
    // inactive/unknown active-group name filters nothing.
    if (tileLayers.length > 0 && !selectedTileLayer) {
      const validDefaultValue
        = defaultTileLayer && tileLayers.some(layer => layer.name === defaultTileLayer)
          ? defaultTileLayer
          : tileLayers[0]!.name
      setSelectedTileLayer(validDefaultValue)
    }
  }, [tileLayers, defaultTileLayer, selectedTileLayer])

  return (
    <MapLayersContext.Provider
      value={{
        registerTileLayer,
        tileLayers,
        selectedTileLayer,
        setSelectedTileLayer,
        registerLayerGroup,
        layerGroups,
        activeLayerGroups,
        setActiveLayerGroups,
      }}
      {...props}
    />
  )
}

function MapLayersControl({
  tileLayersLabel = 'Map Type',
  layerGroupsLabel = 'Layers',
  position = 'top-1 right-1',
  className,
  ...props
}: ComponentProps<'button'> & {
  tileLayersLabel?: string
  layerGroupsLabel?: string
  position?: string
}) {
  const layersContext = useMapLayersContext()
  if (!layersContext) {
    throw new Error('MapLayersControl must be used within MapLayers')
  }

  const {
    tileLayers,
    selectedTileLayer,
    setSelectedTileLayer,
    layerGroups,
    activeLayerGroups,
    setActiveLayerGroups,
  } = layersContext

  if (tileLayers.length === 0 && layerGroups.length === 0) {
    return null
  }

  function handleLayerGroupToggle(name: string, checked: boolean) {
    setActiveLayerGroups(
      checked
        ? [...activeLayerGroups, name]
        : activeLayerGroups.filter(groupName => groupName !== name),
    )
  }

  const showTileLayersDropdown = tileLayers.length > 1
  const showLayerGroupsDropdown = layerGroups.length > 0

  if (!showTileLayersDropdown && !showLayerGroupsDropdown) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          aria-label="Select layers"
          title="Select layers"
          className={cn('absolute z-1000 border', position, className)}
          {...props}
        >
          <LayersIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-1000">
        {showTileLayersDropdown && (
          <>
            <DropdownMenuLabel>{tileLayersLabel}</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={selectedTileLayer} onValueChange={setSelectedTileLayer}>
              {tileLayers.map(tileLayer => (
                <DropdownMenuRadioItem key={tileLayer.name} value={tileLayer.name}>
                  {tileLayer.name}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </>
        )}
        {showTileLayersDropdown && showLayerGroupsDropdown && <DropdownMenuSeparator />}
        {showLayerGroupsDropdown && (
          <>
            <DropdownMenuLabel>{layerGroupsLabel}</DropdownMenuLabel>
            {layerGroups.map(layerGroup => (
              <DropdownMenuCheckboxItem
                key={layerGroup.name}
                checked={activeLayerGroups.includes(layerGroup.name)}
                disabled={layerGroup.disabled}
                onCheckedChange={checked => handleLayerGroupToggle(layerGroup.name, checked)}
              >
                {layerGroup.name}
              </DropdownMenuCheckboxItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export {
  MapFeatureGroup,
  MapLayerGroup,
  MapLayers,
  MapLayersControl,
  MapTileLayer,
}
