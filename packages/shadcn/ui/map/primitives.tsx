'use client'

import type {
  Circle,
  CircleMarker,
  DivIconOptions,
  Marker,
  MarkerCluster,
  PointExpression,
  Polygon,
  Polyline,
  Popup,
  Rectangle,
  Tooltip,
} from 'leaflet'
import type {} from 'leaflet.markercluster' // augments leaflet namespace (type-only, SSR-safe)
import type { ReactNode, Ref } from 'react'
import type {
  CircleMarkerProps,
  CircleProps,
  MarkerProps,
  PolygonProps,
  PolylineProps,
  PopupProps,
  RectangleProps,
  TooltipProps,
} from 'react-leaflet'
import type { MarkerClusterGroupProps } from 'react-leaflet-markercluster'
import { cn } from '@repo/shadcn/lib/utils'
import { MapPinIcon } from 'lucide-react'
import { renderToString } from 'react-dom/server.browser'
import { useLeaflet } from './hooks'
import {
  LeafletCircle,
  LeafletCircleMarker,
  LeafletMarker,
  LeafletMarkerClusterGroup,
  LeafletPolygon,
  LeafletPolyline,
  LeafletPopup,
  LeafletRectangle,
  LeafletTooltip,
} from './lazy'

function MapMarker({
  icon = <MapPinIcon className="size-6" />,
  iconAnchor = [12, 12],
  bgPos,
  popupAnchor,
  tooltipAnchor,
  ...props
}: Omit<MarkerProps, 'icon'>
  & Pick<DivIconOptions, 'iconAnchor' | 'bgPos' | 'popupAnchor' | 'tooltipAnchor'> & {
    icon?: ReactNode
    ref?: Ref<Marker>
  }) {
  const { L } = useLeaflet()
  if (!L)
    return null

  return (
    <LeafletMarker
      icon={L.divIcon({
        html: renderToString(icon),
        iconAnchor,
        ...(bgPos ? { bgPos } : {}),
        ...(popupAnchor ? { popupAnchor } : {}),
        ...(tooltipAnchor ? { tooltipAnchor } : {}),
      })}
      riseOnHover
      {...props}
    />
  )
}

function MapMarkerClusterGroup({
  polygonOptions = {
    className: 'fill-foreground stroke-foreground stroke-2',
  },
  spiderLegPolylineOptions = {
    className: 'fill-foreground stroke-foreground stroke-2',
  },
  icon,
  ...props
}: Omit<MarkerClusterGroupProps, 'iconCreateFunction'> & {
  children: ReactNode
  icon?: (markerCount: number) => ReactNode
}) {
  const { L } = useLeaflet()
  if (!L)
    return null

  const iconCreateFunction = icon
    ? (cluster: MarkerCluster) => {
        const markerCount = cluster.getChildCount()
        const iconNode = icon(markerCount)
        return L.divIcon({
          html: renderToString(iconNode),
        })
      }
    : undefined

  return (
    <LeafletMarkerClusterGroup
      polygonOptions={polygonOptions}
      spiderLegPolylineOptions={spiderLegPolylineOptions}
      iconCreateFunction={iconCreateFunction}
      {...props}
    />
  )
}

function MapCircle({ className, ...props }: CircleProps & { ref?: Ref<Circle> }) {
  return (
    <LeafletCircle
      className={cn('fill-foreground stroke-foreground stroke-2', className)}
      {...props}
    />
  )
}

function MapCircleMarker({ className, ...props }: CircleMarkerProps & { ref?: Ref<CircleMarker> }) {
  return (
    <LeafletCircleMarker
      className={cn('fill-foreground stroke-foreground stroke-2', className)}
      {...props}
    />
  )
}

function MapPolyline({ className, ...props }: PolylineProps & { ref?: Ref<Polyline> }) {
  return (
    <LeafletPolyline
      className={cn('fill-foreground stroke-foreground stroke-2', className)}
      {...props}
    />
  )
}

function MapPolygon({ className, ...props }: PolygonProps & { ref?: Ref<Polygon> }) {
  return (
    <LeafletPolygon
      className={cn('fill-foreground stroke-foreground stroke-2', className)}
      {...props}
    />
  )
}

function MapRectangle({ className, ...props }: RectangleProps & { ref?: Ref<Rectangle> }) {
  return (
    <LeafletRectangle
      className={cn('fill-foreground stroke-foreground stroke-2', className)}
      {...props}
    />
  )
}

function MapPopup({ className, ...props }: Omit<PopupProps, 'content'> & { ref?: Ref<Popup> }) {
  return (
    <LeafletPopup
      className={cn(
        'bg-popover text-popover-foreground animate-in fade-out-0 fade-in-0 zoom-out-95 zoom-in-95 slide-in-from-bottom-2 z-50 w-72 rounded-md border p-4 font-sans shadow-md outline-hidden',
        className,
      )}
      {...props}
    />
  )
}

function MapTooltip({
  className,
  children,
  side = 'top',
  sideOffset = 15,
  ...props
}: Omit<TooltipProps, 'offset'> & {
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  ref?: Ref<Tooltip>
}) {
  const ARROW_POSITION_CLASSES = {
    top: 'bottom-0.5 left-1/2 -translate-x-1/2 translate-y-1/2',
    bottom: 'top-0.5 left-1/2 -translate-x-1/2 -translate-y-1/2',
    left: 'right-0.5 top-1/2 translate-x-1/2 -translate-y-1/2',
    right: 'left-0.5 top-1/2 -translate-x-1/2 -translate-y-1/2',
  }
  const DEFAULT_OFFSET = {
    top: [0, -sideOffset] satisfies PointExpression,
    bottom: [0, sideOffset] satisfies PointExpression,
    left: [-sideOffset, 0] satisfies PointExpression,
    right: [sideOffset, 0] satisfies PointExpression,
  }

  return (
    <LeafletTooltip
      className={cn(
        'animate-in fade-in-0 zoom-in-95 fade-out-0 zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 w-fit text-xs text-balance transition-opacity',
        className,
      )}
      data-side={side}
      direction={side}
      offset={DEFAULT_OFFSET[side]}
      opacity={1}
      {...props}
    >
      {children}
      <div
        className={cn(
          'bg-foreground fill-foreground absolute z-50 size-2.5 rotate-45 rounded-[2px]',
          ARROW_POSITION_CLASSES[side],
        )}
      />
    </LeafletTooltip>
  )
}

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
}
