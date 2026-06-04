import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Button } from '@datum-cloud/datum-ui/button'
import { startProgress, stopProgress } from '@datum-cloud/datum-ui/nprogress'

const meta: Meta = {
  title: 'Features/NProgress',
  parameters: {
    docs: {
      description: {
        component:
          'A slim page-transition progress bar displayed at the top of the viewport.\n\n'
          + 'NProgress wraps the [nprogress](https://ricostacruz.com/nprogress/) library with a 150 ms debounced '
          + 'start (to avoid flashing on fast navigations) and custom Datum styling via CSS. '
          + 'This is not a visual React component — it is a set of utility functions (`configureProgress`, '
          + '`startProgress`, `stopProgress`) called during navigation lifecycle events. '
          + 'Import the CSS once at app root with `@import \'@datum-cloud/datum-ui/nprogress\'` and call '
          + '`configureProgress()` at startup. The bar color follows `var(--primary)` by default.\n\n'
          + '**External dependency:** `nprogress`',
      },
    },
  },
}

export default meta

type Story = StoryObj

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Click "Start Progress" to trigger the progress bar at the top of the Storybook viewport. '
          + 'Click "Stop Progress" to immediately complete and dismiss it. '
          + 'In a real app, call `startProgress()` when a navigation begins and `stopProgress()` when it completes.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground text-sm">
        Click &quot;Start&quot; to show the progress bar at the top of the page.
        Click &quot;Stop&quot; to dismiss it.
      </p>
      <div className="flex gap-3">
        <Button type="primary" onClick={() => startProgress()}>
          Start Progress
        </Button>
        <Button type="secondary" theme="outline" onClick={() => stopProgress()}>
          Stop Progress
        </Button>
      </div>
    </div>
  ),
}
