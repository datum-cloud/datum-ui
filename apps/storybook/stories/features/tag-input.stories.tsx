import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { TagsInput } from '@datum-cloud/datum-ui/tag-input'
import { useState } from 'react'
import { z } from 'zod'

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

export const WithCustomDelimiters: Story = {
  name: 'WithCustomDelimiters (space, comma, semicolon)',
  render: () => {
    const [tags, setTags] = useState<string[]>([])
    return (
      <div className="w-80 space-y-2">
        <TagsInput
          value={tags}
          onValueChange={setTags}
          placeholder="Press space, comma, or semicolon"
          delimiters={[' ', ',', ';', 'Enter']}
        />
        <p className="text-muted-foreground text-xs">
          Any of the configured keys confirms the current input as a tag.
        </p>
      </div>
    )
  },
}

export const WithNormalizer: Story = {
  name: 'WithNormalizer (lowercase + reject empty)',
  render: () => {
    const [tags, setTags] = useState<string[]>([])
    return (
      <div className="w-80 space-y-2">
        <TagsInput
          value={tags}
          onValueChange={setTags}
          placeholder="Uppercase becomes lowercase"
          normalizer={raw => raw.trim().toLowerCase() || null}
        />
        <p className="text-muted-foreground text-xs">
          Tags are lowercased before storage. Empty trimmed values are rejected.
        </p>
      </div>
    )
  },
}

export const WithZodValidator: Story = {
  name: 'WithZodValidator (email only)',
  render: () => {
    const [tags, setTags] = useState<string[]>([])
    const [error, setError] = useState<string | null>(null)
    return (
      <div className="w-80 space-y-2">
        <TagsInput
          value={tags}
          onValueChange={setTags}
          placeholder="user@example.com"
          validator={z.string().email('Must be a valid email')}
          onValidationError={setError}
        />
        {error && <p className="text-destructive text-xs">{error}</p>}
        <p className="text-muted-foreground text-xs">
          Tags are rejected if they are not valid email addresses.
        </p>
      </div>
    )
  },
}

export const AutoConfirmOnBlur: Story = {
  name: 'AutoConfirmOnBlur',
  render: () => {
    const [tags, setTags] = useState<string[]>([])
    return (
      <div className="w-80 space-y-3">
        <TagsInput
          value={tags}
          onValueChange={setTags}
          placeholder="Type and blur to confirm"
        />
        <button
          type="button"
          className="rounded border px-3 py-1.5 text-sm"
        >
          Submit (click to blur input above)
        </button>
        <p className="text-muted-foreground text-xs">
          Typing a value then clicking Submit (or tabbing away) confirms the pending tag.
        </p>
      </div>
    )
  },
}
