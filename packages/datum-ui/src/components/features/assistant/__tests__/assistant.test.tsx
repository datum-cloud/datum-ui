/// <reference types="@testing-library/jest-dom/vitest" />
import type { UIMessage } from 'ai'
import { fireEvent, render, screen } from '@testing-library/react'
import { getToolName } from 'ai'
import { describe, expect, it, vi } from 'vitest'
import { EmptyState } from '../components/empty-state'
import { AssistantMessage } from '../components/message'
import { HistoryPanel } from '../components/sidebar'
import { AssistantConfigProvider, defaultRenderLink } from '../context'
import { formatRelativeTime, sanitizeUserHtml } from '../utils'

describe('sanitizeUserHtml', () => {
  it('keeps whitelisted formatting tags', () => {
    expect(sanitizeUserHtml('<p>a <strong>b</strong> <em>c</em></p>')).toBe(
      '<p>a <strong>b</strong> <em>c</em></p>',
    )
  })

  it('strips disallowed tags but keeps their text', () => {
    expect(sanitizeUserHtml('<div>plain <span>text</span></div>')).toBe('<p>plain text</p>')
  })

  it('neutralizes script tags', () => {
    expect(sanitizeUserHtml('<script>alert(1)</script>')).not.toContain('<script>')
  })

  it('drops anchors so pasted links are not clickable', () => {
    const out = sanitizeUserHtml('<a href="https://evil.test">click</a>')
    expect(out).not.toContain('href')
    expect(out).toBe('<p>click</p>')
  })

  it('always wraps output in a paragraph', () => {
    expect(sanitizeUserHtml('bare text')).toBe('<p>bare text</p>')
  })
})

describe('formatRelativeTime', () => {
  it('reports very recent timestamps as "just now"', () => {
    expect(formatRelativeTime(Date.now())).toBe('just now')
  })

  it('reports minutes and hours', () => {
    expect(formatRelativeTime(Date.now() - 5 * 60 * 1000)).toBe('5m ago')
    expect(formatRelativeTime(Date.now() - 2 * 60 * 60 * 1000)).toBe('2h ago')
  })

  it('reports the previous day as "Yesterday"', () => {
    expect(formatRelativeTime(Date.now() - 25 * 60 * 60 * 1000)).toBe('Yesterday')
  })
})

describe('defaultRenderLink', () => {
  it('renders internal routes as a same-tab anchor', () => {
    render(<>{defaultRenderLink({ href: '/users', children: 'Users' })}</>)
    const link = screen.getByRole('link', { name: 'Users' })
    expect(link).toHaveAttribute('href', '/users')
    expect(link).not.toHaveAttribute('target')
  })

  it('opens external links in a new tab', () => {
    render(<>{defaultRenderLink({ href: 'https://datum.net', children: 'Datum' })}</>)
    const link = screen.getByRole('link', { name: 'Datum' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})

describe('emptyState', () => {
  it('greets the user and lists the configured suggestions', () => {
    const onSuggestion = vi.fn()
    render(
      <AssistantConfigProvider
        config={{ greeting: name => `Hey ${name}`, suggestions: ['First prompt', 'Second prompt'] }}
      >
        <EmptyState name="Jacob" isReady onSuggestion={onSuggestion}>
          <div>composer</div>
        </EmptyState>
      </AssistantConfigProvider>,
    )

    expect(screen.getByText('Hey Jacob')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /First prompt/ }))
    expect(onSuggestion).toHaveBeenCalledWith('First prompt')
  })

  it('disables suggestions while the assistant is not ready', () => {
    render(
      <AssistantConfigProvider config={{ suggestions: ['Only prompt'] }}>
        <EmptyState isReady={false} onSuggestion={vi.fn()}>
          <div>composer</div>
        </EmptyState>
      </AssistantConfigProvider>,
    )
    expect(screen.getByRole('button', { name: /Only prompt/ })).toBeDisabled()
  })
})

describe('historyPanel header slot', () => {
  const chat = { id: 'c1', title: 'Saved chat', updatedAt: Date.now(), messages: [] }

  it('renders the host-supplied header above the chat list', () => {
    render(
      <HistoryPanel
        chatList={[chat]}
        currentChatId="c1"
        header={<span>Project: acme-prod</span>}
        onLoadChat={vi.fn()}
        onDeleteChat={vi.fn()}
      />,
    )
    expect(screen.getByText('Project: acme-prod')).toBeInTheDocument()
    expect(screen.getByText('Saved chat')).toBeInTheDocument()
  })

  it('omits the header block entirely when no header is passed', () => {
    render(
      <HistoryPanel
        chatList={[chat]}
        currentChatId="c1"
        onLoadChat={vi.fn()}
        onDeleteChat={vi.fn()}
      />,
    )
    expect(screen.queryByText('Project: acme-prod')).not.toBeInTheDocument()
  })
})

describe('renderToolOutput config hook', () => {
  const msgWith = (part: object): UIMessage =>
    ({ id: 'm1', role: 'assistant', parts: [{ type: 'text', text: 'here you go' }, part] }) as UIMessage

  const ticketPart = {
    type: 'tool-openSupportTicket',
    toolCallId: 't1',
    state: 'output-available',
    input: {},
    output: { subject: 'Help' },
  }

  it('renders a completed tool call inline when the host opts in', () => {
    render(
      <AssistantConfigProvider
        config={{
          renderToolOutput: part =>
            getToolName(part) === 'openSupportTicket' ? <button type="button">Open ticket</button> : null,
        }}
      >
        <AssistantMessage msg={msgWith(ticketPart)} isLastMessage status="ready" />
      </AssistantConfigProvider>,
    )
    expect(screen.getByRole('button', { name: 'Open ticket' })).toBeInTheDocument()
  })

  it('stays invisible when the host renders nothing for that tool', () => {
    render(
      <AssistantConfigProvider config={{ renderToolOutput: () => null }}>
        <AssistantMessage msg={msgWith(ticketPart)} isLastMessage status="ready" />
      </AssistantConfigProvider>,
    )
    expect(screen.queryByRole('button', { name: 'Open ticket' })).not.toBeInTheDocument()
  })

  it('ignores tool calls that have not produced output yet', () => {
    const pending = { ...ticketPart, state: 'input-available', output: undefined }
    render(
      <AssistantConfigProvider config={{ renderToolOutput: () => <span>should not render</span> }}>
        <AssistantMessage msg={msgWith(pending)} isLastMessage={false} status="ready" />
      </AssistantConfigProvider>,
    )
    expect(screen.queryByText('should not render')).not.toBeInTheDocument()
  })
})
