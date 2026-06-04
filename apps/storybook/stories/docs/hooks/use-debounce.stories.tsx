import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { useDebounce } from '@datum-cloud/datum-ui/hooks'
import { useEffect, useState } from 'react'

function DebounceDemo() {
  const [inputValue, setInputValue] = useState('')
  const [delay, setDelay] = useState(500)
  const debouncedValue = useDebounce(inputValue, delay)
  const [updateCount, setUpdateCount] = useState(0)

  useEffect(() => {
    if (debouncedValue !== '') {
      setUpdateCount(c => c + 1)
    }
  }, [debouncedValue])

  return (
    <div className="flex flex-col gap-6 p-4 max-w-md">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium" htmlFor="debounce-input">
          Search query
        </label>
        <input
          id="debounce-input"
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Type something..."
          className="rounded border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium" htmlFor="delay-input">
          Delay:
          {' '}
          <span className="font-mono">
            {delay}
            ms
          </span>
        </label>
        <input
          id="delay-input"
          type="range"
          min={100}
          max={2000}
          step={100}
          value={delay}
          onChange={e => setDelay(Number(e.target.value))}
          className="cursor-pointer"
        />
      </div>

      <div className="flex flex-col gap-1 rounded border border-border bg-muted/40 px-3 py-3 text-sm">
        <div className="flex gap-2">
          <span className="text-muted-foreground">Typed value:</span>
          <code className="font-mono">{inputValue || <em className="not-italic text-muted-foreground">empty</em>}</code>
        </div>
        <div className="flex gap-2">
          <span className="text-muted-foreground">Debounced value:</span>
          <code className="font-mono">{debouncedValue || <em className="not-italic text-muted-foreground">empty</em>}</code>
        </div>
        <div className="flex gap-2">
          <span className="text-muted-foreground">Debounced updates:</span>
          <code className="font-mono">{updateCount}</code>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        The debounced value only updates after you stop typing for
        {' '}
        <code className="font-mono">
          {delay}
          ms
        </code>
        . Adjust the delay slider to observe
        the effect.
      </p>
    </div>
  )
}

const meta: Meta = {
  title: 'Hooks/useDebounce',
  component: DebounceDemo,
  parameters: {
    docs: {
      description: {
        component:
          'Debounce a value with a configurable delay to limit update frequency.\n\n'
          + '`useDebounce<T>(value, delay)` delays propagating a value until `delay` milliseconds '
          + 'have passed without a new change. Use it to avoid excessive re-renders or API calls '
          + 'triggered by rapidly changing inputs such as search fields or sliders.',
      },
    },
  },
}

export default meta

type Story = StoryObj

export const Demo: Story = {
  render: () => <DebounceDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Type into the search field and observe that the debounced value only updates after '
          + 'you pause typing. Use the delay slider to adjust the debounce window in real time.',
      },
    },
  },
}
