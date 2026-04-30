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

export const Default: Story = {
  render: args => <DefaultStory {...args} />,
}
