import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { FileInputButton } from '@datum-cloud/datum-ui/dropzone'

const meta: Meta<typeof FileInputButton> = {
  title: 'Features/FileInputButton',
  component: FileInputButton,
  argTypes: {
    disabled: {
      control: { type: 'boolean' },
    },
    multiple: {
      control: { type: 'boolean' },
    },
    type: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary', 'quaternary'],
    },
    theme: {
      control: { type: 'select' },
      options: ['solid', 'light', 'outline', 'borderless'],
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'small', 'default', 'large'],
    },
  },
  args: {
    disabled: false,
    multiple: false,
    type: 'primary',
    theme: 'solid',
    size: 'default',
    children: 'Upload File',
  },
}

export default meta

type Story = StoryObj<typeof FileInputButton>

export const Default: Story = {
  render: args => (
    <FileInputButton
      {...args}
      onFileSelect={(files) => {
        alert(`Selected: ${files.map(f => f.name).join(', ')}`)
      }}
      onFileError={err => alert(err.message)}
    />
  ),
}

export const WithAcceptedTypes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <FileInputButton
        accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] }}
        maxSize={5 * 1024 * 1024}
        onFileSelect={(files) => {
          alert(`Images: ${files.map(f => f.name).join(', ')}`)
        }}
        onFileError={err => alert(err.message)}
      >
        Upload Image
      </FileInputButton>

      <FileInputButton
        accept={{ 'text/plain': ['.txt', '.zone'] }}
        onFileSelect={(files) => {
          alert(`Text files: ${files.map(f => f.name).join(', ')}`)
        }}
        onFileError={err => alert(err.message)}
        type="secondary"
      >
        Upload Text File
      </FileInputButton>

      <FileInputButton
        accept={{ 'application/json': ['.json'] }}
        multiple
        onFileSelect={(files) => {
          alert(`JSON files: ${files.map(f => f.name).join(', ')}`)
        }}
        onFileError={err => alert(err.message)}
        type="tertiary"
        theme="outline"
      >
        Upload JSON (Multiple)
      </FileInputButton>
    </div>
  ),
}
