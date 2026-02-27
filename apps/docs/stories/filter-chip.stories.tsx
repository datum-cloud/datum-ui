import type { Meta, StoryObj } from "@storybook/react";
import { FilterChip } from "@datum-cloud/datum-ui";
import { useState } from "react";

const meta: Meta<typeof FilterChip> = {
  component: FilterChip,
  argTypes: {
    disabled: { control: "boolean" },
    autoOpen: { control: "boolean" },
    inputMode: {
      control: { type: "radio" },
      options: ["typeahead", "text"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof FilterChip>;

export const TypeaheadMode: Story = {
  render: () => {
    const [values, setValues] = useState<string[]>([]);
    return (
      <FilterChip
        label="Kind"
        values={values}
        onValuesChange={setValues}
        onClear={() => setValues([])}
        inputMode="typeahead"
        searchPlaceholder="Search event types..."
        options={[
          { value: "NORMAL", label: "NORMAL" },
          { value: "WARNING", label: "WARNING" },
          { value: "Default", label: "Default" },
        ]}
      />
    );
  },
};

export const TextMode: Story = {
  render: () => {
    const [values, setValues] = useState<string[]>([]);
    return (
      <FilterChip
        label="Reason"
        values={values}
        onValuesChange={setValues}
        onClear={() => setValues([])}
        inputMode="text"
        placeholder="e.g. BackOff"
      />
    );
  },
};

export const WithAutoOpen: Story = {
  render: () => {
    const [values, setValues] = useState<string[]>([]);
    return (
      <div className="pt-10">
        <FilterChip
          label="Kind"
          values={values}
          onValuesChange={setValues}
          onClear={() => setValues([])}
          inputMode="typeahead"
          autoOpen
          searchPlaceholder="Search event types..."
          options={[
            { value: "NORMAL", label: "NORMAL" },
            { value: "WARNING", label: "WARNING" },
            { value: "Default", label: "Default" },
          ]}
        />
      </div>
    );
  },
};
