import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@datum-cloud/datum-ui/hover-card'
import { CalendarDays } from 'lucide-react'

const meta: Meta = {
  title: 'Base/HoverCard',
}

export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="flex items-center justify-center py-16">
      <HoverCard>
        <HoverCardTrigger asChild>
          <a
            href="#"
            className="text-primary text-sm font-medium underline underline-offset-4"
          >
            @datum-cloud
          </a>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-bold">
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
