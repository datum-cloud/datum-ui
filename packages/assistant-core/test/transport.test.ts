import type { FetchInit, FetchLike, FetchResponse } from '../src/transport'
import { describe, expect, it, vi } from 'vitest'
import { A2ARpcError } from '../src/a2a'
import { AssistantHttpError, createAssistantTransport, TurnInterruptedError } from '../src/transport'
import { A2A_STREAM_FIXTURE, streamOf } from './helpers'

function response(status: number, body: string, contentType = 'application/json', chunk = 64): FetchResponse {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: (name: string) => (name.toLowerCase() === 'content-type' ? contentType : null) },
    body: streamOf(body, chunk),
    text: async () => body,
  }
}

function setup(responses: FetchResponse[], extra: Partial<Parameters<typeof createAssistantTransport>[0]> = {}) {
  const calls: { url: string, init?: FetchInit }[] = []
  const fetch: FetchLike = async (url, init) => {
    calls.push({ url, init })
    const next = responses.shift()
    if (!next)
      throw new Error('unexpected request')
    return next
  }
  let id = 0
  const transport = createAssistantTransport({
    baseUrl: 'https://patch.example/',
    fetch,
    getToken: async () => 'token-1',
    newId: () => `id-${++id}`,
    sleep: async () => {},
    ...extra,
  })
  return { transport, calls }
}

async function collect<T>(gen: AsyncGenerator<T>): Promise<T[]> {
  const out: T[] = []
  for await (const item of gen) out.push(item)
  return out
}

const sendInput = { text: 'What resources do I have?', contextId: 'ctx-1', projectName: 'demo' }

describe('sendStreaming', () => {
  it('posts SendStreamingMessage with the bearer token and streams normalized events', async () => {
    const { transport, calls } = setup([response(200, A2A_STREAM_FIXTURE, 'text/event-stream')])
    const onTask = vi.fn()
    const events = await collect(transport.sendStreaming({ ...sendInput, onTask }))
    expect(calls).toHaveLength(1)
    expect(calls[0]!.url).toBe('https://patch.example/a2a')
    expect(calls[0]!.init?.headers).toMatchObject({ Authorization: 'Bearer token-1', Accept: 'text/event-stream' })
    const body = JSON.parse(calls[0]!.init!.body!)
    expect(body).toMatchObject({ jsonrpc: '2.0', method: 'SendStreamingMessage', params: { message: { role: 'ROLE_USER', contextId: 'ctx-1', parts: [{ text: sendInput.text }], metadata: { projectName: 'demo' } } } })
    expect(events.filter(e => e.type === 'tool_start')).toHaveLength(3)
    expect(events.at(-1)).toMatchObject({ type: 'done', state: 'completed' })
    expect(onTask).toHaveBeenCalledOnce()
    expect(onTask).toHaveBeenCalledWith({ taskId: '01a132c1-3f8d-7e66-ad83-c5c62d8ec249', contextId: 'b2abb5d3-bafd-42d0-9257-02fcc2355200' })
  })

  it('refreshes the token once on 401 and retries', async () => {
    const refreshToken = vi.fn(async () => 'token-2')
    const { transport, calls } = setup([response(401, 'nope'), response(200, A2A_STREAM_FIXTURE, 'text/event-stream')], { refreshToken })
    await collect(transport.sendStreaming(sendInput))
    expect(refreshToken).toHaveBeenCalledWith('token-1')
    expect(calls[1]!.init?.headers).toMatchObject({ Authorization: 'Bearer token-2' })
  })

  it('throws an AssistantHttpError (with the status in the message) for 401/403', async () => {
    const { transport } = setup([response(403, '{"error":"Authorization failed"}')])
    const failure = collect(transport.sendStreaming(sendInput))
    await expect(failure).rejects.toBeInstanceOf(AssistantHttpError)
    await expect(failure).rejects.toMatchObject({ status: 403, message: 'Authorization failed (HTTP 403)' })
  })

  it('throws a JSON-RPC validation error returned as plain JSON', async () => {
    const { transport } = setup([response(200, '{"jsonrpc":"2.0","id":1,"error":{"code":-32602,"message":"projectName is required"}}')])
    await expect(collect(transport.sendStreaming(sendInput))).rejects.toBeInstanceOf(A2ARpcError)
  })

  it('recovers a dropped stream by polling GetTask, replacing the fragment', async () => {
    const dropped = A2A_STREAM_FIXTURE.split('\n\n').slice(0, 10).join('\n\n')
    const stored = {
      jsonrpc: '2.0',
      id: 1,
      result: {
        id: '01a132c1-3f8d-7e66-ad83-c5c62d8ec249',
        status: { state: 'TASK_STATE_COMPLETED' },
        artifacts: [{ artifactId: 'response', parts: [{ text: 'The whole stored answer.' }] }],
      },
    }
    const running = { ...stored, result: { ...stored.result, status: { state: 'TASK_STATE_WORKING' } } }
    const onRecovering = vi.fn()
    const { transport, calls } = setup([
      response(200, dropped, 'text/event-stream'),
      response(200, JSON.stringify(running)),
      response(200, JSON.stringify(stored)),
    ])
    const events = await collect(transport.sendStreaming({ ...sendInput, onRecovering }))
    expect(onRecovering).toHaveBeenCalledWith('01a132c1-3f8d-7e66-ad83-c5c62d8ec249')
    expect(JSON.parse(calls[1]!.init!.body!)).toMatchObject({ method: 'GetTask', params: { id: '01a132c1-3f8d-7e66-ad83-c5c62d8ec249' } })
    expect(events.slice(-2)).toEqual([
      { type: 'text_replace', text: 'The whole stored answer.' },
      { type: 'done', state: 'completed', text: 'The whole stored answer.' },
    ])
  })

  it('gives up when a stream drops before any task id', async () => {
    const { transport } = setup([response(200, ': ping\n\n', 'text/event-stream')])
    await expect(collect(transport.sendStreaming(sendInput))).rejects.toBeInstanceOf(TurnInterruptedError)
  })

  it('stops when aborted, without polling', async () => {
    const controller = new AbortController()
    const { transport, calls } = setup([response(200, A2A_STREAM_FIXTURE, 'text/event-stream', 16)])
    const seen: string[] = []
    await expect((async () => {
      for await (const event of transport.sendStreaming({ ...sendInput, signal: controller.signal })) {
        seen.push(event.type)
        if (event.type === 'tool_start')
          controller.abort()
      }
    })()).rejects.toMatchObject({ name: 'AbortError' })
    expect(seen).toEqual(['tool_start'])
    expect(calls).toHaveLength(1)
  })
})

describe('cancel / getTask / rename', () => {
  it('cancels a running task', async () => {
    const { transport, calls } = setup([response(200, '{"jsonrpc":"2.0","id":1,"result":{"id":"t","status":{"state":"TASK_STATE_CANCELED"}}}')])
    await expect(transport.cancel('t')).resolves.toBe(true)
    expect(JSON.parse(calls[0]!.init!.body!)).toMatchObject({ method: 'CancelTask', params: { id: 't' } })
  })

  it('treats a finished or unknown task as nothing to cancel', async () => {
    const { transport } = setup([
      response(200, '{"jsonrpc":"2.0","id":1,"error":{"code":-32002,"message":"task cannot be canceled"}}'),
      response(200, '{"jsonrpc":"2.0","id":1,"error":{"code":-32001,"message":"not found"}}'),
    ])
    await expect(transport.cancel('t')).resolves.toBe(false)
    await expect(transport.cancel('t')).resolves.toBe(false)
  })

  it('renames through the service REST route', async () => {
    const { transport, calls } = setup([response(200, '{"renamed":true,"name":"DFW quota"}')])
    await expect(transport.rename({ contextId: 'c', projectName: 'p', name: '  DFW quota ' })).resolves.toEqual({ name: 'DFW quota' })
    expect(calls[0]!.url).toBe('https://patch.example/v1alpha1/conversations/rename')
    expect(JSON.parse(calls[0]!.init!.body!)).toEqual({ contextId: 'c', projectName: 'p', name: 'DFW quota' })
  })

  it('rejects empty and over-long names before calling the service', async () => {
    const { transport, calls } = setup([])
    await expect(transport.rename({ contextId: 'c', projectName: 'p', name: ' ' })).rejects.toThrow('required')
    await expect(transport.rename({ contextId: 'c', projectName: 'p', name: 'x'.repeat(81) })).rejects.toThrow('80')
    expect(calls).toHaveLength(0)
  })
})
