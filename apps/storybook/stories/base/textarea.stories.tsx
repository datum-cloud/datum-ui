import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Textarea } from '@datum-cloud/datum-ui/textarea'

const meta: Meta<typeof Textarea> = {
  title: 'Base/Textarea',
  component: Textarea,
  parameters: {
    docs: {
      description: {
        component:
          'A multi-line text input with auto-sizing and Datum design tokens.\n\n'
          + 'Textarea wraps a native `<textarea>` element with Datum styling. It uses `field-sizing: content` '
          + 'for automatic height adjustment as content grows, and integrates with the Datum theming system '
          + 'for consistent focus and border styles. Accepts all standard HTML `<textarea>` attributes.',
      },
    },
  },
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    rows: { control: 'number' },
  },
  args: {
    placeholder: 'Type your message...',
    disabled: false,
    readOnly: false,
    rows: 4,
  },
}

export default meta

type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Basic textarea with a placeholder. Height grows automatically with content.',
      },
    },
  },
}

export const WithRows: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Set a minimum visible height with the `rows` prop.',
      },
    },
  },
  args: {
    placeholder: 'Write a description...',
    rows: 4,
  },
}

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Set `disabled` to prevent interaction and render the textarea in a visually muted state.',
      },
    },
  },
  args: {
    disabled: true,
    placeholder: 'Disabled textarea',
  },
}
