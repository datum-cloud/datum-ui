import type { Meta, StoryObj } from "@storybook/react";
import { Separator } from "@datum-cloud/datum-ui";

const meta: Meta<typeof Separator> = {
  component: Separator,
  argTypes: {
    orientation: {
      control: { type: "radio" },
      options: ["horizontal", "vertical"],
    },
    decorative: {
      control: { type: "boolean" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-96 flex flex-col gap-4">
      <div>
        <h4 className="text-sm font-medium">Deployment Settings</h4>
        <p className="text-sm text-muted-foreground">
          Configure how your application is deployed across regions.
        </p>
      </div>
      <Separator />
      <div>
        <h4 className="text-sm font-medium">Networking</h4>
        <p className="text-sm text-muted-foreground">
          Manage ingress rules, load balancers, and DNS configuration.
        </p>
      </div>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex items-center gap-4 text-sm">
      <span>Documentation</span>
      <Separator orientation="vertical" className="h-4" />
      <span>Changelog</span>
      <Separator orientation="vertical" className="h-4" />
      <span>API Reference</span>
      <Separator orientation="vertical" className="h-4" />
      <span>Support</span>
    </div>
  ),
};

export const WithText: Story = {
  render: () => (
    <div className="w-96 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          OR CONTINUE WITH
        </span>
        <Separator className="flex-1" />
      </div>
      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          ADVANCED OPTIONS
        </span>
        <Separator className="flex-1" />
      </div>
    </div>
  ),
};
