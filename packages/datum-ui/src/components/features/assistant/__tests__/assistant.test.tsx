/// <reference types="@testing-library/jest-dom/vitest" />
import type { UIMessage } from 'ai'
import type { AssistantWorkspaceProps } from '../components/assistant-workspace'
import type { HistoryPanelProps } from '../components/sidebar'
import { fireEvent, render, screen } from '@testing-library/react'
import { getToolName } from 'ai'
import { describe, expect, it, vi } from 'vitest'
import { AssistantWorkspace } from '../components/assistant-workspace'
import { PromptCard } from '../components/composer'
import { Conversation } from '../components/conversation'
import { EmptyState } from '../components/empty-state'
import { AssistantChoiceChips, AssistantMessage, AssistantPlanCard, UserMessage } from '../components/message'
import { HistoryPanel } from '../components/sidebar'
import { AssistantConfigProvider, defaultRenderLink } from '../context'
import { CHOICES_PART_TYPE, PLAN_PART_TYPE } from '../types'
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

describe('assistantWorkspace layout', () => {
  const chat = { id: 'c1', title: 'Infra health check', updatedAt: Date.now(), messages: [] }
  const conversation = [
    { id: 'u1', role: 'user', parts: [{ type: 'text', text: 'Hi' }] },
  ] as UIMessage[]

  const renderWorkspace = (props: Partial<AssistantWorkspaceProps> = {}) => {
    const all: AssistantWorkspaceProps = {
      title: 'New chat',
      messages: [],
      status: 'ready',
      isReady: true,
      chatList: [chat],
      currentChatId: '',
      editor: null,
      htmlByUserMsgIndex: { current: [] },
      bottomRef: { current: null },
      containerRef: vi.fn(),
      userScrolledUpRef: { current: false },
      onSend: vi.fn(),
      onStop: vi.fn(),
      onRetry: vi.fn(),
      onNewChat: vi.fn(),
      onLoadChat: vi.fn(),
      onDeleteChat: vi.fn(),
      onSuggestion: vi.fn(),
      modelId: 'm',
      effortId: 'high',
      onModelChange: vi.fn(),
      onEffortChange: vi.fn(),
      historyOpen: false,
      onToggleHistory: vi.fn(),
      ...props,
    }
    render(<AssistantWorkspace {...all} />)
    return all
  }

  it('defaults to the horizontal rail layout with no header on the empty state', () => {
    renderWorkspace()
    expect(screen.getByRole('button', { name: 'Chats' })).toBeInTheDocument()
    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
  })

  it('swaps the rail for a top bar in the vertical orientation', () => {
    renderWorkspace({ orientation: 'vertical' })
    expect(screen.queryByRole('button', { name: 'Chats' })).not.toBeInTheDocument()
    expect(screen.getByRole('banner')).toHaveTextContent('New chat')
    expect(screen.getByRole('button', { name: 'Toggle sidebar' })).toBeInTheDocument()
  })

  it('closes the vertical history drawer once a chat is picked', () => {
    const props = renderWorkspace({ orientation: 'vertical', historyOpen: true })
    fireEvent.click(screen.getByText('Infra health check'))
    expect(props.onLoadChat).toHaveBeenCalledWith(chat)
    expect(props.onToggleHistory).toHaveBeenCalledOnce()
  })

  it('keeps the horizontal history panel open when a chat is picked', () => {
    const props = renderWorkspace({ historyOpen: true })
    fireEvent.click(screen.getByText('Infra health check'))
    expect(props.onLoadChat).toHaveBeenCalledWith(chat)
    expect(props.onToggleHistory).not.toHaveBeenCalled()
  })

  it('renders no close button unless the host passes onClose', () => {
    renderWorkspace({ messages: conversation })
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
  })

  it.each([
    ['horizontal', conversation],
    ['horizontal', []],
    ['vertical', conversation],
    ['vertical', []],
  ] as const)('renders onClose in the %s layout (%#)', (orientation, messages) => {
    const onClose = vi.fn()
    renderWorkspace({ orientation, messages: [...messages], onClose })
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(onClose).toHaveBeenCalledOnce()
  })
})

describe('conversation density', () => {
  const messages = [
    { id: 'u1', role: 'user', parts: [{ type: 'text', text: 'How is the network?' }] },
    {
      id: 'a1',
      role: 'assistant',
      parts: [{ type: 'text', text: '## Status\n\nAll **green**.\n\n- one\n- two' }],
    },
  ] as UIMessage[]

  const renderConversation = (props: Partial<React.ComponentProps<typeof Conversation>> = {}) =>
    render(
      <Conversation
        messages={messages}
        status="ready"
        htmlByUserMsgIndex={{ current: ['<p>How is the network?</p>'] }}
        containerRef={vi.fn()}
        bottomRef={{ current: null }}
        userScrolledUpRef={{ current: false }}
        footer={<div data-testid="footer" />}
        {...props}
      />,
    )

  const avatars = (container: HTMLElement) =>
    container.querySelectorAll('[data-slot="assistant-avatar"]')

  it('renders the default layout with no avatar and the wide column', () => {
    const { container } = renderConversation()
    expect(avatars(container)).toHaveLength(0)
    expect(container.querySelector('.max-w-3xl.gap-6')).not.toBeNull()
    expect(container.querySelector('.max-w-2xl')).toBeNull()
    expect(screen.getByTestId('footer').parentElement).toHaveClass('max-w-3xl')
    // The assistant turn keeps its original wrapper.
    expect(screen.getByText('green').closest('.text-foreground.w-full')).toHaveClass('text-sm')
  })

  it('puts an avatar beside each assistant turn in compact', () => {
    const { container } = renderConversation({ density: 'compact' })
    const found = avatars(container)
    expect(found).toHaveLength(1)
    expect(found[0]).toHaveAttribute('aria-hidden', 'true')
    // The avatar sits in the assistant turn, not the user's.
    expect(found[0]?.parentElement).toHaveTextContent('All green.')
    expect(found[0]?.parentElement).not.toHaveTextContent('How is the network?')
  })

  it('fills the host width with matching transcript and footer padding in compact', () => {
    const { container } = renderConversation({ density: 'compact' })
    expect(container.querySelector('.px-7.gap-5')).not.toBeNull()
    expect(container.querySelector('.max-w-3xl')).toBeNull()
    expect(container.querySelector('.max-w-2xl')).toBeNull()
    expect(screen.getByTestId('footer').parentElement).toHaveClass('w-full')
    expect(screen.getByTestId('footer').parentElement?.parentElement).toHaveClass('px-7')
    expect(container.querySelector('[data-density="compact"]')).toHaveClass('text-sm')
  })

  it('uses a filled brand avatar in compact', () => {
    const { container } = renderConversation({ density: 'compact' })
    expect(avatars(container)[0]).toHaveClass('size-7', 'bg-btn-primary')
  })

  it('sets inline code as plain mono text in compact', () => {
    renderConversation({ density: 'compact' })
    const markdownRoot = screen.getByRole('heading', { name: 'Status' }).parentElement as HTMLElement
    expect(markdownRoot.className).toContain('**:data-[streamdown=\'inline-code\']:bg-transparent')
    expect(markdownRoot.className).toContain('**:data-[streamdown=\'inline-code\']:p-0')
    expect(markdownRoot.className).not.toContain('**:data-[streamdown=\'inline-code\']:border')
  })

  it('tightens markdown and renders headings at body size in compact', () => {
    renderConversation({ density: 'compact' })
    const heading = screen.getByRole('heading', { name: 'Status' })
    const markdownRoot = heading.parentElement as HTMLElement
    expect(markdownRoot).toHaveClass('space-y-2')
    expect(markdownRoot).not.toHaveClass('space-y-4')
    expect(markdownRoot.className).toContain('[&_:is(h1,h2,h3,h4,h5,h6)]:text-sm')
    expect(markdownRoot.className).not.toContain('[&_h2]:text-xl')
  })

  it('keeps user turns as right-aligned bubbles in compact', () => {
    renderConversation({ density: 'compact' })
    const bubble = screen.getByText('How is the network?').closest('.rounded-2xl') as HTMLElement
    expect(bubble).toHaveClass('bg-muted', 'text-sm')
    expect(bubble).not.toHaveClass('rounded-br-sm')
    expect(bubble.parentElement).toHaveClass('justify-end')
  })

  it('keeps the error and the turn rail in compact', () => {
    renderConversation({ density: 'compact', error: new Error('boom') })
    expect(screen.getByText(/boom|went wrong/i)).toHaveClass('ml-10')
    expect(document.querySelector('[data-turn-id="u1"]')).not.toBeNull()
  })

  it('leaves UserMessage unchanged by default', () => {
    render(<UserMessage html="<p>hi</p>" />)
    expect(screen.getByText('hi').closest('.rounded-2xl')).toHaveClass('px-4', 'py-2.5', 'text-sm', 'bg-border', 'rounded-br-sm')
  })

  it('leaves out the message actions in compact', () => {
    renderConversation({ density: 'compact' })
    expect(document.querySelector('[data-slot="message-actions"]')).toBeNull()
  })

  it('keeps the message actions by default', () => {
    renderConversation()
    expect(document.querySelector('[data-slot="message-actions"]')).not.toBeNull()
  })
})

describe('promptCard density', () => {
  const renderCard = (props: Partial<React.ComponentProps<typeof PromptCard>> = {}) =>
    render(
      <PromptCard
        editor={null}
        isReady
        canRetry={false}
        onSend={vi.fn()}
        onStop={vi.fn()}
        onRetry={vi.fn()}
        modelId="m"
        effortId="medium"
        onModelChange={vi.fn()}
        onEffortChange={vi.fn()}
        {...props}
      />,
    )

  it('renders the stacked card with a filled send button by default', () => {
    const { container } = renderCard()
    expect(container.firstElementChild).toHaveClass('rounded-2xl', 'shadow-sm', 'p-3')
    expect(screen.getByLabelText('Send message')).toHaveClass('bg-primary')
  })

  it('renders one row with an outline send button in compact', () => {
    const { container } = renderCard({ density: 'compact' })
    expect(container.firstElementChild).toHaveClass('flex', 'rounded-lg', 'border-input')
    expect(container.firstElementChild).not.toHaveClass('shadow-sm')
    expect(screen.getByLabelText('Send message')).not.toHaveClass('bg-primary')
  })
})

describe('choice chips', () => {
  const data = {
    question: 'What do you want to deploy?',
    options: [
      { id: '1', label: 'My own image', icon: 'container' },
      { id: '2', label: 'Try the nginx demo' },
    ],
  }

  it('calls onChoose with the picked option', () => {
    const onChoose = vi.fn()
    render(<AssistantChoiceChips data={data} onChoose={onChoose} />)
    fireEvent.click(screen.getByRole('button', { name: 'Try the nginx demo' }))
    expect(onChoose).toHaveBeenCalledWith(data.options[1])
  })

  it('marks the picked option and locks the rest once answered', () => {
    const onChoose = vi.fn()
    render(<AssistantChoiceChips data={{ ...data, selectedId: '1' }} onChoose={onChoose} />)
    const picked = screen.getByRole('button', { name: 'My own image' })
    const other = screen.getByRole('button', { name: 'Try the nginx demo' })
    expect(picked).toHaveAttribute('aria-pressed', 'true')
    expect(picked).toHaveClass('border-btn-primary')
    expect(other).toHaveAttribute('aria-pressed', 'false')
    expect(other).toBeDisabled()
    fireEvent.click(other)
    expect(onChoose).not.toHaveBeenCalled()
  })

  it('cannot be answered when disabled', () => {
    render(<AssistantChoiceChips data={data} onChoose={vi.fn()} disabled />)
    for (const b of screen.getAllByRole('button'))
      expect(b).toBeDisabled()
  })

  const choiceMessages = [
    {
      id: 'a1',
      role: 'assistant',
      parts: [{ type: CHOICES_PART_TYPE, id: 'call-1', data }],
    },
  ] as unknown as UIMessage[]

  const renderWithChoices = (props: Partial<React.ComponentProps<typeof Conversation>>) =>
    render(
      <Conversation
        messages={choiceMessages}
        status="ready"
        htmlByUserMsgIndex={{ current: [] }}
        containerRef={vi.fn()}
        bottomRef={{ current: null }}
        userScrolledUpRef={{ current: false }}
        footer={<div />}
        {...props}
      />,
    )

  it('renders a choices part in a conversation and reports the message it belongs to', () => {
    const onChoose = vi.fn()
    renderWithChoices({ onChoose })
    expect(screen.getByText('What do you want to deploy?')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'My own image' }))
    expect(onChoose).toHaveBeenCalledWith('a1', data.options[0])
  })

  it('keeps the latest question locked while it is still streaming', () => {
    renderWithChoices({ onChoose: vi.fn(), status: 'streaming' })
    expect(screen.getByRole('button', { name: 'My own image' })).toBeDisabled()
  })

  it('locks a question that is no longer the latest turn', () => {
    const later = [
      ...choiceMessages,
      { id: 'u2', role: 'user', parts: [{ type: 'text', text: 'something else' }] },
      { id: 'a2', role: 'assistant', parts: [{ type: 'text', text: 'ok' }] },
    ] as unknown as UIMessage[]
    renderWithChoices({ onChoose: vi.fn(), messages: later, htmlByUserMsgIndex: { current: ['<p>something else</p>'] } })
    expect(screen.getByRole('button', { name: 'My own image' })).toBeDisabled()
  })
})

describe('plan card', () => {
  const NOW = Date.parse('2026-10-23T12:00:00Z')
  const plan = {
    token: 'tok-1',
    expiresAt: '2026-10-23T12:15:00Z',
    status: 'pending' as const,
    resources: [
      { kind: 'Workload', name: 'orders-api', action: 'create', summary: 'Runs your container in us-central-1.', manifest: 'kind: Workload\n' },
      { kind: 'NetworkService', name: 'orders-api', action: 'create', manifest: 'kind: NetworkService\n' },
      { kind: 'HTTPProxy', name: 'orders-api', action: 'create', manifest: 'kind: HTTPProxy\n' },
    ],
  }

  it('shows each resource with what it does, and nothing created yet', () => {
    render(<AssistantPlanCard data={plan} canApprove now={NOW} />)
    expect(screen.getByText(/3 resources to create/)).toBeInTheDocument()
    expect(screen.getByText('Nothing created yet')).toBeInTheDocument()
    expect(screen.getByText('Network service')).toBeInTheDocument()
    expect(screen.getByText('Load balancer')).toBeInTheDocument()
    expect(screen.getByText('Runs your container in us-central-1.')).toBeInTheDocument()
    expect(screen.getAllByText('Create')).toHaveLength(3)
  })

  it('approves and asks to change through its callbacks', () => {
    const onApprove = vi.fn()
    const onChange = vi.fn()
    render(<AssistantPlanCard data={plan} canApprove onApprove={onApprove} onChange={onChange} now={NOW} />)
    fireEvent.click(screen.getByRole('button', { name: 'Approve and create' }))
    fireEvent.click(screen.getByRole('button', { name: 'Change something' }))
    expect(onApprove).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledOnce()
  })

  it('shows the YAML on request', () => {
    render(<AssistantPlanCard data={plan} now={NOW} />)
    expect(screen.queryByText(/kind: HTTPProxy/)).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'View YAML and diff' }))
    expect(screen.getByText(/kind: HTTPProxy/)).toBeInTheDocument()
  })

  it('cannot be approved while the conversation is busy', () => {
    render(<AssistantPlanCard data={plan} canApprove={false} onApprove={vi.fn()} now={NOW} />)
    expect(screen.getByRole('button', { name: 'Approve and create' })).toBeDisabled()
  })

  it('reads as expired once its token has run out', () => {
    render(<AssistantPlanCard data={plan} canApprove now={Date.parse('2026-10-23T12:16:00Z')} />)
    expect(screen.getByText('Expired')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Approve and create' })).toBeNull()
  })

  it('reads as replaced when a newer plan exists', () => {
    render(<AssistantPlanCard data={plan} latest={false} canApprove now={NOW} />)
    expect(screen.getByText('Replaced')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Approve and create' })).toBeNull()
  })

  it('shows what was created and when it was approved', () => {
    render(
      <AssistantPlanCard
        data={{ ...plan, status: 'applied', approvedAt: '2026-10-23T12:01:00Z', applied: plan.resources.map(r => ({ action: 'create', kind: r.kind, name: r.name })) }}
        now={NOW}
      />,
    )
    expect(screen.getByText('Applied')).toBeInTheDocument()
    expect(screen.getAllByText('Created')).toHaveLength(3)
    expect(screen.getByText(/Approved by you at/)).toBeInTheDocument()
  })

  it('shows why a plan was not applied', () => {
    render(<AssistantPlanCard data={{ ...plan, status: 'failed', error: 'nothing was changed: the token did not match' }} now={NOW} />)
    expect(screen.getByText('Not applied')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('the token did not match')
  })

  it('offers update wording and shows the diff for a change', () => {
    render(
      <AssistantPlanCard
        data={{ ...plan, resources: [{ kind: 'HTTPProxy', name: 'orders-api', action: 'update', diff: ['+ hostnames: api.acme.com'], manifest: 'kind: HTTPProxy\n' }] }}
        canApprove
        now={NOW}
      />,
    )
    expect(screen.getByText(/1 resource to change/)).toBeInTheDocument()
    expect(screen.getByText('+ hostnames: api.acme.com')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Approve and update' })).toBeInTheDocument()
  })

  it('lets only the newest plan in a conversation be approved', () => {
    const onApprovePlan = vi.fn()
    const messages = [
      { id: 'a1', role: 'assistant', parts: [{ type: PLAN_PART_TYPE, id: 'plan-old', data: plan }] },
      { id: 'u2', role: 'user', parts: [{ type: 'text', text: 'use port 9090' }] },
      { id: 'a2', role: 'assistant', parts: [{ type: PLAN_PART_TYPE, id: 'plan-new', data: { ...plan, expiresAt: '2999-01-01T00:00:00Z' } }] },
    ] as unknown as UIMessage[]
    render(
      <Conversation
        messages={messages}
        status="ready"
        htmlByUserMsgIndex={{ current: ['<p>use port 9090</p>'] }}
        containerRef={vi.fn()}
        bottomRef={{ current: null }}
        userScrolledUpRef={{ current: false }}
        footer={<div />}
        onApprovePlan={onApprovePlan}
      />,
    )
    expect(screen.getByText('Replaced')).toBeInTheDocument()
    const buttons = screen.getAllByRole('button', { name: 'Approve and create' })
    expect(buttons).toHaveLength(1)
    fireEvent.click(buttons[0]!)
    expect(onApprovePlan).toHaveBeenCalledWith('a2', 'plan-new')
  })
})
