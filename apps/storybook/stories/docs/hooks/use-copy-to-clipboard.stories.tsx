import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { Button } from '@datum-cloud/datum-ui/button'
import { useCopyToClipboard } from '@datum-cloud/datum-ui/hooks'
import { useState } from 'react'

const SAMPLE_TEXT = 'npm install @datum-cloud/datum-ui'

function CopyToClipboardDemo() {
  const [isCopied, copy] = useCopyToClipboard()
  const [withToast, setWithToast] = useState(false)

  return (
    <div className="flex flex-col gap-6 p-4 max-w-md">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">Text to copy:</p>
        <code className="rounded bg-muted px-3 py-2 text-sm font-mono">{SAMPLE_TEXT}</code>
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="primary"
          theme="solid"
          onClick={() => copy(SAMPLE_TEXT, withToast ? { withToast: true, toastMessage: 'Install command copied!' } : undefined)}
        >
          {isCopied ? 'Copied!' : 'Copy to clipboard'}
        </Button>

        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <input
            type="checkbox"
            checked={withToast}
            onChange={e => setWithToast(e.target.checked)}
            className="cursor-pointer"
          />
          Show toast
        </label>
      </div>

      <p className="text-xs text-muted-foreground">
        The
        {' '}
        <code className="font-mono">isCopied</code>
        {' '}
        flag resets to
        {' '}
        <code className="font-mono">false</code>
        {' '}
        automatically after 2 seconds.
      </p>
    </div>
  )
}

const meta: Meta = {
  title: 'Hooks/useCopyToClipboard',
  component: CopyToClipboardDemo,
  parameters: {
    docs: {
      description: {
        component:
          'Copy text to the clipboard with a transient success state and optional toast notification.\n\n'
          + '`useCopyToClipboard` returns a tuple `[isCopied, copy]`. '
          + 'The `isCopied` flag is `true` for 2 seconds after a successful copy, then resets automatically. '
          + 'The optional `withToast` option triggers a success toast on copy.',
      },
    },
  },
}

export default meta

type Story = StoryObj

export const Demo: Story = {
  render: () => <CopyToClipboardDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Click the button to copy the install command to your clipboard. '
          + 'Enable the "Show toast" checkbox to also trigger a toast notification.',
      },
    },
  },
}
