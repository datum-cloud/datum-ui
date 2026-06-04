import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { FileInputButton } from '@datum-cloud/datum-ui/dropzone'

const meta: Meta<typeof FileInputButton> = {
  title: 'Features/FileInputButton',
  component: FileInputButton,
  parameters: {
    docs: {
      description: {
        component:
          'A button that triggers a native file picker with built-in validation.\n\n'
          + 'The `FileInputButton` component wraps a hidden `<input type="file">` behind a styled Button. '
          + 'It validates file types and sizes before calling your callback, making it a simpler alternative '
          + 'to Dropzone when drag-and-drop is not needed. Accepts all Button props (except `onClick`) plus '
          + '`accept`, `maxSize`, `minSize`, `multiple`, `onFileSelect`, and `onFileError`.',
      },
    },
  },
  argTypes: {
    disabled: { control: 'boolean' },
    multiple: { control: 'boolean' },
    type: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'quaternary'],
    },
    theme: {
      control: 'select',
      options: ['solid', 'light', 'outline', 'borderless'],
    },
    size: {
      control: 'select',
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
  parameters: {
    docs: {
      description: {
        story:
          'Basic file picker button. Clicking it opens the native file dialog. '
          + 'Use the controls to toggle `disabled`, `multiple`, or change the button appearance.',
      },
    },
  },
  render: args => (
    <FileInputButton
      {...args}
      onFileSelect={files => alert(`Selected: ${files.map(f => f.name).join(', ')}`)}
      onFileError={err => alert(err.message)}
    />
  ),
}

export const WithAcceptedTypesAndSizeLimit: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Pass `accept` to restrict which file types are allowed and `maxSize` to set a byte ceiling. '
          + 'Files that fail validation trigger `onFileError` instead of `onFileSelect`.',
      },
    },
  },
  render: () => (
    <FileInputButton
      accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] }}
      maxSize={5 * 1024 * 1024}
      onFileSelect={files => alert(`Images: ${files.map(f => f.name).join(', ')}`)}
      onFileError={err => alert(err.message)}
    >
      Upload Image
    </FileInputButton>
  ),
}

export const MultipleFiles: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Set `multiple` to `true` to allow selecting more than one file at a time. '
          + 'All selected files are passed together to `onFileSelect`.',
      },
    },
  },
  render: () => (
    <FileInputButton
      accept={{ 'application/json': ['.json'] }}
      multiple
      onFileSelect={files => alert(`JSON files: ${files.map(f => f.name).join(', ')}`)}
      onFileError={err => alert(err.message)}
      type="tertiary"
      theme="outline"
    >
      Upload JSON (Multiple)
    </FileInputButton>
  ),
}
