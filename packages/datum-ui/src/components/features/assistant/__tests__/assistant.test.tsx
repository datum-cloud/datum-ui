/// <reference types="@testing-library/jest-dom/vitest" />
import type { UIMessage } from 'ai'
import type { HistoryPanelProps } from '../components/sidebar'
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

describe('historyPanel archive support', () => {
  const now = Date.now()
  const chats = [
    { id: 'a1', title: 'Active infra chat', updatedAt: now, messages: [] },
    { id: 'a2', title: 'Active billing chat', updatedAt: now, messages: [] },
    { id: 'x1', title: 'Archived infra chat', updatedAt: now, messages: [], archived: true },
  ]

  function renderPanel(props: Partial<HistoryPanelProps> = {}) {
    const handlers = {
      onLoadChat: vi.fn(),
      onDeleteChat: vi.fn(),
      onArchiveChat: vi.fn(),
      onUnarchiveChat: vi.fn(),
    }
    render(
      <HistoryPanel
        chatList={chats}
        currentChatId="a1"
        {...handlers}
        {...props}
      />,
    )
    return handlers
  }

  it('is unchanged when the host passes no archive props', () => {
    renderPanel({ onArchiveChat: undefined, onUnarchiveChat: undefined })
    // archived-flagged items are not filtered
    expect(screen.getByText('Archived infra chat')).toBeInTheDocument()
    expect(screen.getByText('Active infra chat')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Archived' })).not.toBeInTheDocument()
    expect(screen.queryAllByLabelText('Archive chat')).toHaveLength(0)
    expect(screen.queryAllByLabelText('Unarchive chat')).toHaveLength(0)
  })

  it('lists only active chats by default when archive is enabled', () => {
    renderPanel()
    expect(screen.getByText('Active infra chat')).toBeInTheDocument()
    expect(screen.queryByText('Archived infra chat')).not.toBeInTheDocument()
    expect(screen.getAllByLabelText('Archive chat')).toHaveLength(2)
    expect(screen.getByRole('button', { name: 'Archived' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('archives a row without loading it', () => {
    const { onArchiveChat, onLoadChat } = renderPanel()
    fireEvent.click(screen.getAllByLabelText('Archive chat')[0]!)
    expect(onArchiveChat).toHaveBeenCalledWith(expect.anything(), 'a1')
    expect(onLoadChat).not.toHaveBeenCalled()
  })

  it('switches to the archived view with unarchive and delete actions', () => {
    const { onUnarchiveChat, onLoadChat, onDeleteChat } = renderPanel()
    fireEvent.click(screen.getByRole('button', { name: 'Archived' }))

    expect(screen.getByRole('button', { name: 'Archived' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Archived infra chat')).toBeInTheDocument()
    expect(screen.queryByText('Active infra chat')).not.toBeInTheDocument()
    expect(screen.queryAllByLabelText('Archive chat')).toHaveLength(0)

    fireEvent.click(screen.getByLabelText('Unarchive chat'))
    expect(onUnarchiveChat).toHaveBeenCalledWith(expect.anything(), 'x1')

    fireEvent.click(screen.getByLabelText('Delete chat'))
    expect(onDeleteChat).toHaveBeenCalledWith(expect.anything(), 'x1')

    fireEvent.click(screen.getByText('Archived infra chat'))
    expect(onLoadChat).toHaveBeenCalledWith(chats[2])
  })

  it('applies search within the current view', () => {
    renderPanel()
    const search = screen.getByPlaceholderText('Search chats…')
    fireEvent.change(search, { target: { value: 'infra' } })
    expect(screen.getByText('Active infra chat')).toBeInTheDocument()
    expect(screen.queryByText('Active billing chat')).not.toBeInTheDocument()
    expect(screen.queryByText('Archived infra chat')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Archived' }))
    expect(screen.getByText('Archived infra chat')).toBeInTheDocument()
    expect(screen.queryByText('Active infra chat')).not.toBeInTheDocument()

    fireEvent.change(screen.getByPlaceholderText('Search archived chats…'), { target: { value: 'billing' } })
    expect(screen.getByText('No matching archived chats')).toBeInTheDocument()
  })

  it('shows a per-view empty state', () => {
    renderPanel({ chatList: [chats[0]!] })
    fireEvent.click(screen.getByRole('button', { name: 'Archived' }))
    expect(screen.getByText('No archived chats')).toBeInTheDocument()
  })
})

describe('historyPanel confirmDelete', () => {
  const chat = { id: 'c1', title: 'Saved chat', updatedAt: Date.now(), messages: [] }

  it('deletes immediately by default', () => {
    const onDeleteChat = vi.fn()
    render(<HistoryPanel chatList={[chat]} currentChatId="" onLoadChat={vi.fn()} onDeleteChat={onDeleteChat} />)
    fireEvent.click(screen.getByLabelText('Delete chat'))
    expect(onDeleteChat).toHaveBeenCalledWith(expect.anything(), 'c1')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('asks for confirmation before deleting', async () => {
    const onDeleteChat = vi.fn()
    const onLoadChat = vi.fn()
    render(
      <HistoryPanel chatList={[chat]} currentChatId="" onLoadChat={onLoadChat} onDeleteChat={onDeleteChat} confirmDelete />,
    )
    fireEvent.click(screen.getByLabelText('Delete chat'))
    expect(onDeleteChat).not.toHaveBeenCalled()
    expect(onLoadChat).not.toHaveBeenCalled()

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveTextContent('can\'t be undone')

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onDeleteChat).toHaveBeenCalledWith(expect.anything(), 'c1')
    expect(onLoadChat).not.toHaveBeenCalled()
  })

  it('does not delete when the confirmation is cancelled', async () => {
    const onDeleteChat = vi.fn()
    render(
      <HistoryPanel chatList={[chat]} currentChatId="" onLoadChat={vi.fn()} onDeleteChat={onDeleteChat} confirmDelete />,
    )
    fireEvent.click(screen.getByLabelText('Delete chat'))
    await screen.findByRole('dialog')
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onDeleteChat).not.toHaveBeenCalled()
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
