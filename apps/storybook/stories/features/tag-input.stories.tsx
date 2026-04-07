import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { TagsInput } from '@datum-cloud/datum-ui/tag-input'
import { useState } from 'react'

const meta: Meta<typeof TagsInput> = {
  title: 'Features/TagInput',
  component: TagsInput,
  argTypes: {
    placeholder: { control: 'text' },
  },
  args: {
    placeholder: 'Type and press Enter...',
  },
}

export default meta

type Story = StoryObj<typeof TagsInput>

export const Default: Story = {
  render: (args) => {
    const [tags, setTags] = useState<string[]>(['React', 'TypeScript'])
    return (
      <div className="w-80">
        <TagsInput
          {...args}
          value={tags}
          onValueChange={setTags}
        />
      </div>
    )
  },
}
