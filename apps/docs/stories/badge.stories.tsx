import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "@datum-cloud/datum-ui";
import { Circle } from "lucide-react";

const meta: Meta<typeof Badge> = {
  component: Badge,
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "secondary", "destructive", "outline"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    variant: "default",
    children: "Production",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Staging",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Deprecated",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Beta",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge variant="default">Production</Badge>
      <Badge variant="secondary">Staging</Badge>
      <Badge variant="destructive">Deprecated</Badge>
      <Badge variant="outline">Beta</Badge>
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge variant="default">
        <Circle className="size-2 fill-current" />
        Active
      </Badge>
      <Badge variant="secondary">
        <Circle className="size-2 fill-current" />
        Pending
      </Badge>
      <Badge variant="destructive">
        <Circle className="size-2 fill-current" />
        Failed
      </Badge>
      <Badge variant="outline">
        <Circle className="size-2 fill-current" />
        Unknown
      </Badge>
    </div>
  ),
};
