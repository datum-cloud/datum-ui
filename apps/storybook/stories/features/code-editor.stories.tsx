import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { CodeEditor, CodeEditorTabs } from '@datum-cloud/datum-ui/code-editor'

const meta = {
  title: 'Features/CodeEditor',
  component: CodeEditor,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CodeEditor>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultJSON: Story = {
  args: {
    value: '{\n  "name": "John Doe",\n  "email": "john@example.com",\n  "age": 30\n}',
    language: 'json',
    minHeight: '200px',
  },
}

export const YAMLLanguage: Story = {
  args: {
    value: 'name: John Doe\nemail: john@example.com\nage: 30',
    language: 'yaml',
    minHeight: '200px',
  },
}

export const TypeScriptLanguage: Story = {
  args: {
    value: 'interface User {\n  name: string\n  email: string\n  age: number\n}',
    language: 'typescript',
    minHeight: '200px',
  },
}

export const WithError: Story = {
  args: {
    value: '{"invalid json',
    language: 'json',
    error: 'Invalid JSON format',
    minHeight: '200px',
  },
}

export const ReadOnly: Story = {
  args: {
    value: '{\n  "readOnly": true\n}',
    language: 'json',
    readOnly: true,
    minHeight: '200px',
  },
}

export const CustomHeight: Story = {
  args: {
    value: '{\n  "height": "400px"\n}',
    language: 'json',
    minHeight: '400px',
  },
}

export const TabbedEditor: StoryObj<typeof CodeEditorTabs> = {
  render: (args) => <CodeEditorTabs {...args} />,
  args: {
    value: 'name: John Doe\nemail: john@example.com\nage: 30',
    format: 'yaml',
    minHeight: '300px',
  },
}

export const TabbedEditorJSON: StoryObj<typeof CodeEditorTabs> = {
  render: (args) => <CodeEditorTabs {...args} />,
  args: {
    value: '{\n  "name": "John Doe",\n  "email": "john@example.com",\n  "age": 30\n}',
    format: 'json',
    minHeight: '300px',
  },
}
