import type { Meta, StoryObj } from "@storybook/react";
import { Label, Input, Checkbox } from "@datum-cloud/datum-ui";

const meta: Meta<typeof Label> = {
  component: Label,
  argTypes: {
    children: { control: "text" },
  },
};

export default meta;

type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: {
    children: "Field label",
  },
};

export const WithInput: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-72">
      <Label htmlFor="name">Full name</Label>
      <Input id="name" placeholder="Jane Smith" />
    </div>
  ),
};

export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">I agree to the terms of service</Label>
    </div>
  ),
};

export const DisabledPeer: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      <div className="flex flex-col gap-2">
        <Label htmlFor="active">Active field</Label>
        <Input id="active" placeholder="You can type here" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="disabled-field">Disabled field</Label>
        <Input id="disabled-field" placeholder="Cannot edit" disabled />
      </div>
    </div>
  ),
};
