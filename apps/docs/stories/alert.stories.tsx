import type { Meta, StoryObj } from "@storybook/react";
import { Alert, AlertDescription, AlertTitle } from "@datum-cloud/datum-ui";
import {
  AlertCircle,
  CheckCircle,
  InfoIcon,
  TriangleAlert,

} from "lucide-react";

const meta: Meta<typeof Alert> = {
  component: Alert,
  argTypes: {
    variant: {
      control: { type: "select" },
      options: [
        "default",
        "secondary",
        "outline",
        "destructive",
        "success",
        "info",
        "warning",
      ],
    },
    closable: {
      control: { type: "boolean" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  args: {
    variant: "default",
  },
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the cli.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
  },
  render: (args) => (
    <Alert {...args}>
      <AlertCircle className="size-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again.
      </AlertDescription>
    </Alert>
  ),
};

export const Success: Story = {
  args: {
    variant: "success",
  },
  render: (args) => (
    <Alert {...args}>
      <CheckCircle className="size-4" />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>
        Your changes have been saved successfully.
      </AlertDescription>
    </Alert>
  ),
};

export const Info: Story = {
  args: {
    variant: "info",
  },
  render: (args) => (
    <Alert {...args}>
      <InfoIcon className="size-4" />
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        A new software update is available. Check it out!
      </AlertDescription>
    </Alert>
  ),
};

export const Warning: Story = {
  args: {
    variant: "warning",
  },
  render: (args) => (
    <Alert {...args}>
      <TriangleAlert className="size-4" />
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>
        Your account is approaching its storage limit.
      </AlertDescription>
    </Alert>
  ),
};

export const Closable: Story = {
  args: {
    variant: "info",
    closable: true,
  },
  render: (args) => (
    <Alert {...args}>
      <InfoIcon className="size-4" />
      <AlertTitle>Dismissible</AlertTitle>
      <AlertDescription>
        Click the close button to dismiss this alert.
      </AlertDescription>
    </Alert>
  ),
};

export const DescriptionOnly: Story = {
  args: {
    variant: "default",
  },
  render: (args) => (
    <Alert {...args}>
      <AlertDescription>
        This is a simple alert without a title.
      </AlertDescription>
    </Alert>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Alert variant="default">
        <AlertTitle>Default</AlertTitle>
        <AlertDescription>This is a default alert.</AlertDescription>
      </Alert>
      <Alert variant="secondary">
        <AlertTitle>Secondary</AlertTitle>
        <AlertDescription>This is a secondary alert.</AlertDescription>
      </Alert>
      <Alert variant="outline">
        <AlertTitle>Outline</AlertTitle>
        <AlertDescription>This is an outline alert.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertCircle className="size-4" />
        <AlertTitle>Destructive</AlertTitle>
        <AlertDescription>This is a destructive alert.</AlertDescription>
      </Alert>
      <Alert variant="success">
        <CheckCircle className="size-4" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>This is a success alert.</AlertDescription>
      </Alert>
      <Alert variant="info">
        <Info className="size-4" />
        <AlertTitle>Info</AlertTitle>
        <AlertDescription>This is an info alert.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <TriangleAlert className="size-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>This is a warning alert.</AlertDescription>
      </Alert>
    </div>
  ),
};
