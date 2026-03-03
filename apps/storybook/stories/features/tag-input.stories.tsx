import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { TagsInput } from '@datum-cloud/datum-ui'
import { useState } from 'react'

const meta: Meta<typeof TagsInput> = {
  title: 'Features/TagInput',
  component: TagsInput,
}

export default meta

type Story = StoryObj<typeof TagsInput>

export const Default: Story = {
  render: () => {
    const [tags, setTags] = useState<string[]>([])
    return (
      <TagsInput
        value={tags}
        onValueChange={setTags}
        placeholder="Type and press Enter..."
      />
    )
  },
}

export const WithDefaultTags: Story = {
  render: () => {
    const [tags, setTags] = useState<string[]>(['React', 'TypeScript', 'Storybook'])
    return (
      <TagsInput
        value={tags}
        onValueChange={setTags}
        placeholder="Add more tags..."
      />
    )
  },
}

export const WithPlaceholder: Story = {
  render: () => {
    const [tags, setTags] = useState<string[]>([])
    return (
      <TagsInput
        value={tags}
        onValueChange={setTags}
        placeholder="Add email addresses..."
      />
    )
  },
}
