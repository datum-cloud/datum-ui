import type { AutocompleteOption } from '@datum-cloud/datum-ui/autocomplete'
import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Autosearch } from '@datum-cloud/datum-ui/autosearch'
import * as React from 'react'

const allUsers: AutocompleteOption[] = [
  { value: 'alice', label: 'Alice Johnson', description: 'alice@example.com' },
  { value: 'bob', label: 'Bob Smith', description: 'bob@example.com' },
  { value: 'carol', label: 'Carol White', description: 'carol@example.com' },
  { value: 'david', label: 'David Brown', description: 'david@example.com' },
  { value: 'eve', label: 'Eve Davis', description: 'eve@example.com' },
]

const meta: Meta<typeof Autosearch> = {
  title: 'Features/Autosearch',
  component: Autosearch,
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: {
    placeholder: 'Search users...',
    disabled: false,
  },
}

export default meta

type Story = StoryObj<typeof Autosearch>

function DefaultStory(args: React.ComponentProps<typeof Autosearch>) {
  const [value, setValue] = React.useState<string>('')
  const [results, setResults] = React.useState<AutocompleteOption[]>([])

  const handleSearch = (query: string) => {
    if (!query) {
      setResults([])
      return
    }
    setResults(
      allUsers.filter(
        user =>
          user.label.toLowerCase().includes(query.toLowerCase())
          || user.description?.toLowerCase().includes(query.toLowerCase()),
      ),
    )
  }

  return (
    <div className="w-80">
      <Autosearch
        {...args}
        options={results}
        value={value}
        onValueChange={setValue}
        onSearch={handleSearch}
      />
    </div>
  )
}

export const Default: Story = {
  render: args => <DefaultStory {...args} />,
}
