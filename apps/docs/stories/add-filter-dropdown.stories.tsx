import type { Meta, StoryObj } from "@storybook/react";
import { AddFilterDropdown, FilterChip } from "@datum-cloud/datum-ui";
import { useState } from "react";
import { TagIcon, AlertCircleIcon, ServerIcon, LayoutGridIcon } from "lucide-react";

const AVAILABLE_FILTERS = [
  { id: "kind", label: "Kind", icon: <TagIcon className="size-3.5" /> },
  {
    id: "reason",
    label: "Reason",
    icon: <AlertCircleIcon className="size-3.5" />,
  },
  { id: "source", label: "Source", icon: <ServerIcon className="size-3.5" /> },
  {
    id: "namespace",
    label: "Namespace",
    icon: <LayoutGridIcon className="size-3.5" />,
  },
];

const meta: Meta<typeof AddFilterDropdown> = {
  component: AddFilterDropdown,
  argTypes: {
    disabled: { control: "boolean" },
    hasActiveFilters: { control: "boolean" },
  },
};

export default meta;

type Story = StoryObj<typeof AddFilterDropdown>;

export const Default: Story = {
  render: () => {
    const [activeFilterIds, setActiveFilterIds] = useState<string[]>([]);
    return (
      <AddFilterDropdown
        availableFilters={AVAILABLE_FILTERS}
        activeFilterIds={activeFilterIds}
        onAddFilter={(id) => setActiveFilterIds((prev) => [...prev, id])}
        hasActiveFilters={false}
      />
    );
  },
};

export const WithActiveFilters: Story = {
  render: () => {
    const [activeFilterIds, setActiveFilterIds] = useState<string[]>([
      "kind",
      "namespace",
    ]);
    return (
      <AddFilterDropdown
        availableFilters={AVAILABLE_FILTERS}
        activeFilterIds={activeFilterIds}
        onAddFilter={(id) => setActiveFilterIds((prev) => [...prev, id])}
        hasActiveFilters={true}
      />
    );
  },
};

export const FullFilterBar: Story = {
  render: () => {
    const [activeFilterIds, setActiveFilterIds] = useState<string[]>([
      "kind",
    ]);
    const [kindValues, setKindValues] = useState<string[]>([]);
    const [reasonValues, setReasonValues] = useState<string[]>([]);
    const [sourceValues, setSourceValues] = useState<string[]>([]);
    const [namespaceValues, setNamespaceValues] = useState<string[]>([]);

    const handleAddFilter = (id: string) => {
      setActiveFilterIds((prev) =>
        prev.includes(id) ? prev : [...prev, id]
      );
    };

    const handleRemoveFilter = (id: string) => {
      setActiveFilterIds((prev) => prev.filter((f) => f !== id));
    };

    const filterValueMap: Record<string, string[]> = {
      kind: kindValues,
      reason: reasonValues,
      source: sourceValues,
      namespace: namespaceValues,
    };

    const filterSetterMap: Record<string, (values: string[]) => void> = {
      kind: setKindValues,
      reason: setReasonValues,
      source: setSourceValues,
      namespace: setNamespaceValues,
    };

    const filterOptionsMap: Record<
      string,
      { value: string; label: string }[]
    > = {
      kind: [
        { value: "NORMAL", label: "NORMAL" },
        { value: "WARNING", label: "WARNING" },
        { value: "Default", label: "Default" },
      ],
      source: [
        { value: "kubelet", label: "kubelet" },
        { value: "controller-manager", label: "controller-manager" },
        { value: "scheduler", label: "scheduler" },
      ],
      namespace: [
        { value: "default", label: "default" },
        { value: "kube-system", label: "kube-system" },
        { value: "monitoring", label: "monitoring" },
      ],
      reason: [],
    };

    const filterInputModeMap: Record<string, "typeahead" | "text"> = {
      kind: "typeahead",
      source: "typeahead",
      namespace: "typeahead",
      reason: "text",
    };

    return (
      <div className="flex flex-wrap items-center gap-2">
        <AddFilterDropdown
          availableFilters={AVAILABLE_FILTERS}
          activeFilterIds={activeFilterIds}
          onAddFilter={handleAddFilter}
          hasActiveFilters={activeFilterIds.length > 0}
        />
        {activeFilterIds.map((filterId) => {
          const filter = AVAILABLE_FILTERS.find((f) => f.id === filterId);
          if (!filter) return null;
          return (
            <FilterChip
              key={filterId}
              label={filter.label}
              values={filterValueMap[filterId] ?? []}
              onValuesChange={filterSetterMap[filterId]}
              onClear={() => {
                filterSetterMap[filterId]([]);
                handleRemoveFilter(filterId);
              }}
              inputMode={filterInputModeMap[filterId] ?? "typeahead"}
              options={filterOptionsMap[filterId] ?? []}
            />
          );
        })}
      </div>
    );
  },
};
