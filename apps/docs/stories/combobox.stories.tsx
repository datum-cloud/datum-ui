import type { Meta, StoryObj } from "@storybook/react";
import { Combobox } from "@datum-cloud/datum-ui";
import { useState } from "react";

const meta: Meta<typeof Combobox> = {
  component: Combobox,
  argTypes: {
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    clearable: { control: "boolean" },
    showAllOption: { control: "boolean" },
  },
};

export default meta;

type Story = StoryObj<typeof Combobox>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div className="w-64">
        <Combobox
          value={value}
          onValueChange={setValue}
          placeholder="Select a region..."
          searchPlaceholder="Search regions..."
          clearable
          options={[
            { value: "us-east-1", label: "US East (N. Virginia)" },
            { value: "us-west-2", label: "US West (Oregon)" },
            { value: "eu-west-1", label: "EU West (Ireland)" },
            { value: "ap-south-1", label: "AP South (Mumbai)" },
          ]}
        />
      </div>
    );
  },
};

export const WithAllOption: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div className="w-64">
        <Combobox
          value={value}
          onValueChange={setValue}
          placeholder="Select an environment..."
          searchPlaceholder="Search environments..."
          showAllOption
          allOptionLabel="All Environments"
          options={[
            { value: "production", label: "Production" },
            { value: "staging", label: "Staging" },
            { value: "development", label: "Development" },
          ]}
        />
      </div>
    );
  },
};

export const WithCounts: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div className="w-64">
        <Combobox
          value={value}
          onValueChange={setValue}
          placeholder="Select a resource type..."
          searchPlaceholder="Search resource types..."
          clearable
          options={[
            { value: "deployment", label: "Deployment", count: 42 },
            { value: "service", label: "Service", count: 18 },
            { value: "configmap", label: "ConfigMap", count: 7 },
            { value: "secret", label: "Secret", count: 3 },
            { value: "ingress", label: "Ingress", count: 5 },
          ]}
        />
      </div>
    );
  },
};

export const Loading: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div className="w-64">
        <Combobox
          value={value}
          onValueChange={setValue}
          placeholder="Loading regions..."
          loading
          options={[]}
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const [value, setValue] = useState("us-east-1");
    return (
      <div className="w-64">
        <Combobox
          value={value}
          onValueChange={setValue}
          placeholder="Select a region..."
          disabled
          options={[
            { value: "us-east-1", label: "US East (N. Virginia)" },
            { value: "us-west-2", label: "US West (Oregon)" },
            { value: "eu-west-1", label: "EU West (Ireland)" },
            { value: "ap-south-1", label: "AP South (Mumbai)" },
          ]}
        />
      </div>
    );
  },
};
