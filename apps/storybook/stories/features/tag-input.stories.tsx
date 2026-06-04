import type { ComponentProps } from 'react'
import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { TagsInput } from '@datum-cloud/datum-ui/tag-input'
import { useState } from 'react'
import { z } from 'zod'

function WithDefaultTagsStory() {
  const [tags, setTags] = useState<string[]>(['React', 'TypeScript', 'Storybook'])
  return (
    <div className="w-80">
      <TagsInput value={tags} onValueChange={setTags} placeholder="Add more tags..." />
    </div>
  )
}

function WithMaxItemsStory() {
  const [tags, setTags] = useState<string[]>(['one', 'two'])
  return (
    <div className="w-80">
      <TagsInput value={tags} onValueChange={setTags} placeholder="Max 3 tags..." maxItems={3} />
    </div>
  )
}

const meta: Meta<typeof TagsInput> = {
  title: 'Features/TagInput',
  component: TagsInput,
  parameters: {
    docs: {
      description: {
        component:
          'An input field for adding and removing string tags with validation, paste support, and keyboard navigation.\n\n'
          + 'TagsInput lets users build a list of string values by typing and pressing Enter or comma. '
          + 'Tags display as badges that can be removed individually. The component supports paste splitting '
          + '(newlines, commas, semicolons), a `delimiters` prop to configure which keys confirm a tag, '
          + 'a `normalizer` function for case normalization or rejection, Zod-based `validator`, '
          + '`minItems`/`maxItems` limits, and keyboard navigation between tags.',
      },
    },
  },
  argTypes: {
    placeholder: { control: 'text' },
  },
  args: {
    placeholder: 'Type and press Enter...',
  },
}

export default meta

type Story = StoryObj<typeof TagsInput>

function DefaultStory(args: ComponentProps<typeof TagsInput>) {
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
}

function WithCustomDelimitersStory() {
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
}

function WithNormalizerStory() {
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
}

function WithZodValidatorStory() {
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
}

function AutoConfirmOnBlurStory() {
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
}

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Basic controlled usage — type a value and press Enter or comma to add it as a tag.',
      },
    },
  },
  render: args => <DefaultStory {...args} />,
}

export const WithDefaultTags: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Pre-populate the tag list by passing an initial `value` array.',
      },
    },
  },
  render: () => <WithDefaultTagsStory />,
}

export const WithMaxItems: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Use `maxItems` to limit the number of tags that can be added. New tags are rejected once the limit is reached.',
      },
    },
  },
  render: () => <WithMaxItemsStory />,
}

export const WithCustomDelimiters: Story = {
  name: 'WithCustomDelimiters (space, comma, semicolon)',
  parameters: {
    docs: {
      description: {
        story: 'Use `delimiters` to configure which keys confirm a tag. Here space, comma, and semicolon are all accepted in addition to Enter.',
      },
    },
  },
  render: () => <WithCustomDelimitersStory />,
}

export const WithNormalizer: Story = {
  name: 'WithNormalizer (lowercase + reject empty)',
  parameters: {
    docs: {
      description: {
        story: 'The `normalizer` function runs before validation and storage. Returning `null` rejects the tag; otherwise the returned string is used.',
      },
    },
  },
  render: () => <WithNormalizerStory />,
}

export const WithZodValidator: Story = {
  name: 'WithZodValidator (email only)',
  parameters: {
    docs: {
      description: {
        story: 'Pass a Zod schema to `validator` to validate each tag before adding. Invalid tags are rejected and the error is surfaced inline or via `onValidationError`.',
      },
    },
  },
  render: () => <WithZodValidatorStory />,
}

export const AutoConfirmOnBlur: Story = {
  name: 'AutoConfirmOnBlur',
  parameters: {
    docs: {
      description: {
        story: 'Any pending input value is confirmed as a tag when the input loses focus — useful for form submission flows.',
      },
    },
  },
  render: () => <AutoConfirmOnBlurStory />,
}
