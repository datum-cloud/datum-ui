import type { Meta, StoryObj } from "@storybook/react";
import { Button, Icon } from "@datum-cloud/datum-ui";
import {
  Search,
  Plus,
  Trash2,
  Settings,
  ChevronRight,
  Download,
  Upload,
  Edit,
  Copy,
  Check,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  None: undefined,
  Search: <Icon icon={Search} />,
  Plus: <Icon icon={Plus} />,
  Trash: <Icon icon={Trash2} />,
  Settings: <Icon icon={Settings} />,
  ChevronRight: <Icon icon={ChevronRight} />,
  Download: <Icon icon={Download} />,
  Upload: <Icon icon={Upload} />,
  Edit: <Icon icon={Edit} />,
  Copy: <Icon icon={Copy} />,
  Check: <Icon icon={Check} />,
};

const meta: Meta<typeof Button> = {
  component: Button,
  argTypes: {
    type: {
      control: { type: "select" },
      options: [
        "primary",
        "secondary",
        "tertiary",
        "quaternary",
        "warning",
        "danger",
        "success",
      ],
    },
    theme: {
      control: { type: "select" },
      options: ["solid", "light", "outline", "borderless", "link"],
    },
    size: {
      control: { type: "select" },
      options: ["xs", "small", "default", "large", "icon", "link"],
    },
    block: {
      control: { type: "boolean" },
    },
    loading: {
      control: { type: "boolean" },
    },
    disabled: {
      control: { type: "boolean" },
    },
    icon: {
      control: { type: "select" },
      options: Object.keys(iconMap),
      mapping: iconMap,
    },
    loadingIcon: {
      control: { type: "select" },
      options: Object.keys(iconMap),
      mapping: iconMap,
    },
    iconPosition: {
      control: { type: "radio" },
      options: ["left", "right"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: "Primary Button",
    type: "primary",
    theme: "solid",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary Button",
    type: "secondary",
    theme: "solid",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline Button",
    type: "primary",
    theme: "outline",
  },
};

export const Danger: Story = {
  args: {
    children: "Danger Button",
    type: "danger",
    theme: "solid",
  },
};

export const Loading: Story = {
  args: {
    children: "Loading...",
    type: "primary",
    theme: "solid",
    loading: true,
  },
};

export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button type="primary">Primary</Button>
      <Button type="secondary">Secondary</Button>
      <Button type="tertiary">Tertiary</Button>
      <Button type="quaternary">Quaternary</Button>
      <Button type="warning">Warning</Button>
      <Button type="danger">Danger</Button>
      <Button type="success">Success</Button>
    </div>
  ),
};

export const AllThemes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button type="primary" theme="solid">
        Solid
      </Button>
      <Button type="primary" theme="light">
        Light
      </Button>
      <Button type="primary" theme="outline">
        Outline
      </Button>
      <Button type="primary" theme="borderless">
        Borderless
      </Button>
      <Button type="primary" theme="link">
        Link
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button type="primary" size="xs">
        Extra Small
      </Button>
      <Button type="primary" size="small">
        Small
      </Button>
      <Button type="primary" size="default">
        Default
      </Button>
      <Button type="primary" size="large">
        Large
      </Button>
    </div>
  ),
};
