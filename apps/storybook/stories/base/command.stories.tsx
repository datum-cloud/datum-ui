import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@datum-cloud/datum-ui/command'
import { Calculator, Calendar, CreditCard, Settings, Smile, User } from 'lucide-react'

const meta: Meta<typeof Command> = {
  title: 'Base/Command',
  component: Command,
  parameters: {
    docs: {
      description: {
        component:
          'A searchable command palette for quick navigation and action execution.\n\n'
          + 'Command provides a searchable, keyboard-navigable list of actions, inspired by the '
          + 'command palettes in VS Code and Linear. It is built on '
          + '[cmdk](https://cmdk.paco.me/) and can be used inline or inside a dialog overlay '
          + '(`CommandDialog`). Items are automatically filtered as the user types.',
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof Command>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'An inline command palette with grouped items, a separator, and keyboard shortcuts.',
      },
    },
  },
  render: args => (
    <Command className="rounded-lg border shadow-md md:min-w-[450px]" {...args}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <Calendar className="mr-2 size-4" />
            Calendar
          </CommandItem>
          <CommandItem>
            <Smile className="mr-2 size-4" />
            Search Emoji
          </CommandItem>
          <CommandItem>
            <Calculator className="mr-2 size-4" />
            Calculator
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <User className="mr-2 size-4" />
            Profile
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <CreditCard className="mr-2 size-4" />
            Billing
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Settings className="mr-2 size-4" />
            Settings
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
}
