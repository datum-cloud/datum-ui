import type { Meta, StoryObj } from "@storybook/react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  Button,
  Input,
  Label,
} from "@datum-cloud/datum-ui";

const meta: Meta<typeof Dialog> = {
  component: Dialog,
};

export default meta;

type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="primary">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Add a new member to your organization. They will receive an email
            invitation to join.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="secondary" theme="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="primary">Send Invitation</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="primary">Create API Key</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create API Key</DialogTitle>
          <DialogDescription>
            Generate a new API key for programmatic access. Store it securely —
            it will only be shown once.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="key-name">Key Name</Label>
            <Input id="key-name" placeholder="e.g. CI/CD Pipeline" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="key-description">Description (optional)</Label>
            <Input
              id="key-description"
              placeholder="Describe how this key will be used"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="expiry">Expiration</Label>
            <Input id="expiry" placeholder="e.g. 90 days" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="secondary" theme="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="primary">Generate Key</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="danger">Delete Project</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            This will permanently delete{" "}
            <span className="font-semibold text-foreground">
              production-us-east
            </span>{" "}
            and all of its resources, including deployments, secrets, and
            configuration. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirm-name">
            Type the project name to confirm
          </Label>
          <Input
            id="confirm-name"
            placeholder="production-us-east"
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="secondary" theme="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="danger">Delete Project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Scrollable: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="secondary">View Terms of Service</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
          <DialogDescription>
            Last updated February 27, 2026. Please read these terms carefully.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 text-sm text-muted-foreground">
          <div>
            <h4 className="font-medium text-foreground mb-1">
              1. Acceptance of Terms
            </h4>
            <p>
              By accessing or using the Datum Cloud platform, you agree to be
              bound by these Terms of Service and all applicable laws and
              regulations. If you do not agree with any of these terms, you are
              prohibited from using or accessing the platform.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-1">
              2. Use License
            </h4>
            <p>
              Permission is granted to temporarily access the Datum Cloud
              platform for personal, non-commercial transitory viewing only.
              This is the grant of a license, not a transfer of title, and under
              this license you may not modify or copy the materials; use the
              materials for any commercial purpose or for any public display;
              attempt to decompile or reverse engineer any software.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-1">
              3. Data Processing
            </h4>
            <p>
              Datum Cloud processes data you provide in accordance with our
              Privacy Policy. By using the platform, you consent to the
              collection, storage, and processing of your data as described
              therein. We implement industry-standard security measures to
              protect your information.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-1">
              4. Service Availability
            </h4>
            <p>
              We strive to maintain 99.9% uptime but do not guarantee
              uninterrupted access to the platform. Scheduled maintenance
              windows will be communicated at least 48 hours in advance.
              Emergency maintenance may occur without prior notice.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-1">
              5. Limitation of Liability
            </h4>
            <p>
              In no event shall Datum Cloud or its suppliers be liable for any
              damages (including, without limitation, damages for loss of data or
              profit, or due to business interruption) arising out of the use or
              inability to use the platform, even if Datum Cloud has been
              notified orally or in writing of the possibility of such damage.
            </p>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="secondary" theme="outline">
              Decline
            </Button>
          </DialogClose>
          <Button type="primary">Accept Terms</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
