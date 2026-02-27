import type { Meta, StoryObj } from "@storybook/react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
  Label,
} from "@datum-cloud/datum-ui";

const meta: Meta<typeof SelectTrigger> = {
  component: SelectTrigger,
  argTypes: {
    size: {
      control: { type: "radio" },
      options: ["default", "sm"],
    },
    disabled: { control: "boolean" },
  },
};

export default meta;

type Story = StoryObj<typeof SelectTrigger>;

export const Default: Story = {
  render: (args) => (
    <Select>
      <SelectTrigger className="w-56" {...args}>
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option-1">Option 1</SelectItem>
        <SelectItem value="option-2">Option 2</SelectItem>
        <SelectItem value="option-3">Option 3</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2 w-56">
      <Label htmlFor="region">Region</Label>
      <Select>
        <SelectTrigger id="region" {...args}>
          <SelectValue placeholder="Select a region" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="us-east">US East</SelectItem>
          <SelectItem value="us-west">US West</SelectItem>
          <SelectItem value="eu-west">EU West</SelectItem>
          <SelectItem value="ap-south">AP South</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Small: Story = {
  render: () => (
    <Select>
      <SelectTrigger size="sm" className="w-48">
        <SelectValue placeholder="Small trigger" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a">Option A</SelectItem>
        <SelectItem value="b">Option B</SelectItem>
        <SelectItem value="c">Option C</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-56">
      <div className="flex flex-col gap-1.5">
        <Label>Default (h-9)</Label>
        <Select>
          <SelectTrigger size="default">
            <SelectValue placeholder="Default size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Option 1</SelectItem>
            <SelectItem value="2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Small (h-8)</Label>
        <Select>
          <SelectTrigger size="sm">
            <SelectValue placeholder="Small size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Option 1</SelectItem>
            <SelectItem value="2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-64">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          <SelectItem value="est">Eastern Time (ET)</SelectItem>
          <SelectItem value="cst">Central Time (CT)</SelectItem>
          <SelectItem value="mst">Mountain Time (MT)</SelectItem>
          <SelectItem value="pst">Pacific Time (PT)</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
          <SelectItem value="cet">Central European Time (CET)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Disabled select" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1">Option 1</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const DisabledItems: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Some items disabled" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="free">Free</SelectItem>
        <SelectItem value="pro">Pro</SelectItem>
        <SelectItem value="enterprise" disabled>
          Enterprise (contact sales)
        </SelectItem>
      </SelectContent>
    </Select>
  ),
};
