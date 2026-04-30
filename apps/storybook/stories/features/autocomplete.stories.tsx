import type { AutocompleteOption } from '@datum-cloud/datum-ui/autocomplete'
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

const meta: Meta<typeof Autocomplete> = {
  title: 'Features/Autocomplete',
  component: Autocomplete,
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
  args: {
    placeholder: 'Select an option...',
    disabled: false,
    loading: false,
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

export const Default: Story = {
  render: args => <DefaultStory {...args} />,
}
