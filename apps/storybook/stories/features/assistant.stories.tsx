import type { AssistantConfig, AssistantWorkspaceProps, ChatSummary, EffortId } from '@datum-cloud/datum-ui/assistant'
import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { AssistantWorkspace } from '@datum-cloud/datum-ui/assistant'
import { useRef, useState } from 'react'
import { userEvent, within } from 'storybook/test'

const STORY_CONFIG: Partial<AssistantConfig> = {
  greeting: name => `Hey there${name ? `, ${name}` : ''}`,
  suggestions: [
    'Are there any unresolved Sentry errors?',
    'How\'s our infrastructure looking?',
    'Show me the latest 10 new users',
  ],
  showReasoning: true,
  modelSelector: {
    models: [
      { id: 'claude-sonnet-4-6', label: 'Sonnet 4.6' },
      { id: 'claude-haiku-4-5', label: 'Haiku 4.5' },
    ],
    efforts: [
      { id: 'low', label: 'Low' },
      { id: 'medium', label: 'Medium' },
      { id: 'high', label: 'High' },
    ],
    defaultModelId: 'claude-sonnet-4-6',
    defaultEffortId: 'high',
  },
  toolLabels: {},
}

const HOUR = 60 * 60 * 1000

const CHAT_LIST: ChatSummary[] = [
  { id: 'c1', title: 'Infra health check', updatedAt: Date.now() - HOUR, messages: [] },
  { id: 'c2', title: 'Sentry triage', updatedAt: Date.now() - 26 * HOUR, messages: [] },
]

/** Mixed active + archived list for the archive-enabled stories. */
const MIXED_CHAT_LIST: ChatSummary[] = [
  ...CHAT_LIST,
  { id: 'c3', title: 'Q3 billing export', updatedAt: Date.now() - 3 * 24 * HOUR, messages: [], archived: true },
  { id: 'c4', title: 'Old DNS migration', updatedAt: Date.now() - 9 * 24 * HOUR, messages: [], archived: true },
]

const CONVERSATION = [
  { id: 'u1', role: 'user', parts: [{ type: 'text', text: 'How\'s our infrastructure looking?' }] },
  {
    id: 'a1',
    role: 'assistant',
    parts: [{ type: 'text', text: 'Everything is **green** — all clusters healthy and no active alerts.' }],
  },
] as ChatSummary['messages']

interface HarnessProps {
  messages: ChatSummary['messages']
  initialChats?: ChatSummary[]
  /** Wire onArchiveChat / onUnarchiveChat against local state. */
  archive?: boolean
  confirmDelete?: boolean
}

/**
 * The host owns all state and transport; this harness supplies inert props so
 * the presentational layout can be exercised in isolation. `editor` is null —
 * `EditorContent` renders an empty composer without a live tiptap instance.
 * Chat list mutations (archive, unarchive, delete) are applied to local state.
 */
function WorkspaceHarness({ messages, initialChats = CHAT_LIST, archive = false, confirmDelete }: HarnessProps) {
  const htmlByUserMsgIndexRef = useRef<string[]>([])
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const userScrolledUpRef = useRef(false)
  const [modelId, setModelId] = useState('claude-sonnet-4-6')
  const [effortId, setEffortId] = useState<EffortId>('high')
  const [historyOpen, setHistoryOpen] = useState(messages.length > 0)
  const [chats, setChats] = useState(initialChats)
  const noop = () => {}

  const setArchived = (chatId: string, archived: boolean) =>
    setChats(list => list.map(c => (c.id === chatId ? { ...c, archived } : c)))

  const archiveProps: Partial<AssistantWorkspaceProps> = archive
    ? {
        onArchiveChat: (_e, chatId) => setArchived(chatId, true),
        onUnarchiveChat: (_e, chatId) => setArchived(chatId, false),
      }
    : {}

  return (
    <div className="border-border h-[640px] w-full overflow-hidden rounded-lg border">
      <AssistantWorkspace
        config={STORY_CONFIG}
        userName="Jacob"
        title="Infra health check"
        messages={messages}
        status="ready"
        isReady
        chatList={chats}
        currentChatId="c1"
        editor={null}
        htmlByUserMsgIndex={htmlByUserMsgIndexRef}
        bottomRef={bottomRef}
        containerRef={noop}
        userScrolledUpRef={userScrolledUpRef}
        onSend={noop}
        onStop={noop}
        onRetry={noop}
        onNewChat={noop}
        onLoadChat={noop}
        onDeleteChat={(e, chatId) => {
          e.stopPropagation()
          setChats(list => list.filter(c => c.id !== chatId))
        }}
        {...archiveProps}
        confirmDelete={confirmDelete}
        onSuggestion={noop}
        modelId={modelId}
        effortId={effortId}
        onModelChange={setModelId}
        onEffortChange={setEffortId}
        historyOpen={historyOpen}
        onToggleHistory={() => setHistoryOpen(open => !open)}
      />
    </div>
  )
}

const meta: Meta<typeof AssistantWorkspace> = {
  title: 'Features/Assistant',
  component: AssistantWorkspace,
  parameters: { layout: 'fullscreen' },
}

export default meta

type Story = StoryObj<typeof AssistantWorkspace>

export const Empty: Story = {
  name: 'Empty state',
  render: () => <WorkspaceHarness messages={[]} />,
}

export const Conversation: Story = {
  name: 'Active conversation',
  render: () => <WorkspaceHarness messages={CONVERSATION} />,
}

/** `onArchiveChat` passed: archived chats are hidden and an "Archived" toggle appears. */
export const ArchiveEnabled: Story = {
  name: 'History: archive enabled',
  render: () => <WorkspaceHarness messages={CONVERSATION} initialChats={MIXED_CHAT_LIST} archive />,
}

/** The archived view, reached through the toggle next to the search input. */
export const ArchivedView: Story = {
  name: 'History: archived view',
  render: () => <WorkspaceHarness messages={CONVERSATION} initialChats={MIXED_CHAT_LIST} archive />,
  play: async ({ canvasElement }) => {
    await userEvent.click(await within(canvasElement).findByRole('button', { name: 'Archived' }))
  },
}

/** `confirmDelete`: deleting a chat asks first, since it can't be undone. */
export const ConfirmDelete: Story = {
  name: 'History: confirm delete',
  render: () => (
    <WorkspaceHarness messages={CONVERSATION} initialChats={MIXED_CHAT_LIST} archive confirmDelete />
  ),
}
