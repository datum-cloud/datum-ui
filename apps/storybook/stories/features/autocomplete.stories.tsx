import type { AutocompleteGroup, AutocompleteOption } from '@datum-cloud/datum-ui'
import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Autocomplete } from '@datum-cloud/datum-ui'
import { useState } from 'react'

const meta: Meta<typeof Autocomplete> = {
  title: 'Features/Autocomplete',
  component: Autocomplete,
  argTypes: {
    placeholder: {
      control: { type: 'text' },
    },
    searchPlaceholder: {
      control: { type: 'text' },
    },
    loading: {
      control: { type: 'boolean' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    virtualize: {
      control: { type: 'boolean' },
    },
    disableSearch: {
      control: { type: 'boolean' },
    },
    creatable: {
      control: { type: 'boolean' },
    },
  },
  args: {
    placeholder: 'Select an option...',
    searchPlaceholder: 'Search...',
    loading: false,
    disabled: false,
    virtualize: false,
    disableSearch: false,
    creatable: false,
  },
}

export default meta

type Story = StoryObj<typeof Autocomplete>

const countries: AutocompleteOption[] = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'au', label: 'Australia' },
  { value: 'br', label: 'Brazil' },
  { value: 'in', label: 'India', description: 'South Asia' },
  { value: 'mx', label: 'Mexico', description: 'North America' },
]

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | undefined>(undefined)
    return (
      <div className="w-72">
        <Autocomplete
          {...args}
          options={countries}
          value={value}
          onValueChange={setValue}
        />
      </div>
    )
  },
}

const groupedOptions: AutocompleteGroup[] = [
  {
    label: 'North America',
    options: [
      { value: 'us', label: 'United States' },
      { value: 'ca', label: 'Canada' },
      { value: 'mx', label: 'Mexico' },
    ],
  },
  {
    label: 'Europe',
    options: [
      { value: 'uk', label: 'United Kingdom' },
      { value: 'de', label: 'Germany' },
      { value: 'fr', label: 'France' },
    ],
  },
  {
    label: 'Asia Pacific',
    options: [
      { value: 'jp', label: 'Japan' },
      { value: 'au', label: 'Australia' },
      { value: 'in', label: 'India' },
    ],
  },
]

export const WithGroups: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>(undefined)
    return (
      <div className="w-72">
        <Autocomplete
          options={groupedOptions}
          value={value}
          onValueChange={setValue}
          placeholder="Select a country..."
        />
      </div>
    )
  },
}

export const Loading: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>(undefined)
    return (
      <div className="w-72">
        <Autocomplete
          options={[]}
          value={value}
          onValueChange={setValue}
          loading
          placeholder="Loading options..."
        />
      </div>
    )
  },
}

export const Creatable: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>(undefined)
    return (
      <div className="w-72">
        <Autocomplete
          options={countries}
          value={value}
          onValueChange={setValue}
          creatable
          placeholder="Select or create..."
          emptyContent="Type to create a new option"
        />
      </div>
    )
  },
}
