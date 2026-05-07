import type { ComponentProps } from 'react'
import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { CodeEditor } from '@datum-cloud/datum-ui/code-editor'
import { useState } from 'react'

const meta: Meta<typeof CodeEditor> = {
  title: 'Features/CodeEditor',
  component: CodeEditor,
  argTypes: {
    language: {
      control: 'select',
      options: [
        'json',
        'yaml',
        'typescript',
        'javascript',
        'python',
        'go',
        'rust',
        'java',
        'kotlin',
        'sql',
        'html',
        'css',
        'scss',
        'markdown',
        'shell',
        'dockerfile',
        'graphql',
        'hcl',
        'xml',
      ],
    },
    placeholder: { control: 'text' },
    readOnly: { control: 'boolean' },
    minHeight: { control: 'text' },
  },
  args: {
    language: 'json',
    readOnly: false,
    minHeight: '200px',
  },
}

export default meta

type Story = StoryObj<typeof CodeEditor>

function DefaultStory(args: ComponentProps<typeof CodeEditor>) {
  const [value, setValue] = useState('{\n  "name": "John Doe",\n  "email": "john@example.com",\n  "age": 30\n}')
  return (
    <CodeEditor
      {...args}
      value={value}
      onChange={setValue}
    />
  )
}

function WithPlaceholderStory(args: ComponentProps<typeof CodeEditor>) {
  const [value, setValue] = useState('')
  return (
    <CodeEditor
      {...args}
      value={value}
      onChange={setValue}
    />
  )
}

export const Default: Story = {
  render: args => <DefaultStory {...args} />,
}

export const WithPlaceholder: Story = {
  args: {
    language: 'yaml',
    placeholder: 'Paste your YAML configuration here…',
  },
  render: args => <WithPlaceholderStory {...args} />,
}
