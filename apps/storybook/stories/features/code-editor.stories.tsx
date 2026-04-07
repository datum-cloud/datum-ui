import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { CodeEditor } from '@datum-cloud/datum-ui/code-editor'
import { useState } from 'react'

const meta: Meta<typeof CodeEditor> = {
  title: 'Features/CodeEditor',
  component: CodeEditor,
  argTypes: {
    language: {
      control: 'select',
      options: ['json', 'yaml', 'typescript', 'javascript', 'python', 'sql', 'html', 'css', 'markdown'],
    },
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

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState('{\n  "name": "John Doe",\n  "email": "john@example.com",\n  "age": 30\n}')
    return (
      <CodeEditor
        {...args}
        value={value}
        onChange={setValue}
      />
    )
  },
}
