import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@datum-cloud/datum-ui/dropzone'
import { useState } from 'react'

interface DropzoneStoryArgs {
  disabled: boolean
}

const meta: Meta<DropzoneStoryArgs> = {
  title: 'Features/Dropzone',
  parameters: {
    docs: {
      description: {
        component:
          'A drag-and-drop file upload area with empty state and content previews.\n\n'
          + 'The `Dropzone` component provides a drag-and-drop file upload area built on `react-dropzone`. '
          + 'It uses compound sub-components (`DropzoneEmptyState` and `DropzoneContent`) to show different '
          + 'UI depending on whether files have been selected. Supports accepted file types, size limits, '
          + 'and multi-file uploads.\n\n'
          + 'Requires the `react-dropzone` package.',
      },
    },
  },
  argTypes: {
    disabled: { control: 'boolean' },
  },
  args: {
    disabled: false,
  },
}

export default meta

type Story = StoryObj<DropzoneStoryArgs>

function DefaultStory(args: DropzoneStoryArgs) {
  const [files, setFiles] = useState<File[] | undefined>(undefined)
  return (
    <div className="max-w-md">
      <Dropzone
        disabled={args.disabled}
        src={files}
        onDrop={accepted => setFiles(accepted)}
        onError={err => alert(err.message)}
      >
        <DropzoneEmptyState
          label="Drop files here or click to upload"
          description="Drag and drop your files here"
        />
        <DropzoneContent />
      </Dropzone>
    </div>
  )
}

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Basic dropzone that switches between `DropzoneEmptyState` (no files) and `DropzoneContent` '
          + '(files selected). The `disabled` control disables all interaction.',
      },
    },
  },
  render: args => <DefaultStory {...args} />,
}

function WithConstraintsStory() {
  const [files, setFiles] = useState<File[] | undefined>(undefined)
  return (
    <div className="max-w-md">
      <Dropzone
        src={files}
        onDrop={accepted => setFiles(accepted)}
        onError={err => alert(err.message)}
        accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] }}
        maxSize={5 * 1024 * 1024}
        maxFiles={3}
      >
        <DropzoneEmptyState
          label="Upload images"
          description="PNG, JPG, GIF up to 5MB"
          showCaption
        />
        <DropzoneContent description="Drag and drop or click to replace" />
      </Dropzone>
    </div>
  )
}

export const WithFileTypeAndSizeConstraints: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Pass `accept` to restrict file types and `maxSize` to enforce a byte limit. '
          + 'Setting `showCaption` on `DropzoneEmptyState` auto-generates a caption from those constraints.',
      },
    },
  },
  render: () => <WithConstraintsStory />,
}

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Set `disabled` to `true` on `Dropzone` to prevent any file selection or drag interaction.',
      },
    },
  },
  render: () => (
    <div className="max-w-md">
      <Dropzone disabled src={undefined}>
        <DropzoneEmptyState
          label="Upload disabled"
          description="This dropzone is currently disabled"
        />
      </Dropzone>
    </div>
  ),
}
