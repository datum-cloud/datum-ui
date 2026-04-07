import type { ComboboxOption } from '@datum-cloud/datum-ui/combobox'
import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Combobox } from '@datum-cloud/datum-ui/combobox'
import * as React from 'react'

const options: ComboboxOption[] = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'SolidJS' },
  { value: 'qwik', label: 'Qwik' },
  { value: 'next', label: 'Next.js' },
  { value: 'nuxt', label: 'Nuxt' },
]

const meta: Meta<typeof Combobox> = {
  title: 'Features/Combobox',
  component: Combobox,
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    searchable: { control: 'boolean' },
    clearable: { control: 'boolean' },
  },
  args: {
    placeholder: 'Select a framework...',
    disabled: false,
    searchable: true,
    clearable: false,
  },
}

export default meta

type Story = StoryObj<typeof Combobox>

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = React.useState<string | undefined>(undefined)
    return (
      <div className="w-72">
        <Combobox
          {...args}
          options={options}
          value={value}
          onChange={setValue}
        />
      </div>
    )
  },
}
