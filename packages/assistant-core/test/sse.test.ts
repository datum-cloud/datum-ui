import { describe, expect, it } from 'vitest'
import { parseAssistantEventStream, parseSSE, parseSSEBlock, parseSSEJson } from '../src/sse'
import { A2A_STREAM_FIXTURE, framesOf, streamOf } from './helpers'

async function collect<T>(gen: AsyncGenerator<T>): Promise<T[]> {
  const out: T[] = []
  for await (const item of gen) out.push(item)
  return out
}

describe('parseSSEBlock', () => {
  it('reads id, event and multi-line data', () => {
    expect(parseSSEBlock('id: 7\nevent: message\ndata: {"a":\ndata: 1}')).toEqual({ id: '7', event: 'message', data: '{"a":\n1}' })
  })
  it('keeps everything after the first colon and drops one leading space', () => {
    expect(parseSSEBlock('data:  two spaces: kept')?.data).toBe(' two spaces: kept')
  })
  it('ignores comment heartbeats and data-less blocks', () => {
    expect(parseSSEBlock(': ping')).toBeUndefined()
    expect(parseSSEBlock('id: 3')).toBeUndefined()
  })
})

describe('parseSSE', () => {
  it('yields every frame of the real staging stream whatever the chunking', async () => {
    const expected = framesOf(A2A_STREAM_FIXTURE)
    for (const size of [1, 7, 64, 4096]) {
      const messages = await collect(parseSSE(streamOf(A2A_STREAM_FIXTURE, size)))
      expect(messages.map(parseSSEJson)).toEqual(expected)
    }
    expect(expected).toHaveLength(22)
  })

  it('skips `: ping` comments between frames', async () => {
    const body = ': ping\n\ndata: {"n":1}\n\n: ping\n\ndata: {"n":2}\n\n'
    const messages = await collect(parseSSE(streamOf(body, 5)))
    expect(messages.map(m => m.data)).toEqual(['{"n":1}', '{"n":2}'])
  })

  it('normalizes CRLF, including a CRLF split across chunks', async () => {
    const body = 'data: {"n":1}\r\n\r\ndata: {"n":2}\r\n\r\n'
    for (let size = 1; size < body.length; size++) {
      const messages = await collect(parseSSE(streamOf(body, size)))
      expect(messages.map(m => m.data)).toEqual(['{"n":1}', '{"n":2}'])
    }
  })

  it('delivers a final event that has no trailing blank line', async () => {
    const messages = await collect(parseSSE(streamOf('data: {"n":1}\n\ndata: {"n":2}', 4)))
    expect(messages.map(m => m.data)).toEqual(['{"n":1}', '{"n":2}'])
  })

  it('decodes multi-byte UTF-8 split across chunks', async () => {
    const messages = await collect(parseSSE(streamOf('data: {"t":"héllo — ✓"}\n\n', 1)))
    expect(parseSSEJson(messages[0]!)).toEqual({ t: 'héllo — ✓' })
  })

  it('stops reading once the signal aborts', async () => {
    const controller = new AbortController()
    const seen: string[] = []
    for await (const m of parseSSE(streamOf('data: 1\n\ndata: 2\n\ndata: 3\n\n', 1), { signal: controller.signal })) {
      seen.push(m.data)
      controller.abort()
    }
    expect(seen).toEqual(['1'])
  })
})

describe('parseSSEJson', () => {
  it('returns undefined for [DONE], empty and non-JSON data', () => {
    expect(parseSSEJson({ data: '[DONE]' })).toBeUndefined()
    expect(parseSSEJson({ data: '' })).toBeUndefined()
    expect(parseSSEJson({ data: 'nope' })).toBeUndefined()
  })
})

describe('parseAssistantEventStream', () => {
  it('yields the flat vocabulary and skips unknown shapes', async () => {
    const body = [
      'data: {"type":"tool_start","id":"t1","name":"alb__alb_list"}',
      'data: {"type":"mystery"}',
      'data: {"type":"text_delta","text":"Hi"}',
      'data: {"type":"done","state":"completed","text":"Hi"}',
    ].join('\n\n')
    const events = await collect(parseAssistantEventStream(streamOf(body, 9)))
    expect(events.map(e => e.type)).toEqual(['tool_start', 'text_delta', 'done'])
  })
})
