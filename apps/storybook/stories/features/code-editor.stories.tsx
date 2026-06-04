import type { ComponentProps } from 'react'
import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { CodeEditor } from '@datum-cloud/datum-ui/code-editor'
import { useState } from 'react'

const meta: Meta<typeof CodeEditor> = {
  title: 'Features/CodeEditor',
  component: CodeEditor,
  parameters: {
    docs: {
      description: {
        component:
          'Monaco-based code editor with syntax highlighting, theme support, and JSON ↔ YAML conversion capabilities.\n\n'
          + 'A Monaco Editor wrapper that provides a VS Code-like editing experience with automatic formatting, '
          + 'theme integration (light/dark), and form compatibility via hidden inputs. '
          + 'Two exports are available: `CodeEditor` for single-language editing and `CodeEditorTabs` for a '
          + 'dual-format editor with automatic JSON ↔ YAML conversion, validation, and tab-switching protection.\n\n'
          + 'Requires `@monaco-editor/react`.',
      },
    },
  },
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

function ReadOnlyStory() {
  return (
    <CodeEditor
      value={'name: John Doe\nemail: john@example.com\nage: 30'}
      language="yaml"
      readOnly
      minHeight="200px"
    />
  )
}

function WithErrorStory() {
  const [value, setValue] = useState('{\n  "name": "John Doe"\n  "age": 30\n}')
  return (
    <CodeEditor
      value={value}
      onChange={setValue}
      language="json"
      error="Invalid JSON format: Expected comma after property value at line 3"
      minHeight="200px"
    />
  )
}

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Basic JSON editor with Monaco syntax highlighting and automatic formatting on mount. '
          + 'Use the Controls panel to switch language, toggle read-only mode, or change the min height.',
      },
    },
  },
  render: args => <DefaultStory {...args} />,
}

export const WithPlaceholder: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'When `value` is empty and a `placeholder` is provided, the editor shows placeholder text '
          + 'to guide the user.',
      },
    },
  },
  args: {
    language: 'yaml',
    placeholder: 'Paste your YAML configuration here…',
  },
  render: args => <WithPlaceholderStory {...args} />,
}

export const ReadOnly: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Set `readOnly` to display code without allowing edits. Useful for showing configuration '
          + 'output or diffs.',
      },
    },
  },
  render: () => <ReadOnlyStory />,
}

export const WithError: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Pass an `error` string to display a validation message below the editor. '
          + 'The editor stays editable — validation is performed by the parent.',
      },
    },
  },
  render: () => <WithErrorStory />,
}
