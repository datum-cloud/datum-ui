import type { Meta, StoryObj } from "@storybook/react";
import { Textarea, Label } from "@datum-cloud/datum-ui";

const meta: Meta<typeof Textarea> = {
  component: Textarea,
  argTypes: {
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    rows: { control: { type: "number" } },
  },
};

export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2 w-80">
      <Label htmlFor="bio">Bio</Label>
      <Textarea id="bio" placeholder="Tell us about yourself..." {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "This textarea is disabled and cannot be edited.",
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    value: "This content is read-only.",
  },
};

export const WithCharacterCount: Story = {
  render: () => {
    const max = 200;
    return (
      <div className="flex flex-col gap-2 w-80">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter a description..."
          maxLength={max}
        />
        <p className="text-muted-foreground text-xs text-right">0 / {max}</p>
      </div>
    );
  },
};

export const FixedHeight: Story = {
  args: {
    placeholder: "This textarea has a fixed height via rows...",
    rows: 6,
    className: "field-sizing-fixed",
  },
};
