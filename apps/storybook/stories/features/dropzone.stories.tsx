import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@datum-cloud/datum-ui/dropzone'
import { useState } from 'react'

const meta: Meta = {
  title: 'Features/Dropzone',
  argTypes: {
    disabled: {
      control: { type: 'boolean' },
    },
    maxFiles: {
      control: { type: 'number' },
    },
  },
  args: {
    disabled: false,
    maxFiles: 1,
  },
}

export default meta

type Story = StoryObj

export const Default: Story = {
  render: (args) => {
    const [files, setFiles] = useState<File[] | undefined>(undefined)
    return (
      <div className="max-w-md">
        <Dropzone
          {...args}
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
  },
}

export const WithContent: Story = {
  render: () => {
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
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="max-w-md">
      <Dropzone disabled>
        <DropzoneEmptyState
          label="Upload disabled"
          description="This dropzone is currently disabled"
        />
      </Dropzone>
    </div>
  ),
}
