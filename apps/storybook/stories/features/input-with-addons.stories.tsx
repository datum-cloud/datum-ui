import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { InputWithAddons } from '@datum-cloud/datum-ui/input-with-addons'
import { DollarSign, LinkIcon, Mail, Search } from 'lucide-react'

const meta: Meta<typeof InputWithAddons> = {
  title: 'Features/InputWithAddons',
  component: InputWithAddons,
  parameters: {
    docs: {
      description: {
        component:
          'A text input with optional leading and trailing addon slots for icons or text.\n\n'
          + 'The `InputWithAddons` component extends the standard input with `leading` and `trailing` '
          + 'addon slots. Use it to place icons, labels, or suffixes alongside the input field while '
          + 'maintaining a unified focus ring around the entire group. Accepts all standard HTML '
          + '`<input>` attributes plus `leading`, `trailing`, and `containerClassName`.',
      },
    },
  },
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: {
    placeholder: 'Enter text...',
    disabled: false,
  },
}

export default meta

type Story = StoryObj<typeof InputWithAddons>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Two common configurations side by side: a leading search icon and a combined '
          + 'leading icon + trailing text suffix.',
      },
    },
  },
  render: args => (
    <div className="flex w-80 flex-col gap-3">
      <InputWithAddons
        {...args}
        leading={<Search size={16} />}
        placeholder="Search..."
      />
      <InputWithAddons
        {...args}
        leading={<DollarSign size={16} />}
        trailing={<span className="text-muted-foreground text-xs">USD</span>}
        placeholder="0.00"
      />
    </div>
  ),
}

export const WithLeadingAddon: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Pass a `ReactNode` to `leading` to render content before the input field.',
      },
    },
  },
  render: args => (
    <div className="w-72">
      <InputWithAddons {...args} leading={<Search size={16} />} placeholder="Search..." />
    </div>
  ),
}

export const WithTrailingAddon: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Pass a `ReactNode` to `trailing` to render content after the input field.',
      },
    },
  },
  render: args => (
    <div className="w-72">
      <InputWithAddons {...args} trailing={<Mail size={16} />} placeholder="you@example.com" />
    </div>
  ),
}

export const WithBothAddons: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Both `leading` and `trailing` can be set at the same time. '
          + 'The focus ring surrounds the entire group.',
      },
    },
  },
  render: args => (
    <div className="w-72">
      <InputWithAddons
        {...args}
        leading={<LinkIcon size={16} />}
        trailing={<span className="text-muted-foreground text-xs">.com</span>}
        placeholder="your-website"
      />
    </div>
  ),
}
