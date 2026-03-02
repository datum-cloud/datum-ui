import type { Meta, StoryObj } from "@storybook/react";
import { TimeRangeDropdown } from "@datum-cloud/datum-ui";
import { useState } from "react";

const STANDARD_PRESETS = [
  { key: "1h", label: "Last 1 hour" },
  { key: "6h", label: "Last 6 hours" },
  { key: "24h", label: "Last 24 hours" },
  { key: "7d", label: "Last 7 days" },
  { key: "30d", label: "Last 30 days" },
];

const meta: Meta<typeof TimeRangeDropdown> = {
  component: TimeRangeDropdown,
  argTypes: {
    disabled: { control: "boolean" },
  },
};

export default meta;

type Story = StoryObj<typeof TimeRangeDropdown>;

export const Default: Story = {
  render: () => {
    const [selectedPreset, setSelectedPreset] = useState("1h");
    return (
      <TimeRangeDropdown
        presets={STANDARD_PRESETS}
        selectedPreset={selectedPreset}
        onPresetSelect={setSelectedPreset}
        onCustomRangeApply={() => {}}
      />
    );
  },
};

export const CustomRange: Story = {
  render: () => {
    const [selectedPreset, setSelectedPreset] = useState("custom");
    const [customStart, setCustomStart] = useState("2026-02-20T00:00");
    const [customEnd, setCustomEnd] = useState("2026-02-27T23:59");

    const handleCustomApply = (start: string, end: string) => {
      setCustomStart(start);
      setCustomEnd(end);
      setSelectedPreset("custom");
    };

    return (
      <TimeRangeDropdown
        presets={STANDARD_PRESETS}
        selectedPreset={selectedPreset}
        onPresetSelect={setSelectedPreset}
        onCustomRangeApply={handleCustomApply}
        customStart={customStart}
        customEnd={customEnd}
      />
    );
  },
};

export const WithCallback: Story = {
  render: () => {
    const [selectedPreset, setSelectedPreset] = useState("1h");
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");

    const selectedLabel =
      selectedPreset === "custom"
        ? customStart && customEnd
          ? `Custom: ${customStart} – ${customEnd}`
          : "Custom range"
        : (STANDARD_PRESETS.find((p) => p.key === selectedPreset)?.label ??
          "Unknown");

    const handleCustomApply = (start: string, end: string) => {
      setCustomStart(start);
      setCustomEnd(end);
      setSelectedPreset("custom");
    };

    return (
      <div className="flex flex-col gap-4">
        <TimeRangeDropdown
          presets={STANDARD_PRESETS}
          selectedPreset={selectedPreset}
          onPresetSelect={setSelectedPreset}
          onCustomRangeApply={handleCustomApply}
          customStart={customStart}
          customEnd={customEnd}
        />
        <p className="text-sm text-muted-foreground">
          Selected:{" "}
          <span className="font-medium text-foreground">{selectedLabel}</span>
        </p>
      </div>
    );
  },
};
