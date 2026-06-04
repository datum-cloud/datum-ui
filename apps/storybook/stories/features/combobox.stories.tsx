import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Autocomplete } from '@datum-cloud/datum-ui/autocomplete'
import { useState } from 'react'

/**
 * NOTE: The MDX docs reference `@datum-cloud/datum-ui/combobox` but no such
 * subpath export exists in the package. The documented Combobox pattern is
 * implemented by the `Autocomplete` component (`@datum-cloud/datum-ui/autocomplete`),
 * which is also what Form.Combobox delegates to internally. Stories here use
 * Autocomplete directly to match the real API.
 */

const meta: Meta<typeof Autocomplete> = {
  title: 'Features/Combobox',
  component: Autocomplete,
  parameters: {
    docs: {
      description: {
        component:
          'A single-select dropdown with search functionality for simple selection scenarios.\n\n'
          + 'The `Combobox` pattern is a simpler alternative to the full Autocomplete for basic '
          + 'select scenarios. It supports flat or grouped options with built-in search filtering. '
          + 'Internally implemented via the `Autocomplete` component — use `Autocomplete` from '
          + '`@datum-cloud/datum-ui/autocomplete` directly, or `Form.Combobox` inside a form context.',
      },
    },
  },
  argTypes: {
    placeholder: { control: 'text' },
    searchPlaceholder: { control: 'text' },
    disabled: { control: 'boolean' },
    disableSearch: { control: 'boolean' },
    options: { control: false },
    value: { control: false },
    onValueChange: { control: false },
  },
  args: {
    placeholder: 'Select option...',
    searchPlaceholder: 'Search...',
    disabled: false,
    disableSearch: false,
  },
}

export default meta

type Story = StoryObj<typeof Autocomplete>

const fruitOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'grape', label: 'Grape' },
  { value: 'mango', label: 'Mango' },
]

function BasicDemo() {
  const [value, setValue] = useState('')
  return (
    <div className="w-64">
      <Autocomplete
        value={value}
        onValueChange={val => setValue(val)}
        options={fruitOptions}
        placeholder="Select a fruit..."
      />
    </div>
  )
}

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Basic usage of the Combobox (Autocomplete) with a flat list of options and built-in search filtering.',
      },
    },
  },
  render: () => <BasicDemo />,
}

const groupedOptions = [
  {
    label: 'Fruits',
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
    ],
  },
  {
    label: 'Vegetables',
    options: [
      { value: 'carrot', label: 'Carrot' },
      { value: 'broccoli', label: 'Broccoli' },
    ],
  },
]

function GroupedDemo() {
  const [value, setValue] = useState('')
  return (
    <div className="w-64">
      <Autocomplete
        value={value}
        onValueChange={val => setValue(val)}
        options={groupedOptions}
        placeholder="Select food..."
      />
    </div>
  )
}

export const GroupedOptions: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Pass an array of group objects (each with a `label` and nested `options`) to render a grouped dropdown.',
      },
    },
  },
  render: () => <GroupedDemo />,
}

function ClearableDemo() {
  const [value, setValue] = useState('apple')
  return (
    <div className="w-64">
      <Autocomplete
        value={value}
        onValueChange={val => setValue(val ?? '')}
        options={fruitOptions}
        placeholder="Select or clear..."
      />
    </div>
  )
}

export const Clearable: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Pre-select a value to see the clear affordance. The selection can be changed by picking a new option.',
      },
    },
  },
  render: () => <ClearableDemo />,
}

function DisabledDemo() {
  return (
    <div className="w-64">
      <Autocomplete
        value="apple"
        options={fruitOptions}
        placeholder="Select a fruit..."
        disabled
      />
    </div>
  )
}

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Set `disabled` to `true` to prevent interaction with the combobox.',
      },
    },
  },
  render: () => <DisabledDemo />,
}
