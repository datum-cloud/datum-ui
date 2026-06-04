import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@datum-cloud/datum-ui/hover-card'
import { CalendarDays } from 'lucide-react'

const meta: Meta<typeof HoverCard> = {
  title: 'Base/HoverCard',
  component: HoverCard,
  parameters: {
    docs: {
      description: {
        component:
          'A floating preview card that appears on hover over a trigger element.\n\n'
          + 'HoverCard shows a floating preview card when the user hovers over a trigger element. '
          + 'It is useful for displaying supplementary information (user profiles, resource '
          + 'summaries, link previews) without requiring a click. Built on Radix UI\'s HoverCard primitive.',
      },
    },
  },
  argTypes: {
    openDelay: { control: 'number' },
    closeDelay: { control: 'number' },
  },
  args: {
    openDelay: 700,
    closeDelay: 300,
  },
}

export default meta

type Story = StoryObj<typeof HoverCard>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Hovering over the trigger link reveals a floating user profile card.',
      },
    },
  },
  render: args => (
    <div className="flex items-center justify-center py-16">
      <HoverCard {...args}>
        <HoverCardTrigger asChild>
          <a href="#" className="text-primary text-sm font-medium underline underline-offset-4">
            @datum-cloud
          </a>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="flex gap-4">
            <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold">
              D
            </div>
            <div className="flex flex-col gap-2">
              <div>
                <h4 className="text-sm font-semibold">Datum Cloud</h4>
                <p className="text-muted-foreground text-sm">
                  Building the next generation of cloud infrastructure.
                </p>
              </div>
              <div className="text-muted-foreground flex items-center gap-1 text-xs">
                <CalendarDays size={12} />
                <span>Joined December 2023</span>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
}

export const ResourcePreview: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A wider card (`w-80`) showing structured resource metadata — region, replica health, and last deployment time.',
      },
    },
  },
  render: () => (
    <div className="flex items-center justify-center py-16">
      <HoverCard>
        <HoverCardTrigger asChild>
          <span className="cursor-pointer font-mono text-sm underline">us-east-1-prod</span>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-semibold">Production Cluster</h4>
            <p className="text-muted-foreground text-xs">Region: us-east-1</p>
            <p className="text-muted-foreground text-xs">Replicas: 3 / 3 healthy</p>
            <p className="text-muted-foreground text-xs">Last deployed: 2 hours ago</p>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
}
