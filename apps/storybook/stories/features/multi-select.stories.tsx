import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { MultiSelect } from '@datum-cloud/datum-ui/multi-select'
import { useState } from 'react'

const meta: Meta<typeof MultiSelect> = {
  title: 'Features/MultiSelect',
  component: MultiSelect,
  parameters: {
    docs: {
      description: {
        component:
          'Multi-select combobox. Responsive: renders as a popover at ≥768px and a mobile bottom sheet at <768px.',
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof MultiSelect>

const sampleOptions = [
  { label: 'React', value: 'react' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Tailwind CSS', value: 'tailwind' },
  { label: 'Vitest', value: 'vitest' },
  { label: 'Storybook', value: 'storybook' },
]

export const Default: Story = {
  render: () => {
    const [values, setValues] = useState<string[]>([])
    return (
      <div className="w-80">
        <MultiSelect
          options={sampleOptions}
          onValueChange={setValues}
          placeholder="Pick your stack"
          value={values}
        />
      </div>
    )
  },
}

export const WithPresetSelection: Story = {
  render: () => {
    const [values, setValues] = useState<string[]>(['react', 'typescript'])
    return (
      <div className="w-80">
        <MultiSelect
          options={sampleOptions}
          onValueChange={setValues}
          placeholder="Pick your stack"
          value={values}
          maxCount={2}
        />
      </div>
    )
  },
}
