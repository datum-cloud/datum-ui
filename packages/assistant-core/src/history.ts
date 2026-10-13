import type { UIMessage } from 'ai'
import type { FetchInit, FetchResponse } from './transport'
import type { ChatSummary } from './types'
import { NEW_CHAT_TITLE } from './format'
import { httpError } from './transport'

/**
 * Conversation history: the aggregated apiserver's read view
 * (`assistant.miloapis.com/v1alpha1`), plus archive and delete.
 *
 * Every function takes a fetch-like `scopedFetch` that is already scoped to
 * the project's control plane and authenticated — the portal's
 * `usePluginFetch()`, or a mobile wrapper that prefixes
 * `/apis/resourcemanager.miloapis.com/v1alpha1/projects/{project}/control-plane`.
 * The namespace segment must still be the project name: the server checks it
 * against the project the request is scoped to.
 *
 * Sending is not here on purpose: the apiserver's `sendmessage` subresource
 * runs tools without the caller's own token. Chat goes to the service's A2A
 * endpoint (`transport.ts`).
 */
export type ScopedFetch = (path: string, init?: FetchInit) => Promise<FetchResponse>

const GROUP_VERSION = 'assistant.miloapis.com/v1alpha1'

/** A conversation as the apiserver lists it (pkg/apis/assistant/v1alpha1.Conversation). */
export interface Conversation {
  metadata: {
    /** Resource name — also the conversation/context id. */
    name: string
    namespace?: string
    creationTimestamp?: string
  }
  spec?: {
    archived?: boolean
  }
  status?: {
    lastActiveAt?: string
    messageCount?: number
    title?: string
    /** User-given name; wins over the generated `title`. */
    name?: string
    archivedAt?: string
  }
}

/** A stored turn of a transcript (v1alpha1.ConversationMessage). Content is markdown text. */
export interface StoredMessage {
  seq: number
  role: 'user' | 'assistant' | 'system' | 'summary'
  content: string
  createdAt: string
}

/** The cluster-scoped resource that says where the assistant service lives. */
export interface AssistantEndpoint {
  metadata: { name: string }
  spec?: { url?: string, agentCardPath?: string }
}

export const ASSISTANT_ENDPOINT_NAME = 'assistant'

export function conversationsPath(projectName: string): string {
  return `/apis/${GROUP_VERSION}/namespaces/${encodeURIComponent(projectName)}/conversations`
}

export function conversationPath(projectName: string, conversationName: string): string {
  return `${conversationsPath(projectName)}/${encodeURIComponent(conversationName)}`
}

async function readJson<T>(res: FetchResponse): Promise<T> {
  if (!res.ok)
    throw await httpError(res)
  return JSON.parse(await res.text()) as T
}

/**
 * `GET .../conversations`. The server lists non-archived conversations by
 * default; `archived: true` lists only the archived ones (the sets are disjoint).
 */
export async function listConversations(
  scopedFetch: ScopedFetch,
  projectName: string,
  opts: { archived?: boolean, signal?: AbortSignal } = {},
): Promise<Conversation[]> {
  const query = opts.archived ? `?fieldSelector=${encodeURIComponent('spec.archived=true')}` : ''
  const data = await readJson<{ items?: Conversation[] }>(await scopedFetch(`${conversationsPath(projectName)}${query}`, {
    headers: { Accept: 'application/json' },
    signal: opts.signal,
  }))
  return data.items ?? []
}

/** `PATCH .../conversations/{name}` (merge patch on `spec.archived`): archive or restore. */
export async function setConversationArchived(
  scopedFetch: ScopedFetch,
  projectName: string,
  conversationName: string,
  archived: boolean,
): Promise<Conversation> {
  return readJson<Conversation>(await scopedFetch(conversationPath(projectName, conversationName), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/merge-patch+json', 'Accept': 'application/json' },
    body: JSON.stringify({ spec: { archived } }),
  }))
}

/** `DELETE .../conversations/{name}`: permanent. A 404 means it is already gone, which counts as success. */
export async function deleteConversation(
  scopedFetch: ScopedFetch,
  projectName: string,
  conversationName: string,
): Promise<void> {
  const res = await scopedFetch(conversationPath(projectName, conversationName), {
    method: 'DELETE',
    headers: { Accept: 'application/json' },
  })
  if (res.status === 404 || res.ok) {
    await res.text().catch(() => '')
    return
  }
  throw await httpError(res)
}

/** `GET .../conversations/{name}/messages`: the transcript. */
export async function getConversationMessages(
  scopedFetch: ScopedFetch,
  projectName: string,
  conversationName: string,
  opts: { signal?: AbortSignal } = {},
): Promise<StoredMessage[]> {
  const data = await readJson<{ items?: StoredMessage[] }>(await scopedFetch(`${conversationPath(projectName, conversationName)}/messages`, {
    headers: { Accept: 'application/json' },
    signal: opts.signal,
  }))
  return data.items ?? []
}

/** `GET .../assistantendpoints/assistant`: the service's base URL, or undefined when it isn't published. */
export async function getAssistantEndpointUrl(scopedFetch: ScopedFetch, opts: { signal?: AbortSignal } = {}): Promise<string | undefined> {
  const endpoint = await readJson<AssistantEndpoint>(await scopedFetch(`/apis/${GROUP_VERSION}/assistantendpoints/${ASSISTANT_ENDPOINT_NAME}`, {
    headers: { Accept: 'application/json' },
    signal: opts.signal,
  }))
  const url = endpoint.spec?.url?.trim()
  return url ? url.replace(/\/+$/, '') : undefined
}

/** A listed conversation as a history row. Transcripts are fetched when a chat is opened. */
export function toChatSummary(conversation: Conversation): ChatSummary {
  const { metadata, spec, status } = conversation
  return {
    id: metadata.name,
    title: status?.name || status?.title || NEW_CHAT_TITLE,
    updatedAt: Date.parse(status?.lastActiveAt ?? metadata.creationTimestamp ?? '') || 0,
    archived: spec?.archived ?? false,
    messages: [],
  }
}

/** Merges active and archived lists into one history, newest activity first. */
export function mergeChatSummaries(...lists: Conversation[][]): ChatSummary[] {
  const byId = new Map<string, ChatSummary>()
  for (const conversation of lists.flat()) {
    const summary = toChatSummary(conversation)
    if (!byId.has(summary.id))
      byId.set(summary.id, summary)
  }
  return [...byId.values()].sort((a, b) => b.updatedAt - a.updatedAt)
}

export const SUMMARY_HEADING = '**Earlier conversation (summarized)**'

/**
 * Stored transcript → `UIMessage[]`.
 *
 * `summary` rows are the server's compaction of older turns: they render as an
 * assistant message under an "Earlier conversation (summarized)" heading, since
 * they're model-written context, not a reply to the message before them.
 * `system` rows are internal and never shown.
 */
export function toUIMessages(stored: StoredMessage[]): UIMessage[] {
  const out: UIMessage[] = []
  for (const m of stored) {
    const id = `seq-${m.seq}`
    switch (m.role) {
      case 'user':
      case 'assistant':
        out.push({ id, role: m.role, parts: [{ type: 'text', text: m.content, state: 'done' }] })
        break
      case 'summary':
        out.push({
          id,
          role: 'assistant',
          parts: [{ type: 'text', text: `${SUMMARY_HEADING}\n\n${m.content}`, state: 'done' }],
        })
        break
    }
  }
  return out
}
