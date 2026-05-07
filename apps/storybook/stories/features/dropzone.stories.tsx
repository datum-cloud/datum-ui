import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@datum-cloud/datum-ui/dropzone'
import { useState } from 'react'

interface DropzoneStoryArgs {
  disabled: boolean
}

const meta: Meta<DropzoneStoryArgs> = {
  title: 'Features/Dropzone',
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
  render: args => <DefaultStory {...args} />,
}
