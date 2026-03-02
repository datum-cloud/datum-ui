import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox, Label } from "@datum-cloud/datum-ui";
import { useState } from "react";

const meta: Meta<typeof Checkbox> = {
  component: Checkbox,
  argTypes: {
    disabled: { control: "boolean" },
    checked: { control: false },
  },
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox id="default" {...args} />
      <Label htmlFor="default">Accept terms and conditions</Label>
    </div>
  ),
};

export const Checked: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox id="checked" defaultChecked {...args} />
      <Label htmlFor="checked">Already checked</Label>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox id="disabled-unchecked" disabled />
        <Label htmlFor="disabled-unchecked">Disabled unchecked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="disabled-checked" disabled defaultChecked />
        <Label htmlFor="disabled-checked">Disabled checked</Label>
      </div>
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Checkbox
            id="controlled"
            checked={checked}
            onCheckedChange={(val) => setChecked(val === true)}
          />
          <Label htmlFor="controlled">
            {checked ? "Checked" : "Unchecked"} — click to toggle
          </Label>
        </div>
      </div>
    );
  },
};

export const CheckboxGroup: Story = {
  render: () => {
    const items = [
      { id: "email", label: "Email notifications" },
      { id: "sms", label: "SMS notifications" },
      { id: "push", label: "Push notifications" },
    ];
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">Notification preferences</p>
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <Checkbox id={item.id} defaultChecked={item.id === "email"} />
            <Label htmlFor={item.id}>{item.label}</Label>
          </div>
        ))}
      </div>
    );
  },
};
