import type { UIMessage } from '@datum-cloud/datum-ui-native'
import type { ComponentType, ReactNode } from 'react'
import {
  AssistantComposer,
  AssistantConfigProvider,
  AssistantEmptyState,
  AssistantMessage,
  AssistantUserMessage,
  ConversationRow,
  LoadingDots,
  Text,
  ThinkingBlock,
  useDatumTheme,
} from '@datum-cloud/datum-ui-native'
import { useState } from 'react'
import { View } from 'react-native'

const ANSWER = `Here's the rundown across your three services:

**Load balancers** — 2, both serving
- \`web-alb\` — Programmed, WAF in **Enforce** mode
- [api-alb](/project/demo/alb/api-alb) — no traffic protection

| Workload | Ready |
| --- | --- |
| web | 2/2 |
| api | 1/1 |

\`\`\`sh
datumctl get httpproxies --project demo
\`\`\``

const now = Date.now()
const reply = (parts: UIMessage['parts']): UIMessage => ({ id: 'a', role: 'assistant', parts })

/** The React Native assistant pieces, with the copy and tool labels Patch uses. */
export function Assistant({ Section }: { Section: ComponentType<{ title: string, children: ReactNode }> }) {
  const t = useDatumTheme()
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  return (
    <AssistantConfigProvider
      config={{
        suggestions: ['What resources do I have in this project?', 'Summarize my load balancers.'],
        toolLabels: { alb__alb_list: 'Looking at your load balancers…' },
        onLinkPress: () => {},
      }}
    >
      <Section title="Assistant · empty state">
        <AssistantEmptyState name="Jacob" onSuggestion={() => {}} />
      </Section>
      <Section title="Assistant · conversation">
        <View style={{ gap: 24 }}>
          <AssistantUserMessage text="Summarize my project." />
          <AssistantMessage msg={reply([{ type: 'text', text: ANSWER, state: 'done' }])} isLastMessage={false} status="ready" onShare={() => {}} onCopy={() => {}} />
          <AssistantMessage
            msg={reply([{ type: 'dynamic-tool', toolName: 'alb__alb_list', toolCallId: '1', state: 'input-available', input: {} }])}
            isLastMessage
            status="streaming"
          />
          <ThinkingBlock text="The user wants a summary; list ALBs, workloads and DNS zones first." />
          <LoadingDots />
        </View>
      </Section>
      <Section title="Assistant · composer">
        <View style={{ gap: 12 }}>
          <AssistantComposer value={draft} onChangeText={setDraft} onSend={() => setBusy(true)} onStop={() => setBusy(false)} busy={busy} />
          <Text size="xs" tone="muted">Send turns the button into Stop; Stop turns it back.</Text>
        </View>
      </Section>
      <Section title="Assistant · conversation rows">
        <View style={{ borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: t.colors.border }}>
          <ConversationRow chat={{ id: '1', title: 'DFW quota escalation', updatedAt: now - 5 * 60_000 }} active />
          <ConversationRow chat={{ id: '2', title: 'What resources do I have in this project?', updatedAt: now - 26 * 3600_000 }} />
        </View>
      </Section>
    </AssistantConfigProvider>
  )
}
