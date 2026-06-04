import type { ComponentProps } from 'react'
import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Transfer } from '@datum-cloud/datum-ui/transfer'
import { useState } from 'react'

interface User {
  id: string
  name: string
  role: string
}

const users: User[] = [
  { id: '1', name: 'Alice Johnson', role: 'Admin' },
  { id: '2', name: 'Bob Smith', role: 'User' },
  { id: '3', name: 'Charlie Brown', role: 'Admin' },
  { id: '4', name: 'David Lee', role: 'User' },
  { id: '5', name: 'Emma Davis', role: 'User' },
  { id: '6', name: 'Frank Miller', role: 'User' },
  { id: '7', name: 'Grace Wilson', role: 'Admin' },
  { id: '8', name: 'Henry Taylor', role: 'User' },
]

const meta: Meta<typeof Transfer<User>> = {
  title: 'Features/Transfer',
  component: Transfer,
  parameters: {
    docs: {
      description: {
        component:
          'Simple dual-panel item selector with search and grouping support.\n\n'
          + 'Transfer provides a dual-panel interface for moving items between "available" and "selected" states. '
          + 'Click items in the source panel to add them; hover an item in the target panel to reveal its X button and remove it. '
          + 'Source and target panels support a "Select All" / "Clear All" bulk operation. '
          + 'Items are identified by `itemKey`, labelled by `itemLabel`, and optionally grouped by `itemGroup` — '
          + 'each can be a field name string or an extractor function. '
          + 'Built-in search in the source panel uses a 300 ms debounce with case-insensitive substring matching.',
      },
    },
  },
  argTypes: {
    searchable: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    searchable: true,
    disabled: false,
  },
}

export default meta

type Story = StoryObj<typeof Transfer<User>>

function DefaultStory(args: ComponentProps<typeof Transfer<User>>) {
  const [value, setValue] = useState<string[]>([])
  return (
    <Transfer
      {...args}
      items={users}
      value={value}
      onChange={setValue}
      itemKey="id"
      itemLabel="name"
      itemGroup="role"
    />
  )
}

function PreselectedStory() {
  const [value, setValue] = useState<string[]>(['1', '3'])
  return (
    <Transfer
      items={users}
      value={value}
      onChange={setValue}
      itemKey="id"
      itemLabel="name"
      itemGroup="role"
    />
  )
}

function CustomTitlesStory() {
  const [value, setValue] = useState<string[]>([])
  return (
    <Transfer
      items={users}
      value={value}
      onChange={setValue}
      itemKey="id"
      itemLabel="name"
      sourceTitle="Team Members"
      targetTitle="Project Assignees"
    />
  )
}

function DisabledStory() {
  const [value, setValue] = useState<string[]>(['1', '2'])
  return (
    <Transfer
      items={users}
      value={value}
      onChange={setValue}
      itemKey="id"
      itemLabel="name"
      disabled
    />
  )
}

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Basic usage with search, grouping by role, and no preselected items.',
      },
    },
  },
  render: args => <DefaultStory {...args} />,
}

export const WithPreselected: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Start with some items already in the selected panel by providing an initial `value` array of item keys.',
      },
    },
  },
  render: () => <PreselectedStory />,
}

export const CustomPanelTitles: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Override the default "Available" and "Selected" headings with `sourceTitle` and `targetTitle`.',
      },
    },
  },
  render: () => <CustomTitlesStory />,
}

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Set `disabled` to make the entire component read-only — clicks, search, and bulk buttons are all inert.',
      },
    },
  },
  render: () => <DisabledStory />,
}
