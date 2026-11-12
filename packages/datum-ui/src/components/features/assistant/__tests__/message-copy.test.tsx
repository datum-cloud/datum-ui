/// <reference types="@testing-library/jest-dom/vitest" />
import type { UIMessage } from 'ai'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { COPY_RESET_DELAY_MS } from '../../../../hooks/use-copy-to-clipboard'
import { AssistantMessage } from '../components/message'

const message: UIMessage = {
  id: 'm1',
  role: 'assistant',
  parts: [{ type: 'text', text: 'Hello from the assistant' }],
}

function stubClipboard(value: unknown) {
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value })
}

function copyIcon(): HTMLElement {
  const icon = screen.getByRole('button', { name: 'Copy message' }).querySelector<HTMLElement>('[data-slot="copy-state-icon"]')
  if (!icon) {
    throw new Error('copy state icon not rendered')
  }
  return icon
}

/** Clicks the copy action and lets the hook's async clipboard write settle. */
async function clickCopy() {
  fireEvent.click(screen.getByRole('button', { name: 'Copy message' }))
  await act(async () => {})
}

describe('assistant message copy action', () => {
  afterEach(() => {
    vi.useRealTimers()
    Reflect.deleteProperty(navigator, 'clipboard')
  })

  it('copies the message text and shows the copied icon until the reset delay passes', async () => {
    vi.useFakeTimers()
    const writeText = vi.fn().mockResolvedValue(undefined)
    stubClipboard({ writeText })
    render(<AssistantMessage msg={message} isLastMessage status="ready" />)

    expect(copyIcon()).toHaveAttribute('data-copied', 'false')

    await clickCopy()

    expect(writeText).toHaveBeenCalledWith('Hello from the assistant')
    expect(copyIcon()).toHaveAttribute('data-copied', 'true')

    act(() => {
      vi.advanceTimersByTime(COPY_RESET_DELAY_MS)
    })

    expect(copyIcon()).toHaveAttribute('data-copied', 'false')
  })

  it('leaves the copy icon unchanged when the clipboard is unavailable', async () => {
    stubClipboard(undefined)
    render(<AssistantMessage msg={message} isLastMessage status="ready" />)

    await clickCopy()

    expect(copyIcon()).toHaveAttribute('data-copied', 'false')
  })
})
