import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { DateTime } from '@datum-cloud/datum-ui/date-time'

const SAMPLE_DATE = '2026-08-13T11:35:28.300Z'

const meta: Meta<typeof DateTime> = {
  title: 'Features/DateTime',
  component: DateTime,
  parameters: {
    docs: {
      description: {
        component:
          'Display a date with the shared Datum hover tooltip: UTC, the viewer timezone, relative time, and epoch.\n\n'
          + '`variant="detailed"` (the default) shows a friendly absolute date and the full tooltip on hover. '
          + 'Pass `timezone` to pin a zone; otherwise the browser timezone is used. '
          + 'Use `format` for a custom date-fns pattern, or `children` to supply your own trigger.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['detailed', 'absolute', 'relative', 'both'],
    },
    tooltip: {
      control: 'select',
      options: ['auto', 'timezone', 'alternate', true, false],
    },
  },
  args: {
    date: SAMPLE_DATE,
    variant: 'detailed',
    timezone: 'UTC',
  },
}

export default meta

type Story = StoryObj<typeof DateTime>

export const Detailed: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default table/list treatment. Hover to see UTC, timezone, relative, and timestamp.',
      },
    },
  },
}

export const Relative: Story = {
  args: {
    variant: 'relative',
  },
}

export const CompactLog: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Log-table style: compact mono trigger, same detailed tooltip.',
      },
    },
  },
  args: {
    format: 'MMM dd HH:mm:ss.SS',
    className: 'text-muted-foreground font-mono text-xs uppercase whitespace-nowrap',
  },
}
