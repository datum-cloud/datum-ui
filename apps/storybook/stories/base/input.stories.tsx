import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Input } from '@datum-cloud/datum-ui/input'

const meta: Meta<typeof Input> = {
  title: 'Base/Input',
  component: Input,
  parameters: {
    docs: {
      description: {
        component:
          'A styled text input field for capturing user input with built-in focus and error states.\n\n'
          + 'The `Input` component wraps a standard HTML `<input>` element with Datum design tokens '
          + 'for consistent styling. It supports all native input types, provides visual feedback '
          + 'for focus and invalid states, and integrates with the Datum theming system.',
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url', 'file'],
    },
    placeholder: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
    readOnly: {
      control: 'boolean',
    },
  },
  args: {
    type: 'text',
    placeholder: 'Enter text...',
    disabled: false,
    readOnly: false,
  },
}

export default meta

type Story = StoryObj<typeof Input>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A basic text input with placeholder text.',
      },
    },
  },
}

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Set the `disabled` prop to prevent interaction. The input renders with reduced opacity and a not-allowed cursor.',
      },
    },
  },
  args: {
    disabled: true,
    placeholder: 'Disabled input',
  },
}

export const ReadOnly: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Use `readOnly` to display a value that cannot be edited.',
      },
    },
  },
  args: {
    readOnly: true,
    value: 'Read-only value',
  },
}

export const InvalidState: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Add `aria-invalid` to trigger the destructive border style, typically used with form validation.',
      },
    },
  },
  args: {
    'aria-invalid': true,
    'placeholder': 'Invalid input',
  },
}
