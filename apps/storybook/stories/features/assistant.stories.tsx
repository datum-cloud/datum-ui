import type { AssistantConfig, AssistantPlanStatus, AssistantWorkspaceProps, ChatSummary, ConversationDensity, EffortId } from '@datum-cloud/datum-ui/assistant'
import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import {
  AssistantConfigProvider,
  AssistantWorkspace,
  CHOICES_PART_TYPE,
  Conversation as ConversationView,
  PLAN_PART_TYPE,
  PromptCard,
} from '@datum-cloud/datum-ui/assistant'
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

/** A longer exchange with markdown, code and an in-flight tool call, for density comparisons. */
const RICH_CONVERSATION = [
  { id: 'u1', role: 'user', parts: [{ type: 'text', text: 'Set up a network for this project' }] },
  {
    id: 'a1',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        text: [
          '## Network plan',
          '',
          'I can create a **default** network with one subnet per region. Here is what that looks like:',
          '',
          '- `us-east-1`: 10.0.0.0/20',
          '- `eu-west-1`: 10.0.16.0/20',
          '',
          '### Next step',
          '',
          'Apply it with:',
          '',
          '```bash',
          'datumctl apply -f network.yaml',
          '```',
        ].join('\n'),
      },
    ],
  },
  { id: 'u2', role: 'user', parts: [{ type: 'text', text: 'Go ahead' }] },
  {
    id: 'a2',
    role: 'assistant',
    parts: [
      { type: 'text', text: 'Creating the network now.' },
      { type: 'dynamic-tool', toolName: 'createNetwork', toolCallId: 't1', state: 'input-available', input: {} },
    ],
  },
] as ChatSummary['messages']

/**
 * `Conversation` on its own, as a host embeds it in a page: just the transcript
 * and a pinned composer, no workspace shell.
 */
function ConversationHarness({ density }: { density?: ConversationDensity }) {
  const htmlByUserMsgIndexRef = useRef<string[]>([])
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const userScrolledUpRef = useRef(false)
  const noop = () => {}

  return (
    <div className="border-border flex h-[640px] w-full flex-col overflow-hidden rounded-lg border">
      <AssistantConfigProvider config={{ ...STORY_CONFIG, modelSelector: false }}>
        <ConversationView
          density={density}
          messages={RICH_CONVERSATION}
          status="streaming"
          htmlByUserMsgIndex={htmlByUserMsgIndexRef}
          containerRef={noop}
          bottomRef={bottomRef}
          userScrolledUpRef={userScrolledUpRef}
          footer={(
            <PromptCard
              density={density}
              editor={null}
              isReady={false}
              canRetry={false}
              onSend={noop}
              onStop={noop}
              onRetry={noop}
              modelId=""
              effortId="high"
              onModelChange={noop}
              onEffortChange={noop}
            />
          )}
        />
      </AssistantConfigProvider>
    </div>
  )
}

interface HarnessProps {
  messages: ChatSummary['messages']
  initialChats?: ChatSummary[]
  /** Wire onArchiveChat / onUnarchiveChat against local state. */
  archive?: boolean
  confirmDelete?: boolean
  orientation?: AssistantWorkspaceProps['orientation']
  /** Render a close button, as a dismissible host panel would. */
  closable?: boolean
}

/**
 * The host owns all state and transport; this harness supplies inert props so
 * the presentational layout can be exercised in isolation. `editor` is null —
 * `EditorContent` renders an empty composer without a live tiptap instance.
 * Chat list mutations (archive, unarchive, delete) are applied to local state.
 */
function WorkspaceHarness({ messages, initialChats = CHAT_LIST, archive = false, confirmDelete, orientation, closable = false }: HarnessProps) {
  const htmlByUserMsgIndexRef = useRef<string[]>([])
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const userScrolledUpRef = useRef(false)
  const [modelId, setModelId] = useState('claude-sonnet-4-6')
  const [effortId, setEffortId] = useState<EffortId>('high')
  // The vertical drawer covers the chat, so it starts closed there.
  const [historyOpen, setHistoryOpen] = useState(messages.length > 0 && orientation !== 'vertical')
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
    <div
      className={
        orientation === 'vertical'
          ? 'border-border ml-auto h-[720px] w-[420px] overflow-hidden rounded-lg border'
          : 'border-border h-[640px] w-full overflow-hidden rounded-lg border'
      }
    >
      <AssistantWorkspace
        orientation={orientation}
        onClose={closable ? noop : undefined}
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

type PlaygroundStory = StoryObj<HarnessProps>

export const Playground: PlaygroundStory = {
  name: 'Playground',
  args: {
    messages: CONVERSATION,
    initialChats: MIXED_CHAT_LIST,
    archive: false,
    confirmDelete: false,
    closable: false,
    orientation: 'horizontal',
  },
  argTypes: {
    messages: { control: false },
    initialChats: { control: false },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    archive: { control: 'boolean' },
    confirmDelete: { control: 'boolean' },
    closable: { control: 'boolean' },
  },
  render: args => <WorkspaceHarness {...args} />,
}

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

/** `orientation="vertical"`: a narrow side dock with a top bar and a history drawer. */
export const VerticalEmpty: Story = {
  name: 'Vertical: empty state',
  render: () => <WorkspaceHarness messages={[]} orientation="vertical" closable />,
}

export const VerticalConversation: Story = {
  name: 'Vertical: active conversation',
  render: () => <WorkspaceHarness messages={CONVERSATION} orientation="vertical" closable />,
}

/** The history drawer slides over the content instead of narrowing it. */
export const VerticalHistory: Story = {
  name: 'Vertical: history drawer',
  render: () => <WorkspaceHarness messages={CONVERSATION} orientation="vertical" closable />,
  play: async ({ canvasElement }) => {
    await userEvent.click(await within(canvasElement).findByRole('button', { name: 'Toggle sidebar' }))
  },
}

/** `Conversation` embedded on its own at the default density, for comparison. */
export const EmbeddedDefault: Story = {
  name: 'Embedded: default density',
  render: () => <ConversationHarness />,
}

/**
 * `density="compact"`: fills the host's width, a filled avatar beside each
 * assistant turn, tighter markdown (headings at body size), plain inline code,
 * no copy or download actions, and a one-line composer.
 */
export const EmbeddedCompact: Story = {
  name: 'Embedded: compact density',
  render: () => <ConversationHarness density="compact" />,
}

/**
 * A pick-one question drawn as buttons (`data-choices` part), at compact
 * density as on the project home page. Picking an option marks it and fades
 * the rest; a real host then sends the label as the person's reply.
 */
function ChoicesHarness() {
  const htmlByUserMsgIndexRef = useRef<string[]>([])
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const userScrolledUpRef = useRef(false)
  const noop = () => {}
  const [selectedId, setSelectedId] = useState<string>()
  const messages = [
    {
      id: 'u1',
      role: 'user',
      parts: [{ type: 'text', text: 'I want to run an app or container on Datum. Walk me through it step by step.' }],
    },
    {
      id: 'a1',
      role: 'assistant',
      parts: [
        { type: 'text', text: 'Let\'s get you deployed. A **workload** is your app running on Datum: you give it a container image and it runs on your network.' },
        {
          type: CHOICES_PART_TYPE,
          id: 'call-1',
          data: {
            question: 'What do you want to deploy?',
            options: [
              { id: '1', label: 'My own image', icon: 'container' },
              { id: '2', label: 'Try the nginx demo', icon: 'globe' },
              { id: '3', label: 'Try the redis demo', icon: 'database' },
            ],
            selectedId,
          },
        },
      ],
    },
  ] as unknown as ChatSummary['messages']

  return (
    <div className="border-border flex h-[480px] w-full flex-col overflow-hidden rounded-lg border">
      <AssistantConfigProvider config={{ ...STORY_CONFIG, modelSelector: false }}>
        <ConversationView
          density="compact"
          messages={messages}
          status="ready"
          htmlByUserMsgIndex={htmlByUserMsgIndexRef}
          containerRef={noop}
          bottomRef={bottomRef}
          userScrolledUpRef={userScrolledUpRef}
          onChoose={(_, option) => setSelectedId(option.id)}
          footer={(
            <PromptCard
              density="compact"
              editor={null}
              isReady
              canRetry={false}
              onSend={noop}
              onStop={noop}
              onRetry={noop}
              modelId=""
              effortId="high"
              onModelChange={noop}
              onEffortChange={noop}
            />
          )}
        />
      </AssistantConfigProvider>
    </div>
  )
}

export const EmbeddedChoices: Story = {
  name: 'Embedded: choice chips',
  render: () => <ChoicesHarness />,
}

/** A plan card (`data-plan` part) in each of its states, at compact density. */
function PlanHarness({ status, expiresAt = '2999-01-01T00:00:00Z' }: { status: AssistantPlanStatus, expiresAt?: string }) {
  const htmlByUserMsgIndexRef = useRef<string[]>(['<p>ghcr.io/acme/orders-api:1.4 on port 8080. It should be public over HTTPS.</p>'])
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const userScrolledUpRef = useRef(false)
  const noop = () => {}
  const resources = [
    { kind: 'Workload', name: 'orders-api', action: 'create', manifest: 'apiVersion: compute.datumapis.com/v1alpha1\nkind: Workload\nmetadata:\n  name: orders-api\n', summary: 'Runs your container in us-central-1. It gets a private address on default, so nothing on the internet can reach it directly.' },
    { kind: 'NetworkService', name: 'orders-api', action: 'create', manifest: 'kind: NetworkService\nmetadata:\n  name: orders-api\n', summary: 'A stable private name for the workload on port 8080, even as instances come and go.' },
    { kind: 'HTTPProxy', name: 'orders-api', action: 'create', manifest: 'kind: HTTPProxy\nmetadata:\n  name: orders-api\n', summary: 'The public front door: an HTTPS hostname with TLS and WAF, forwarding to the network service.' },
  ]
  const messages = [
    { id: 'u1', role: 'user', parts: [{ type: 'text', text: 'ghcr.io/acme/orders-api:1.4 on port 8080. It should be public over HTTPS.' }] },
    {
      id: 'a1',
      role: 'assistant',
      parts: [
        { type: 'text', text: 'Here\'s the plan. Three pieces, all on your network default.' },
        {
          type: PLAN_PART_TYPE,
          id: 'plan-1',
          data: {
            token: 'tok',
            expiresAt,
            resources,
            status,
            approvedAt: status === 'applied' || status === 'failed' ? '2026-10-23T10:51:00Z' : undefined,
            applied: status === 'applied' ? resources.map(r => ({ action: 'create', kind: r.kind, name: r.name })) : undefined,
            error: status === 'failed' ? 'nothing was changed: the platform rejected Workload "orders-api" when it was checked again just before applying.' : undefined,
          },
        },
      ],
    },
  ] as unknown as ChatSummary['messages']

  return (
    <div className="border-border flex h-[720px] w-full flex-col overflow-hidden rounded-lg border">
      <AssistantConfigProvider config={{ ...STORY_CONFIG, modelSelector: false }}>
        <ConversationView
          density="compact"
          messages={messages}
          status="ready"
          htmlByUserMsgIndex={htmlByUserMsgIndexRef}
          containerRef={noop}
          bottomRef={bottomRef}
          userScrolledUpRef={userScrolledUpRef}
          onApprovePlan={noop}
          onChangePlan={noop}
          footer={(
            <PromptCard density="compact" editor={null} isReady canRetry={false} onSend={noop} onStop={noop} onRetry={noop} modelId="" effortId="high" onModelChange={noop} onEffortChange={noop} />
          )}
        />
      </AssistantConfigProvider>
    </div>
  )
}

export const PlanPending: Story = { name: 'Plan card: waiting for approval', render: () => <PlanHarness status="pending" /> }
export const PlanApplying: Story = { name: 'Plan card: applying', render: () => <PlanHarness status="applying" /> }
export const PlanApplied: Story = { name: 'Plan card: applied', render: () => <PlanHarness status="applied" /> }
export const PlanFailed: Story = { name: 'Plan card: not applied', render: () => <PlanHarness status="failed" /> }
export const PlanExpired: Story = { name: 'Plan card: expired', render: () => <PlanHarness status="pending" expiresAt="2020-01-01T00:00:00Z" /> }
