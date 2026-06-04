import type { AutocompleteGroup, AutocompleteOption } from '@datum-cloud/datum-ui/autocomplete'
import type { ComponentProps } from 'react'
import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Autocomplete } from '@datum-cloud/datum-ui/autocomplete'
import { useState } from 'react'

const options: AutocompleteOption[] = [
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

const meta: Meta<typeof Autocomplete> = {
  title: 'Features/Autocomplete',
  component: Autocomplete,
  parameters: {
    docs: {
      description: {
        component:
          'A searchable select component with support for groups, virtualization, and creatable options.\n\n'
          + 'The `Autocomplete` component is a form-agnostic combobox built on Popover and Command (cmdk). '
          + 'It supports flat and grouped options, optional virtualization for large lists via `@tanstack/react-virtual`, '
          + 'custom rendering, async external search, and creatable (user-defined) values.',
      },
    },
  },
  argTypes: {
    placeholder: { control: 'text' },
    searchPlaceholder: { control: 'text' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    creatable: { control: 'boolean' },
    disableSearch: { control: 'boolean' },
    modal: { control: 'boolean' },
  },
  args: {
    placeholder: 'Select an option...',
    searchPlaceholder: 'Search...',
    disabled: false,
    loading: false,
    creatable: false,
    disableSearch: false,
    modal: false,
  },
}

export default meta

type Story = StoryObj<typeof Autocomplete>

function DefaultStory(args: ComponentProps<typeof Autocomplete>) {
  const [value, setValue] = useState<string | undefined>(undefined)
  return (
    <div className="w-72">
      <Autocomplete
        {...args}
        options={options}
        value={value}
        onValueChange={setValue}
      />
    </div>
  )
}

function GroupedStory(args: ComponentProps<typeof Autocomplete>) {
  const [value, setValue] = useState<string | undefined>(undefined)
  return (
    <div className="w-72">
      <Autocomplete
        {...args}
        options={groupedOptions}
        value={value}
        onValueChange={setValue}
        placeholder="Select a country..."
      />
    </div>
  )
}

function CreatableStory(args: ComponentProps<typeof Autocomplete>) {
  const [value, setValue] = useState<string | undefined>(undefined)
  return (
    <div className="w-72">
      <Autocomplete
        {...args}
        options={options}
        value={value}
        onValueChange={setValue}
        creatable
        placeholder="Select or create..."
        emptyContent="Type to create a new option"
      />
    </div>
  )
}

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Basic usage with a flat list of options. The built-in search filters options as you type. '
          + 'Pass `value` and `onValueChange` for controlled selection.',
      },
    },
  },
  render: args => <DefaultStory {...args} />,
}

export const WithGroups: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Pass an array of `{ label, options }` objects to render grouped options with headings. '
          + 'The search input filters across all groups simultaneously.',
      },
    },
  },
  render: args => <GroupedStory {...args} />,
}

export const Creatable: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Set `creatable` to allow users to enter custom values not present in the options list. '
          + 'When the search query matches no option, a "Create \\"...\\"" entry appears at the bottom of the list.',
      },
    },
  },
  render: args => <CreatableStory {...args} />,
}
