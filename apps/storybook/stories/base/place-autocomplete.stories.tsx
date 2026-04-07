import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { PlaceAutocomplete } from '@datum-cloud/datum-ui/map'

const meta: Meta<typeof PlaceAutocomplete> = {
  title: 'Base/PlaceAutocomplete',
  component: PlaceAutocomplete,
  argTypes: {
    debounceMs: {
      control: { type: 'number', min: 0, max: 2000, step: 50 },
    },
    limit: {
      control: { type: 'number', min: 1, max: 20 },
    },
    lang: {
      control: 'select',
      options: ['en', 'de', 'fr', 'it', 'es'],
    },
    placeholder: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    debounceMs: 300,
    limit: 5,
    lang: 'en',
    placeholder: 'Search for a place...',
    disabled: false,
  },
  decorators: [
    Story => (
      <div className="w-full max-w-md">
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof PlaceAutocomplete>

export const Default: Story = {}
