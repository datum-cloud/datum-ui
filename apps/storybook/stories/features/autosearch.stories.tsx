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
  parameters: {
    docs: {
      description: {
        component:
          'A search-first input component with dropdown results for async search scenarios.\n\n'
          + 'Unlike Autocomplete (which shows all options upfront), `Autosearch` is designed for '
          + 'search-first workflows where typing triggers external search — e.g. API calls. '
          + 'The `onSearch` callback fires after a configurable debounce delay, the parent updates '
          + 'the `options` prop, and results appear in a popover below the input.\n\n'
          + 'When a value is selected the input is replaced with a card showing the selected option\'s '
          + 'label and description, with a clear button to deselect.',
      },
    },
  },
  argTypes: {
    placeholder: { control: 'text' },
    emptyMessage: { control: 'text' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    modal: { control: 'boolean' },
    searchDebounceMs: { control: 'number' },
  },
  args: {
    placeholder: 'Search users...',
    emptyMessage: 'No results found.',
    disabled: false,
    loading: false,
    modal: false,
    searchDebounceMs: 300,
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

function WithDebounceStory(args: React.ComponentProps<typeof Autosearch>) {
  const [value, setValue] = React.useState<string>('')
  const [results, setResults] = React.useState<AutocompleteOption[]>([])

  const handleSearch = (query: string) => {
    if (!query) {
      setResults([])
      return
    }
    setResults(
      allUsers.filter(user =>
        user.label.toLowerCase().includes(query.toLowerCase()),
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
        searchDebounceMs={500}
        placeholder="Type to search (500ms debounce)..."
      />
    </div>
  )
}

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Basic usage simulating an async search. Type a name or email to filter the local user list '
          + 'via `onSearch`. In production, replace the filter with an API call.',
      },
    },
  },
  render: args => <DefaultStory {...args} />,
}

export const WithDebounceControl: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Control the debounce delay with `searchDebounceMs`. Here it is set to 500ms, '
          + 'meaning `onSearch` fires 500ms after the user stops typing.',
      },
    },
  },
  render: args => <WithDebounceStory {...args} />,
}
