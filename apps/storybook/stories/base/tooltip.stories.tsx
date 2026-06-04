import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Button } from '@datum-cloud/datum-ui/button'
import { Tooltip } from '@datum-cloud/datum-ui/tooltip'

const meta: Meta<typeof Tooltip> = {
  title: 'Base/Tooltip',
  component: Tooltip,
  parameters: {
    docs: {
      description: {
        component:
          'Display contextual information when hovering or focusing on a trigger element.\n\n'
          + 'Tooltip wraps Radix UI tooltip primitives into a single convenient component. Pass a `message` '
          + 'and wrap any element as the trigger. Supports positioning via `side` and `align`, delay '
          + 'customization via `delayDuration`, and controlled open state via `open` and `onOpenChange`.\n\n'
          + '**Mobile long-press support**: On touch devices the tooltip activates after a 500 ms press and '
          + 'auto-dismisses after 1 500 ms. No tap-away is needed. This behaviour cannot be demoed directly '
          + 'in Storybook because the canvas does not simulate touch events — use a real mobile device or '
          + 'browser DevTools touch emulation to verify it.',
      },
    },
  },
  argTypes: {
    message: { control: 'text' },
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
    delayDuration: { control: 'number' },
  },
  args: {
    message: 'This is a tooltip',
    side: 'top',
    delayDuration: 0,
  },
}

export default meta

type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Basic tooltip wrapping a button trigger. Hover to reveal the message.',
      },
    },
  },
  render: args => (
    <div className="flex items-center justify-center p-20">
      <Tooltip {...args}>
        <button type="button" className="rounded-md border px-4 py-2 text-sm">
          Hover me
        </button>
      </Tooltip>
    </div>
  ),
}

export const Positioning: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Use the `side` prop to control where the tooltip appears relative to the trigger.',
      },
    },
  },
  render: () => (
    <div className="flex items-center justify-center gap-4 p-20">
      <Tooltip message="Top tooltip" side="top">
        <Button type="secondary" theme="outline">Top</Button>
      </Tooltip>
      <Tooltip message="Right tooltip" side="right">
        <Button type="secondary" theme="outline">Right</Button>
      </Tooltip>
      <Tooltip message="Bottom tooltip" side="bottom">
        <Button type="secondary" theme="outline">Bottom</Button>
      </Tooltip>
      <Tooltip message="Left tooltip" side="left">
        <Button type="secondary" theme="outline">Left</Button>
      </Tooltip>
    </div>
  ),
}

export const WithCustomDelay: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Use `delayDuration` to control the delay in milliseconds before the tooltip appears.',
      },
    },
  },
  render: () => (
    <div className="flex items-center justify-center p-20">
      <Tooltip message="Appears after 500ms" delayDuration={500}>
        <Button type="secondary" theme="outline">Slow tooltip</Button>
      </Tooltip>
    </div>
  ),
}

export const RichContent: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The `message` prop accepts `ReactNode` for rich tooltip content including formatted text.',
      },
    },
  },
  render: () => (
    <div className="flex items-center justify-center p-20">
      <Tooltip message={(
        <span>
          <strong>Bold</strong>
          {' '}
          and
          {' '}
          <em>italic</em>
          {' '}
          content
        </span>
      )}
      >
        <Button type="secondary" theme="outline">Rich tooltip</Button>
      </Tooltip>
    </div>
  ),
}
