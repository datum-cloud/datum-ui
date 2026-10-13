import type { FetchInit, FetchResponse } from '../src/transport'
import { describe, expect, it } from 'vitest'
import {
  deleteConversation,
  getAssistantEndpointUrl,
  getConversationMessages,
  listConversations,
  mergeChatSummaries,
  setConversationArchived,
  toChatSummary,
  toUIMessages,
} from '../src/history'

function fake(status: number, body: unknown) {
  const calls: { path: string, init?: FetchInit }[] = []
  const scopedFetch = async (path: string, init?: FetchInit): Promise<FetchResponse> => {
    calls.push({ path, init })
    const text = typeof body === 'string' ? body : JSON.stringify(body)
    return { ok: status < 300, status, headers: { get: () => 'application/json' }, body: null, text: async () => text }
  }
  return { scopedFetch, calls }
}

describe('history requests', () => {
  it('lists active or archived conversations in the project namespace', async () => {
    const { scopedFetch, calls } = fake(200, { items: [{ metadata: { name: 'a' } }] })
    expect(await listConversations(scopedFetch, 'demo')).toEqual([{ metadata: { name: 'a' } }])
    await listConversations(scopedFetch, 'demo', { archived: true })
    expect(calls.map(c => c.path)).toEqual([
      '/apis/assistant.miloapis.com/v1alpha1/namespaces/demo/conversations',
      '/apis/assistant.miloapis.com/v1alpha1/namespaces/demo/conversations?fieldSelector=spec.archived%3Dtrue',
    ])
  })

  it('archives with a merge patch', async () => {
    const { scopedFetch, calls } = fake(200, { metadata: { name: 'a' }, spec: { archived: true } })
    await setConversationArchived(scopedFetch, 'demo', 'a', true)
    expect(calls[0]).toMatchObject({
      path: '/apis/assistant.miloapis.com/v1alpha1/namespaces/demo/conversations/a',
      init: { method: 'PATCH', headers: { 'Content-Type': 'application/merge-patch+json' }, body: '{"spec":{"archived":true}}' },
    })
  })

  it('counts a 404 on delete as success, and throws other failures', async () => {
    await expect(deleteConversation(fake(404, '').scopedFetch, 'demo', 'a')).resolves.toBeUndefined()
    await expect(deleteConversation(fake(200, {}).scopedFetch, 'demo', 'a')).resolves.toBeUndefined()
    await expect(deleteConversation(fake(403, { message: 'forbidden' }).scopedFetch, 'demo', 'a')).rejects.toMatchObject({ status: 403 })
  })

  it('reads a transcript', async () => {
    const { scopedFetch, calls } = fake(200, { items: [{ seq: 1, role: 'user', content: 'hi', createdAt: '' }] })
    expect(await getConversationMessages(scopedFetch, 'demo', 'a')).toHaveLength(1)
    expect(calls[0]!.path).toBe('/apis/assistant.miloapis.com/v1alpha1/namespaces/demo/conversations/a/messages')
  })

  it('discovers the service URL, or undefined when unpublished', async () => {
    const { scopedFetch, calls } = fake(200, { metadata: { name: 'assistant' }, spec: { url: 'https://patch.example/' } })
    expect(await getAssistantEndpointUrl(scopedFetch)).toBe('https://patch.example')
    expect(calls[0]!.path).toBe('/apis/assistant.miloapis.com/v1alpha1/assistantendpoints/assistant')
    expect(await getAssistantEndpointUrl(fake(200, { metadata: { name: 'assistant' }, spec: { url: '' } }).scopedFetch)).toBeUndefined()
  })
})

describe('mapping', () => {
  it('titles a conversation by name, then title, then "New chat"', () => {
    const at = '2026-10-13T00:00:00Z'
    expect(toChatSummary({ metadata: { name: 'a' }, status: { title: 'T', name: 'N', lastActiveAt: at } })).toEqual({ id: 'a', title: 'N', updatedAt: Date.parse(at), archived: false, messages: [] })
    expect(toChatSummary({ metadata: { name: 'a' }, status: { title: 'T' } }).title).toBe('T')
    expect(toChatSummary({ metadata: { name: 'a', creationTimestamp: at }, spec: { archived: true } })).toMatchObject({ title: 'New chat', archived: true, updatedAt: Date.parse(at) })
  })

  it('merges lists newest first, without duplicates', () => {
    const c = (name: string, at: string) => ({ metadata: { name }, status: { lastActiveAt: at } })
    const merged = mergeChatSummaries([c('a', '2026-01-01T00:00:00Z'), c('b', '2026-03-01T00:00:00Z')], [c('a', '2026-01-01T00:00:00Z'), c('z', '2026-02-01T00:00:00Z')])
    expect(merged.map(m => m.id)).toEqual(['b', 'z', 'a'])
  })

  it('maps a stored transcript, labelling summaries and hiding system rows', () => {
    expect(toUIMessages([
      { seq: 1, role: 'system', content: 'internal', createdAt: '' },
      { seq: 2, role: 'summary', content: 'Earlier stuff', createdAt: '' },
      { seq: 3, role: 'user', content: 'Hi', createdAt: '' },
      { seq: 4, role: 'assistant', content: '**Hello**', createdAt: '' },
    ])).toEqual([
      { id: 'seq-2', role: 'assistant', parts: [{ type: 'text', text: '**Earlier conversation (summarized)**\n\nEarlier stuff', state: 'done' }] },
      { id: 'seq-3', role: 'user', parts: [{ type: 'text', text: 'Hi', state: 'done' }] },
      { id: 'seq-4', role: 'assistant', parts: [{ type: 'text', text: '**Hello**', state: 'done' }] },
    ])
  })
})
