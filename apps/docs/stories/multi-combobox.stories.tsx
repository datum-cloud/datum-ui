import type { Meta, StoryObj } from "@storybook/react";
import { MultiCombobox } from "@datum-cloud/datum-ui";
import { useState } from "react";

const meta: Meta<typeof MultiCombobox> = {
  component: MultiCombobox,
  argTypes: {
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    maxDisplayed: { control: "number" },
  },
};

export default meta;

type Story = StoryObj<typeof MultiCombobox>;

export const Default: Story = {
  render: () => {
    const [values, setValues] = useState<string[]>([]);
    return (
      <div className="w-72">
        <MultiCombobox
          values={values}
          onValuesChange={setValues}
          placeholder="Select labels..."
          searchPlaceholder="Search labels..."
          options={[
            { value: "frontend", label: "frontend" },
            { value: "backend", label: "backend" },
            { value: "api", label: "api" },
            { value: "database", label: "database" },
            { value: "cache", label: "cache" },
            { value: "auth", label: "auth" },
          ]}
        />
      </div>
    );
  },
};

export const WithCounts: Story = {
  render: () => {
    const [values, setValues] = useState<string[]>(["default"]);
    return (
      <div className="w-72">
        <MultiCombobox
          values={values}
          onValuesChange={setValues}
          placeholder="Select namespaces..."
          searchPlaceholder="Search namespaces..."
          options={[
            { value: "default", label: "default", count: 24 },
            { value: "kube-system", label: "kube-system", count: 11 },
            { value: "monitoring", label: "monitoring", count: 8 },
            { value: "ingress-nginx", label: "ingress-nginx", count: 3 },
            { value: "cert-manager", label: "cert-manager", count: 2 },
          ]}
        />
      </div>
    );
  },
};

export const MaxDisplayed: Story = {
  render: () => {
    const [values, setValues] = useState<string[]>([
      "frontend",
      "backend",
      "api",
      "database",
    ]);
    return (
      <div className="w-72">
        <MultiCombobox
          values={values}
          onValuesChange={setValues}
          placeholder="Select labels..."
          searchPlaceholder="Search labels..."
          maxDisplayed={1}
          options={[
            { value: "frontend", label: "frontend" },
            { value: "backend", label: "backend" },
            { value: "api", label: "api" },
            { value: "database", label: "database" },
            { value: "cache", label: "cache" },
            { value: "auth", label: "auth" },
          ]}
        />
      </div>
    );
  },
};

export const Loading: Story = {
  render: () => {
    const [values, setValues] = useState<string[]>([]);
    return (
      <div className="w-72">
        <MultiCombobox
          values={values}
          onValuesChange={setValues}
          placeholder="Loading namespaces..."
          loading
          options={[]}
        />
      </div>
    );
  },
};
