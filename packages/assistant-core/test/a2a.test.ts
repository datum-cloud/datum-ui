import type { A2AStreamResult, JsonRpcResponse } from '../src/a2a'
import type { AssistantStreamEvent } from '../src/events'
import { describe, expect, it } from 'vitest'
import { A2ARpcError, A2AStreamAdapter, buildSendParams, taskResponseText, terminalState } from '../src/a2a'
import { A2A_STREAM_FIXTURE, framesOf } from './helpers'

type Frame = JsonRpcResponse<A2AStreamResult>

function run(frames: Frame[]): { events: AssistantStreamEvent[], adapter: A2AStreamAdapter } {
  const adapter = new A2AStreamAdapter()
  return { events: frames.flatMap(f => adapter.push(f)), adapter }
}

const ctx = { taskId: 'task-1', contextId: 'ctx-1' }
function status(state: string, parts?: unknown[]): Frame {
  return {
    jsonrpc: '2.0',
    id: 1,
    result: { statusUpdate: { ...ctx, status: { state, ...(parts ? { message: { role: 'ROLE_AGENT', parts } } : {}) } } } as unknown as A2AStreamResult,
  }
}
function artifact(text: string, append?: boolean, artifactId = 'response'): Frame {
  return {
    jsonrpc: '2.0',
    id: 1,
    result: { artifactUpdate: { ...ctx, artifact: { artifactId, parts: [{ text }] }, ...(append ? { append } : {}) } },
  }
}

describe('frames captured from staging (fixture)', () => {
  const frames = framesOf(A2A_STREAM_FIXTURE) as Frame[]
  const { events, adapter } = run(frames)

  it('tracks the task and conversation ids from the first frame', () => {
    expect(adapter.state.taskId).toBe('01a132c1-3f8d-7e66-ad83-c5c62d8ec249')
    expect(adapter.state.contextId).toBe('b2abb5d3-bafd-42d0-9257-02fcc2355200')
  })

  it('maps tool-activity status updates to tool_start / tool_finish pairs', () => {
    const tools = events.filter(e => e.type === 'tool_start' || e.type === 'tool_finish')
    expect(tools).toEqual([
      { type: 'tool_start', id: 'toolu_01FYoQVEV9Ueu1XUMFEQb8WR', name: 'dns__dns_zones_list' },
      { type: 'tool_start', id: 'toolu_01B3rUg2A4faAkmC7rJMfcpQ', name: 'compute__compute_workloads_list' },
      { type: 'tool_start', id: 'toolu_01RjVmPYTJeaLGDRWfePPsYE', name: 'alb__alb_list' },
      { type: 'tool_finish', id: 'toolu_01FYoQVEV9Ueu1XUMFEQb8WR', name: 'dns__dns_zones_list', ok: true, elapsedMs: 88 },
      { type: 'tool_finish', id: 'toolu_01B3rUg2A4faAkmC7rJMfcpQ', name: 'compute__compute_workloads_list', ok: true, elapsedMs: 403 },
      { type: 'tool_finish', id: 'toolu_01RjVmPYTJeaLGDRWfePPsYE', name: 'alb__alb_list', ok: true, elapsedMs: 959 },
    ])
  })

  it('streams the "response" artifact chunks as text deltas, in order', () => {
    const deltas = events.filter(e => e.type === 'text_delta')
    expect(deltas).toHaveLength(13)
    const streamed = deltas.map(e => (e as { text: string }).text).join('')
    expect(streamed.startsWith('Here\'s the rundown')).toBe(true)
    expect(adapter.state.text).toBe(streamed)
  })

  it('ends on TASK_STATE_COMPLETED with the final message as the authoritative text', () => {
    const last = events.at(-1)
    expect(last).toEqual({ type: 'done', state: 'completed', text: adapter.state.text })
    expect(adapter.state.terminal).toBe('completed')
    expect(events.filter(e => e.type === 'done')).toHaveLength(1)
  })

  it('never emits text_replace for a well-formed stream', () => {
    expect(events.some(e => e.type === 'text_replace')).toBe(false)
  })
})

describe('the A2A stream adapter', () => {
  it('reports a failed task with the agent message as the error', () => {
    const { events } = run([status('TASK_STATE_FAILED', [{ text: 'Agent run failed: boom' }])])
    expect(events).toEqual([{ type: 'done', state: 'failed', error: 'Agent run failed: boom' }])
  })

  it('treats a rejected task as failed, and a canceled one as canceled', () => {
    expect(run([status('TASK_STATE_REJECTED')]).events).toEqual([{ type: 'done', state: 'failed', error: 'The request failed.' }])
    expect(run([status('TASK_STATE_CANCELED')]).events).toEqual([{ type: 'done', state: 'canceled' }])
  })

  it('ignores working updates without tool data, and other data parts', () => {
    const { events } = run([status('TASK_STATE_WORKING'), status('TASK_STATE_WORKING', [{ data: { kind: 'something_else' } }])])
    expect(events).toEqual([])
  })

  it('defaults a missing ok/elapsedMs on tool_finish', () => {
    const { events } = run([status('TASK_STATE_WORKING', [{ data: { kind: 'tool_call', phase: 'finished', name: 'x' } }])])
    expect(events).toEqual([{ type: 'tool_finish', name: 'x', ok: false, elapsedMs: 0 }])
  })

  it('turns a fresh (non-append) chunk of an artifact it already has into a replace', () => {
    const { events, adapter } = run([artifact('Hel'), artifact('lo', true), artifact('Hello, again')])
    expect(events).toEqual([
      { type: 'text_delta', text: 'Hel' },
      { type: 'text_delta', text: 'lo' },
      { type: 'text_replace', text: 'Hello, again' },
    ])
    expect(adapter.state.text).toBe('Hello, again')
  })

  it('ignores artifacts other than "response"', () => {
    expect(run([artifact('debug', false, 'trace')]).events).toEqual([])
  })

  it('ignores frames after the terminal state', () => {
    const { events } = run([artifact('a'), status('TASK_STATE_COMPLETED'), artifact('b', true)])
    expect(events).toEqual([{ type: 'text_delta', text: 'a' }, { type: 'done', state: 'completed', text: 'a' }])
  })

  it('throws a JSON-RPC error as A2ARpcError with its code', () => {
    const adapter = new A2AStreamAdapter()
    expect(() => adapter.push({ jsonrpc: '2.0', id: 1, error: { code: -32602, message: 'projectName is required' } }))
      .toThrowError(expect.objectContaining({ name: 'A2ARpcError', code: -32602 }) as unknown as Error)
    try {
      adapter.push({ jsonrpc: '2.0', id: 1, error: { code: -32602, message: 'x' } })
    }
    catch (error) {
      expect(error).toBeInstanceOf(A2ARpcError)
    }
  })

  it('treats a direct message result as the whole answer', () => {
    const { events } = run([{ jsonrpc: '2.0', id: 1, result: { message: { role: 'ROLE_AGENT', parts: [{ text: 'Hi' }] } } }])
    expect(events).toEqual([{ type: 'text_delta', text: 'Hi' }, { type: 'done', state: 'completed', text: 'Hi' }])
  })

  it('recovers from a stored task: the stored answer replaces a fragment', () => {
    const adapter = new A2AStreamAdapter()
    adapter.push(artifact('Here is the fra'))
    const events = adapter.onTask({
      id: 'task-1',
      status: { state: 'TASK_STATE_COMPLETED' },
      artifacts: [{ artifactId: 'response', parts: [{ text: 'Here is the ' }, { text: 'full answer.' }] }],
    })
    expect(events).toEqual([
      { type: 'text_replace', text: 'Here is the full answer.' },
      { type: 'done', state: 'completed', text: 'Here is the full answer.' },
    ])
  })

  it('does nothing for a stored task that is still running', () => {
    expect(new A2AStreamAdapter().onTask({ id: 't', status: { state: 'TASK_STATE_WORKING' } })).toEqual([])
  })
})

describe('helpers', () => {
  it('terminalState maps only the terminal enums', () => {
    expect(terminalState('TASK_STATE_WORKING')).toBeUndefined()
    expect(terminalState('TASK_STATE_SUBMITTED')).toBeUndefined()
    expect(terminalState('TASK_STATE_COMPLETED')).toBe('completed')
  })

  it('taskResponseText prefers the response artifact', () => {
    expect(taskResponseText({ id: 't', artifacts: [{ artifactId: 'other', parts: [{ text: 'x' }] }, { artifactId: 'response', parts: [{ text: 'y' }] }] })).toBe('y')
    expect(taskResponseText({ id: 't', artifacts: [{ artifactId: 'other', parts: [{ text: 'x' }] }] })).toBe('x')
  })

  it('buildSendParams speaks the strict v1.0 wire', () => {
    expect(buildSendParams({
      text: '@HTTPProxy/web What is wrong?',
      contextId: 'ctx',
      projectName: 'demo',
      messageId: 'm1',
      mentions: [{ kind: 'HTTPProxy', name: 'web', apiGroup: 'networking.datumapis.com' }, { kind: 'Workload', name: 'api' }],
    })).toEqual({
      message: {
        role: 'ROLE_USER',
        messageId: 'm1',
        contextId: 'ctx',
        parts: [{ text: '@HTTPProxy/web What is wrong?' }],
        metadata: {
          projectName: 'demo',
          mentions: [{ kind: 'HTTPProxy', name: 'web', apiGroup: 'networking.datumapis.com' }, { kind: 'Workload', name: 'api' }],
        },
      },
    })
    const plain = buildSendParams({ text: 'hi', contextId: 'c', projectName: 'p', messageId: 'm' })
    expect(plain.message.metadata).toEqual({ projectName: 'p' })
    expect(JSON.stringify(plain)).not.toContain('"kind"')
  })
})
