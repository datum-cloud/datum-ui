import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import {
  Map,
  MapMarker,
  MapTileLayer,
  MapZoomControl,
} from '@datum-cloud/datum-ui/map'

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
