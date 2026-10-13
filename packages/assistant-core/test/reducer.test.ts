import type { UIMessage } from 'ai'
import type { A2AStreamResult, JsonRpcResponse } from '../src/a2a'
import { describe, expect, it } from 'vitest'
import { A2AStreamAdapter } from '../src/a2a'
import { applyAssistantEvent, turnOutcome } from '../src/reducer'
import { A2A_STREAM_FIXTURE, framesOf } from './helpers'

function base(): UIMessage[] {
  return [
    { id: 'u1', role: 'user', parts: [{ type: 'text', text: 'Hi' }] },
    { id: 'a1', role: 'assistant', parts: [] },
  ]
}

let n = 0
const newId = () => `gen-${++n}`

describe('applyAssistantEvent', () => {
  it('appends text deltas to one streaming text part', () => {
    let msgs = base()
    msgs = applyAssistantEvent(msgs, { type: 'text_delta', text: 'Hel' })
    msgs = applyAssistantEvent(msgs, { type: 'text_delta', text: 'lo' })
    expect(msgs[1]!.parts).toEqual([{ type: 'text', text: 'Hello', state: 'streaming' }])
  })

  it('leaves other messages (and the array, for an empty delta) untouched', () => {
    const msgs = base()
    const next = applyAssistantEvent(msgs, { type: 'text_delta', text: 'x' })
    expect(next).not.toBe(msgs)
    expect(next[0]).toBe(msgs[0])
    expect(applyAssistantEvent(msgs, { type: 'text_delta', text: '' })).toBe(msgs)
  })

  it('starts a new text part after a tool call, keeping message order', () => {
    let msgs = base()
    msgs = applyAssistantEvent(msgs, { type: 'text_delta', text: 'Checking. ' })
    msgs = applyAssistantEvent(msgs, { type: 'tool_start', id: 't1', name: 'alb__alb_list', summary: 'project=demo' }, { newId })
    msgs = applyAssistantEvent(msgs, { type: 'tool_finish', id: 't1', name: 'alb__alb_list', ok: true, elapsedMs: 12 })
    msgs = applyAssistantEvent(msgs, { type: 'text_delta', text: 'All good.' })
    expect(msgs[1]!.parts).toEqual([
      { type: 'text', text: 'Checking. ', state: 'streaming' },
      { type: 'dynamic-tool', toolName: 'alb__alb_list', toolCallId: 't1', input: { summary: 'project=demo' }, state: 'output-available', output: { ok: true, elapsedMs: 12 } },
      { type: 'text', text: 'All good.', state: 'streaming' },
    ])
  })

  it('marks a failed tool as output-error', () => {
    let msgs = applyAssistantEvent(base(), { type: 'tool_start', id: 't1', name: 'dns__dns_zones_list' })
    msgs = applyAssistantEvent(msgs, { type: 'tool_finish', id: 't1', name: 'dns__dns_zones_list', ok: false, elapsedMs: 5 })
    expect(msgs[1]!.parts[0]).toMatchObject({ state: 'output-error', errorText: 'dns__dns_zones_list failed', input: {} })
  })

  it('closes an id-less tool_finish against the latest running call of that name', () => {
    let msgs = base()
    msgs = applyAssistantEvent(msgs, { type: 'tool_start', name: 'a' }, { newId })
    msgs = applyAssistantEvent(msgs, { type: 'tool_start', name: 'b' }, { newId })
    msgs = applyAssistantEvent(msgs, { type: 'tool_finish', name: 'a', ok: true, elapsedMs: 1 })
    expect(msgs[1]!.parts.map(p => (p as { state: string }).state)).toEqual(['output-available', 'input-available'])
  })

  it('replaces the streamed text on text_replace (dropped-connection recovery)', () => {
    let msgs = applyAssistantEvent(base(), { type: 'text_delta', text: 'Partial ans' })
    msgs = applyAssistantEvent(msgs, { type: 'tool_start', id: 't', name: 'x' })
    msgs = applyAssistantEvent(msgs, { type: 'text_delta', text: 'more' })
    msgs = applyAssistantEvent(msgs, { type: 'text_replace', text: 'The full answer.' })
    expect(msgs[1]!.parts).toEqual([
      { type: 'text', text: 'The full answer.', state: 'streaming' },
      expect.objectContaining({ type: 'dynamic-tool', toolCallId: 't' }),
    ])
  })

  it('settles text parts on done and backfills the final text when none streamed', () => {
    let msgs = applyAssistantEvent(base(), { type: 'text_delta', text: 'Done.' })
    msgs = applyAssistantEvent(msgs, { type: 'done', state: 'completed', text: 'Done.' })
    expect(msgs[1]!.parts).toEqual([{ type: 'text', text: 'Done.', state: 'done' }])
    const backfilled = applyAssistantEvent(base(), { type: 'done', state: 'completed', text: 'Only final.' })
    expect(backfilled[1]!.parts).toEqual([{ type: 'text', text: 'Only final.', state: 'done' }])
  })

  it('stops tools still running when the turn ends', () => {
    let msgs = applyAssistantEvent(base(), { type: 'tool_start', id: 't', name: 'slow' })
    msgs = applyAssistantEvent(msgs, { type: 'done', state: 'canceled' })
    expect(msgs[1]!.parts[0]).toMatchObject({ state: 'output-error', errorText: 'Turn canceled' })
  })

  it('targets the message by id, else the last assistant message', () => {
    const msgs: UIMessage[] = [...base(), { id: 'u2', role: 'user', parts: [] }, { id: 'a2', role: 'assistant', parts: [] }]
    expect(applyAssistantEvent(msgs, { type: 'text_delta', text: 'x' })[3]!.parts).toHaveLength(1)
    expect(applyAssistantEvent(msgs, { type: 'text_delta', text: 'x' }, { messageId: 'a1' })[1]!.parts).toHaveLength(1)
    expect(applyAssistantEvent([msgs[0]!], { type: 'text_delta', text: 'x' })).toHaveLength(1)
  })

  it('builds the final message of the real staging stream', () => {
    const adapter = new A2AStreamAdapter()
    let msgs = base()
    for (const frame of framesOf(A2A_STREAM_FIXTURE)) {
      for (const event of adapter.push(frame as JsonRpcResponse<A2AStreamResult>))
        msgs = applyAssistantEvent(msgs, event, { newId })
    }
    const parts = msgs[1]!.parts
    expect(parts.filter(p => p.type === 'dynamic-tool').map(p => (p as { state: string }).state)).toEqual(['output-available', 'output-available', 'output-available'])
    const text = parts.filter(p => p.type === 'text')
    expect(text).toHaveLength(1)
    expect(text[0]).toMatchObject({ state: 'done', text: adapter.state.text })
  })
})

describe('turnOutcome', () => {
  it('maps terminal states to a chat status', () => {
    expect(turnOutcome({ type: 'done', state: 'completed' })).toEqual({ status: 'ready' })
    expect(turnOutcome({ type: 'done', state: 'canceled' })).toEqual({ status: 'ready' })
    const failed = turnOutcome({ type: 'done', state: 'failed', error: 'boom' })
    expect(failed.status).toBe('error')
    expect(failed.error?.message).toBe('boom')
  })
})
