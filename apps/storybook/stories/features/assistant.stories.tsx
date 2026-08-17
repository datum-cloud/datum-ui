import type { AssistantConfig, ChatSummary, EffortId } from '@datum-cloud/datum-ui/assistant'
import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { AssistantWorkspace } from '@datum-cloud/datum-ui/assistant'
import { useRef, useState } from 'react'

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

const CONVERSATION = [
  { id: 'u1', role: 'user', parts: [{ type: 'text', text: 'How\'s our infrastructure looking?' }] },
  {
    id: 'a1',
    role: 'assistant',
    parts: [{ type: 'text', text: 'Everything is **green** — all clusters healthy and no active alerts.' }],
  },
] as ChatSummary['messages']

/**
 * The host owns all state and transport; this harness supplies inert props so
 * the presentational layout can be exercised in isolation. `editor` is null —
 * `EditorContent` renders an empty composer without a live tiptap instance.
 */
function WorkspaceHarness({ messages }: { messages: ChatSummary['messages'] }) {
  const htmlByUserMsgIndexRef = useRef<string[]>([])
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const userScrolledUpRef = useRef(false)
  const [modelId, setModelId] = useState('claude-sonnet-4-6')
  const [effortId, setEffortId] = useState<EffortId>('high')
  const [historyOpen, setHistoryOpen] = useState(messages.length > 0)
  const noop = () => {}

  return (
    <div className="border-border h-[640px] w-full overflow-hidden rounded-lg border">
      <AssistantWorkspace
        config={STORY_CONFIG}
        userName="Jacob"
        title="Infra health check"
        messages={messages}
        status="ready"
        isReady
        chatList={CHAT_LIST}
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
        onDeleteChat={noop}
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
