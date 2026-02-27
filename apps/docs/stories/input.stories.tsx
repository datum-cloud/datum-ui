import type { Meta, StoryObj } from "@storybook/react";
import { Input, Label } from "@datum-cloud/datum-ui";
import { Search, Mail, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const meta: Meta<typeof Input> = {
  component: Input,
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["text", "email", "password", "number", "search", "url", "tel"],
    },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="email">Email address</Label>
      <Input id="email" type="email" placeholder="you@example.com" {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled input",
    disabled: true,
    value: "Cannot edit this",
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    value: "Read-only value",
  },
};

export const Password: Story = {
  render: () => {
    const [show, setShow] = useState(false);
    return (
      <div className="relative flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={show ? "text" : "password"}
            placeholder="Enter your password"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="text-muted-foreground absolute inset-y-0 right-3 flex items-center"
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>
    );
  },
};

export const WithIcon: Story = {
  render: () => (
    <div className="relative">
      <Search className="text-muted-foreground absolute inset-y-0 left-3 my-auto size-4" />
      <Input placeholder="Search..." className="pl-9" />
    </div>
  ),
};

export const Types: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <div className="flex flex-col gap-1.5">
        <Label>Text</Label>
        <Input type="text" placeholder="Plain text" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Email</Label>
        <Input type="email" placeholder="you@example.com" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Number</Label>
        <Input type="number" placeholder="42" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>URL</Label>
        <Input type="url" placeholder="https://example.com" />
      </div>
    </div>
  ),
};
