import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button, Tooltip } from "@datum-cloud/datum-ui";
import { CircleHelp, InfoIcon } from "lucide-react";

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
  argTypes: {
    message: { control: "text" },
    side: {
      control: { type: "select" },
      options: ["top", "right", "bottom", "left"],
    },
    align: {
      control: { type: "select" },
      options: ["start", "center", "end"],
    },
    delayDuration: { control: { type: "number" } },
    contentClassName: { control: "text" },
    children: { control: false },
    open: { control: false },
    onOpenChange: { control: false },
    arrowClassName: { control: false },
  },
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    message: "This is a helpful tooltip",
  },
  render: (args) => (
    <div className="flex items-center justify-center p-12">
      <Tooltip {...args}>
        <Button>Hover me</Button>
      </Tooltip>
    </div>
  ),
};

export const IconTrigger: Story = {
  args: {
    message: "More information about this field",
    side: "bottom",
  },
  render: (args) => (
    <div className="flex items-center justify-center p-12">
      <Tooltip {...args}>
        <InfoIcon className="text-muted-foreground size-4 cursor-help" />
      </Tooltip>
    </div>
  ),
};

export const RichContent: Story = {
  render: () => (
    <div className="flex items-center justify-center p-12">
      <Tooltip
        message={
          <div className="space-y-1">
            <p className="font-semibold">Requirements</p>
            <ul className="list-inside list-disc space-y-0.5">
              <li>At least 8 characters</li>
              <li>One uppercase letter</li>
              <li>One number</li>
            </ul>
          </div>
        }>
        <CircleHelp className="text-muted-foreground size-4 cursor-help" />
      </Tooltip>
    </div>
  ),
};

export const Sides: Story = {
  render: () => (
    <div className="flex items-center justify-center gap-8 p-16">
      <Tooltip message="Top tooltip" side="top">
        <Button type="secondary">Top</Button>
      </Tooltip>
      <Tooltip message="Right tooltip" side="right">
        <Button type="secondary">Right</Button>
      </Tooltip>
      <Tooltip message="Bottom tooltip" side="bottom">
        <Button type="secondary">Bottom</Button>
      </Tooltip>
      <Tooltip message="Left tooltip" side="left">
        <Button type="secondary">Left</Button>
      </Tooltip>
    </div>
  ),
};

export const DelayDurations: Story = {
  render: () => (
    <div className="flex items-center justify-center gap-4 p-12">
      <Tooltip message="No delay (0ms)" delayDuration={0}>
        <Button type="secondary">Instant</Button>
      </Tooltip>
      <Tooltip message="Default delay (200ms)" delayDuration={200}>
        <Button type="secondary">Default</Button>
      </Tooltip>
      <Tooltip message="Slow delay (800ms)" delayDuration={800}>
        <Button type="secondary">Slow</Button>
      </Tooltip>
    </div>
  ),
};

export const DynamicMessage: Story = {
  render: () => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    };

    return (
      <div className="flex items-center justify-center p-12">
        <Tooltip message={copied ? "Copied!" : "Copy to clipboard"} delayDuration={0}>
          <Button type="quaternary" theme="outline" onClick={handleCopy}>
            {copied ? "Copied" : "Copy"}
          </Button>
        </Tooltip>
      </div>
    );
  },
};
